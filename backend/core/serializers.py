import json
from decimal import Decimal
from pathlib import Path
from django.db import transaction
from django.utils import timezone
from rest_framework import serializers
from .models import *


class TenantSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()
    vat_certificate_url = serializers.SerializerMethodField()
    class Meta:
        model = Tenant
        fields = "__all__"
        read_only_fields = ("zatca_data",)
    def _url(self, obj, field):
        f = getattr(obj, field)
        if not f: return ""
        request = self.context.get("request")
        return request.build_absolute_uri(f.url) if request else f.url
    def get_logo_url(self, obj):
        if not obj.logo: return ""
        path = f"/api/public/tenants/{obj.pk}/logo/"
        request = self.context.get("request")
        return request.build_absolute_uri(path) if request else path
    def get_vat_certificate_url(self, obj):
        return f"/tenants/{obj.pk}/vat-certificate/" if obj.vat_certificate else ""
    def validate_vat_certificate(self, file):
        if file.size > 8 * 1024 * 1024:
            raise serializers.ValidationError("حجم الشهادة يتجاوز 8MB.")
        if Path(file.name).suffix.lower() not in {".pdf", ".png", ".jpg", ".jpeg", ".webp"}:
            raise serializers.ValidationError("الصيغ المقبولة: PDF أو PNG أو JPG أو WEBP.")
        return file


class UserSerializer(serializers.ModelSerializer):
    tenant_id = serializers.UUIDField(source="tenant.id", read_only=True)
    tenant_name = serializers.CharField(source="tenant.name", read_only=True)
    tenant_logo_url = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True, required=False, min_length=6)
    class Meta:
        model = User
        fields = ("id", "email", "manager_name", "first_name", "role", "permission_scope", "tenant_id",
                  "tenant_name", "tenant_logo_url", "is_active", "is_tenant_owner", "is_staff", "is_superuser",
                  "date_joined", "password")
        read_only_fields = ("is_staff", "is_superuser", "date_joined")
    def get_tenant_logo_url(self, obj):
        if not obj.tenant or not obj.tenant.logo: return ""
        path = f"/api/public/tenants/{obj.tenant_id}/logo/"
        request = self.context.get("request")
        return request.build_absolute_uri(path) if request else path
    def create(self, data):
        password = data.pop("password", None)
        return User.objects.create_user(password=password, **data)
    def update(self, obj, data):
        password = data.pop("password", None)
        obj = super().update(obj, data)
        if password: obj.set_password(password); obj.save(update_fields=["password"])
        return obj


class PlanSerializer(serializers.ModelSerializer):
    class Meta: model, fields = SubscriptionPlan, "__all__"

class SubscriptionSerializer(serializers.ModelSerializer):
    tenant_id = serializers.PrimaryKeyRelatedField(source="tenant", queryset=Tenant.objects.all())
    plan_id = serializers.PrimaryKeyRelatedField(source="plan", queryset=SubscriptionPlan.objects.all())
    tenant_name = serializers.CharField(source="tenant.name", read_only=True)
    plan_name = serializers.CharField(source="plan.name", read_only=True)
    class Meta:
        model = Subscription
        fields = ("id", "tenant_id", "tenant_name", "plan_id", "plan_name", "status", "starts_at", "ends_at", "created_at", "updated_at")

class ClientSerializer(serializers.ModelSerializer):
    tenant_name = serializers.CharField(source="tenant.name", read_only=True)
    class Meta:
        model = Client
        exclude = ("tenant",)

class ProductSerializer(serializers.ModelSerializer):
    tenant_name = serializers.CharField(source="tenant.name", read_only=True)
    class Meta:
        model = Product
        exclude = ("tenant",)

class InvoiceLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceLine
        exclude = ("tenant", "invoice")

class InvoiceSerializer(serializers.ModelSerializer):
    lines = InvoiceLineSerializer(many=True, required=False)
    buyer_certificate = serializers.FileField(write_only=True, required=False)
    client_name = serializers.CharField(source="client.name", read_only=True)
    tenant_name = serializers.CharField(source="tenant.name", read_only=True)
    class Meta:
        model = Invoice
        exclude = ("tenant",)
        read_only_fields = ("invoice_number", "subtotal", "tax_amount", "total_amount", "zatca_status", "zatca_response")
    def validate(self, data):
        if self.instance and self.instance.status in {"issued", "reported", "cleared"}:
            raise serializers.ValidationError("لا يمكن تعديل فاتورة صادرة.")
        request = self.context["request"]
        client = data.get("client") or getattr(self.instance, "client", None)
        if client and client.tenant_id != request.user.tenant_id:
            raise serializers.ValidationError({"client": "العميل لا يتبع منشأة المستخدم."})
        lines = data.get("lines", [])
        if not self.instance and not lines:
            raise serializers.ValidationError({"lines": "يجب إضافة بند واحد على الأقل."})
        for index, line in enumerate(lines):
            if not str(line.get("description", "")).strip():
                raise serializers.ValidationError({"lines": f"وصف البند رقم {index + 1} مطلوب."})
            if Decimal(str(line.get("quantity", 0))) <= 0 or Decimal(str(line.get("unit_price", 0))) < 0:
                raise serializers.ValidationError({"lines": f"قيم البند رقم {index + 1} غير صالحة."})
        return data
    @transaction.atomic
    def create(self, data):
        data.pop("tenant", None)
        lines = data.pop("lines", [])
        buyer_certificate = data.pop("buyer_certificate", None)
        request = self.context["request"]
        tenant = Tenant.objects.select_for_update().get(pk=request.user.tenant_id)
        try:
            invoice_content = json.loads(data.get("xml_content") or "{}")
        except (TypeError, ValueError):
            invoice_content = {}
        invoice_content.update({
            "company_name": tenant.name,
            "seller": request.user.manager_name or request.user.first_name or request.user.email,
            "vat_number": tenant.tax_registration_number,
            "cr_number": tenant.commercial_registration_number,
            "address": tenant.address_text or "، ".join(filter(None, [
                tenant.street_name, tenant.building_number, tenant.city_subdivision,
                tenant.location_city, tenant.postal_zone,
            ])),
        })
        data["xml_content"] = json.dumps(invoice_content, ensure_ascii=False)
        client = data.get("client")
        client_defaults = {
            "vat_number": invoice_content.get("buyer_vat_number", ""),
            "city": invoice_content.get("buyer_city", ""),
            "street_name": invoice_content.get("buyer_street", ""),
            "building_number": invoice_content.get("buyer_building_number", ""),
            "city_subdivision": invoice_content.get("buyer_district", ""),
            "postal_zone": invoice_content.get("buyer_postal_code", ""),
        }
        if buyer_certificate and not client:
            raise serializers.ValidationError({
                "buyer_certificate": "اختر عميلًا محفوظًا قبل إرفاق شهادته."
            })
        if client:
            for field, value in client_defaults.items():
                if value: setattr(client, field, value)
            if buyer_certificate:
                if buyer_certificate.size > 8 * 1024 * 1024:
                    raise serializers.ValidationError({"buyer_certificate": "حجم المرفق يتجاوز 8MB."})
                if Path(buyer_certificate.name).suffix.lower() not in {".pdf", ".png", ".jpg", ".jpeg", ".webp"}:
                    raise serializers.ValidationError({"buyer_certificate": "الصيغ المقبولة: PDF أو PNG أو JPG أو WEBP."})
                if client.registration_certificate:
                    client.registration_certificate.delete(save=False)
                client.registration_certificate = buyer_certificate
            client.save()
        sequence = Invoice.objects.filter(tenant=tenant).count() + 1
        data["invoice_number"] = request.data.get("invoice_number") or f"INV-{timezone.localdate():%Y%m}-{sequence:05d}"
        invoice = Invoice.objects.create(tenant=tenant, **data)
        self._save_lines(invoice, lines or request.data.get("items", []))
        return invoice
    @transaction.atomic
    def update(self, invoice, data):
        lines = data.pop("lines", None)
        invoice = super().update(invoice, data)
        if lines is not None:
            invoice.lines.all().delete()
            self._save_lines(invoice, lines)
        return invoice
    def _save_lines(self, invoice, lines):
        subtotal = Decimal("0")
        tax_amount = Decimal("0")
        normalized = []
        for row in lines:
            qty, price = Decimal(str(row.get("quantity", 1))), Decimal(str(row.get("unit_price", row.get("price", 0))))
            tax_rate = Decimal(str(row.get("tax_rate", 15)))
            total = (qty * price).quantize(Decimal("0.01"))
            normalized.append(InvoiceLine(invoice=invoice, tenant=invoice.tenant, description=row.get("description", "خدمة"),
                                          quantity=qty, unit_price=price, tax_rate=tax_rate, line_total=total))
            subtotal += total
            tax_amount += (total * tax_rate / Decimal("100")).quantize(Decimal("0.01"))
        if normalized: InvoiceLine.objects.bulk_create(normalized)
        elif invoice.xml_content:
            try:
                content = json.loads(invoice.xml_content)
                subtotal = Decimal(str(content.get("subtotal", content.get("net", 0))))
                tax_amount = Decimal(str(content.get("tax_amount", subtotal * Decimal("0.15"))))
            except (ValueError, TypeError): pass
        invoice.subtotal = subtotal
        invoice.tax_amount = tax_amount.quantize(Decimal("0.01"))
        invoice.total_amount = invoice.subtotal + invoice.tax_amount
        invoice.save(update_fields=["subtotal", "tax_amount", "total_amount"])

class CreditNoteSerializer(serializers.ModelSerializer):
    invoice_number = serializers.CharField(source="invoice.invoice_number", read_only=True)
    class Meta:
        model = CreditNote
        exclude = ("tenant",)
    def validate_invoice(self, invoice):
        if invoice.tenant_id != self.context["request"].user.tenant_id:
            raise serializers.ValidationError("الفاتورة لا تتبع منشأة المستخدم.")
        return invoice

class DebitNoteSerializer(serializers.ModelSerializer):
    invoice_number = serializers.CharField(source="invoice.invoice_number", read_only=True)
    class Meta:
        model = DebitNote
        exclude = ("tenant",)
    def validate_invoice(self, invoice):
        if invoice.tenant_id != self.context["request"].user.tenant_id:
            raise serializers.ValidationError("الفاتورة لا تتبع منشأة المستخدم.")
        return invoice

class AuditLogSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source="user.email", read_only=True)
    actor_email = serializers.SerializerMethodField()
    target_type = serializers.SerializerMethodField()
    target_id = serializers.SerializerMethodField()
    target_label = serializers.SerializerMethodField()
    tenant_name = serializers.CharField(source="tenant.name", read_only=True)
    class Meta: model, fields = AuditLog, "__all__"
    def get_actor_email(self, obj):
        return (obj.details or {}).get("actor_email") or (obj.user.email if obj.user else "")
    def get_target_type(self, obj):
        details = obj.details or {}
        return details.get("target_type") or obj.action.split("_", 1)[0]
    def get_target_id(self, obj):
        details = obj.details or {}
        return str(details.get("target_id") or details.get("client_id") or details.get("id") or "")
    def get_target_label(self, obj):
        details = obj.details or {}
        for key in ("target_label", "invoice_number", "user_email", "client_name", "product_name", "tenant_name", "email"):
            if details.get(key):
                return str(details[key])
        target_type = self.get_target_type(obj)
        if target_type == "invoice":
            target_id = self.get_target_id(obj)
            if target_id:
                invoice_number = Invoice.objects.filter(
                    pk=target_id, tenant_id=obj.tenant_id
                ).values_list("invoice_number", flat=True).first()
                if invoice_number:
                    return invoice_number
        if target_type == "client":
            target_id = self.get_target_id(obj)
            if target_id:
                client_name = Client.objects.filter(
                    pk=target_id, tenant_id=obj.tenant_id
                ).values_list("name", flat=True).first()
                if client_name:
                    return client_name
        return ""

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        exclude = ("tenant",)

class MessageSerializer(serializers.ModelSerializer):
    sender_email = serializers.CharField(source="sender.email", read_only=True)
    class Meta:
        model = SupportMessage
        fields = "__all__"
        read_only_fields = ("conversation", "sender", "sender_type")

class ConversationSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    customer_email = serializers.CharField(source="customer.email", read_only=True)
    tenant_name = serializers.CharField(source="tenant.name", read_only=True)
    unread_customer = serializers.SerializerMethodField()
    subscription = serializers.SerializerMethodField()
    class Meta:
        model = SupportConversation
        fields = "__all__"
        read_only_fields = ("tenant", "customer", "assigned_to")
    def get_unread_customer(self, obj): return obj.messages.filter(sender_type="agent", is_read=False, is_internal=False).count()
    def get_subscription(self, obj):
        try: return {"plan": obj.tenant.subscription.plan.name, "status": obj.tenant.subscription.status}
        except Subscription.DoesNotExist: return None

class KnowledgeSerializer(serializers.ModelSerializer):
    class Meta: model, fields = KnowledgeArticle, "__all__"
class CannedSerializer(serializers.ModelSerializer):
    class Meta: model, fields = CannedResponse, "__all__"
class SupportSettingsSerializer(serializers.ModelSerializer):
    class Meta: model, fields = SupportSettings, "__all__"
