import mimetypes
from pathlib import Path
from urllib.parse import urlencode
from django.conf import settings
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.mail import send_mail
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.db import connection, transaction
from django.db.models import Avg, Count, Q, Sum
from django.http import FileResponse, Http404
from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .access import FullAccess, PlatformOnly, full_access, is_platform
from .authentication import set_database_context
from .certificate_extraction import extract_certificate
from .models import *
from .serializers import *


def audit(request, action, details=None, tenant=None, target=None):
    tenant = tenant or request.user.tenant
    if not tenant:
        return
    payload = dict(details or {})
    payload.setdefault("actor_email", request.user.email)
    payload.setdefault("actor_id", str(request.user.pk))
    if target is not None:
        model_name = target._meta.model_name
        if model_name == "user":
            label = target.manager_name or target.get_full_name() or target.email
        elif model_name in {"tenant", "client", "product"}:
            label = target.name
        elif model_name == "invoice":
            label = target.invoice_number
        elif model_name in {"creditnote", "debitnote"}:
            label = target.note_number
        else:
            label = str(target)
        payload.update({
            "target_type": model_name,
            "target_id": str(target.pk),
            "target_label": str(label),
        })
    AuditLog.objects.create(
        tenant=tenant, user=request.user, action=action, details=payload
    )

def scoped(qs, user):
    if is_platform(user): return qs
    if qs.model is Tenant: return qs.filter(pk=user.tenant_id)
    return qs.filter(tenant=user.tenant)


@api_view(["GET"])
@permission_classes([AllowAny])
def public_tenant_logo(request, tenant_id):
    if connection.vendor == "postgresql":
        with connection.cursor() as cursor:
            cursor.execute("SELECT set_config('app.tenant_id', %s, false)", [str(tenant_id)])
    tenant = get_object_or_404(Tenant, pk=tenant_id)
    if not tenant.logo:
        raise Http404
    logo_file = tenant.logo.open("rb")
    content_type = mimetypes.guess_type(tenant.logo.name)[0] or "application/octet-stream"
    try:
        from PIL import Image
        image_format = Image.open(logo_file).format
        content_type = Image.MIME.get(image_format, content_type)
        logo_file.seek(0)
    except Exception:
        logo_file.seek(0)
    response = FileResponse(logo_file, content_type=content_type)
    response["Cache-Control"] = "public, max-age=3600"
    return response

def enforce_plan_limit(tenant, resource):
    if not tenant: raise serializers.ValidationError("لا توجد منشأة مرتبطة بالحساب.")
    try:
        subscription = tenant.subscription
    except Subscription.DoesNotExist:
        return
    if subscription.status != "active": raise serializers.ValidationError("اشتراك المنشأة غير نشط.")
    limits = {
        "users": (subscription.plan.max_users, User.objects.filter(tenant=tenant).count()),
        "clients": (subscription.plan.max_clients, Client.objects.filter(tenant=tenant).count()),
        "products": (subscription.plan.max_products, Product.objects.filter(tenant=tenant).count()),
        "invoices": (subscription.plan.max_invoices, Invoice.objects.filter(tenant=tenant).count()),
    }
    maximum, current = limits[resource]
    if maximum and current >= maximum:
        raise serializers.ValidationError(f"تم الوصول إلى حد {resource} في الباقة الحالية.")


class LoginSerializer(TokenObtainPairSerializer):
    username_field = "email"
    def validate(self, attrs):
        data = super().validate(attrs)
        set_database_context(self.user)
        data["user"] = UserSerializer(self.user, context=self.context).data
        return data

class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

@api_view(["GET"])
@permission_classes([AllowAny])
def api_root(request):
    return Response({"name": "Fawateer API", "status": "ok", "version": "2.0"})

@api_view(["POST"])
@permission_classes([AllowAny])
def registration_disabled(request):
    return Response({"detail": "التسجيل الذاتي غير متاح. تواصل مع مدير المنصة."}, status=403)

@api_view(["GET"])
def me(request): return Response(UserSerializer(request.user, context={"request": request}).data)

@api_view(["POST"])
@permission_classes([AllowAny])
def password_reset(request):
    identity = str(request.data.get("identity", "")).strip().lower()
    user = User.objects.filter(email=identity, is_active=True).first()
    if user:
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        query = urlencode({"reset": "1", "uid": uid, "token": token})
        reset_url = f"{settings.FRONTEND_URL.rstrip('/')}/login.html?{query}"
        try:
            send_mail("استعادة كلمة المرور - منصة فواتير",
                f"استخدم الرابط التالي لتعيين كلمة مرور جديدة:\n{reset_url}",
                settings.DEFAULT_FROM_EMAIL, [user.email], fail_silently=False)
        except Exception:
            # Keep the public response generic and log through the application server.
            import logging
            logging.getLogger(__name__).exception("Password reset email delivery failed")
    return Response({"detail": "إذا كان الحساب موجودًا فستصل تعليمات الاستعادة إلى البريد المسجل."})

@api_view(["POST"])
@permission_classes([AllowAny])
def password_reset_confirm(request):
    try:
        user_id = force_str(urlsafe_base64_decode(request.data.get("uid", "")))
        user = User.objects.get(pk=user_id, is_active=True)
    except (ValueError, TypeError, OverflowError, User.DoesNotExist):
        return Response({"detail": "رابط الاستعادة غير صالح أو منتهي."}, status=400)
    token, password = request.data.get("token", ""), request.data.get("password", "")
    if not default_token_generator.check_token(user, token):
        return Response({"detail": "رابط الاستعادة غير صالح أو منتهي."}, status=400)
    try:
        validate_password(password, user)
    except DjangoValidationError as error:
        return Response({"detail": " ".join(error.messages)}, status=400)
    user.set_password(password); user.save(update_fields=["password"])
    return Response({"detail": "تم تغيير كلمة المرور بنجاح."})


class TenantViewSet(viewsets.ModelViewSet):
    serializer_class = TenantSerializer
    permission_classes = [FullAccess]
    def get_queryset(self): return scoped(Tenant.objects.all(), self.request.user)
    def perform_create(self, serializer):
        if not is_platform(self.request.user): raise serializers.ValidationError("مدير المنصة فقط يمكنه إنشاء شركة.")
        obj = serializer.save()
        audit(self.request, "tenant_created", tenant=obj, target=obj)
    def perform_destroy(self, instance):
        if instance.users.filter(Q(role="platform_admin") | Q(is_superuser=True)).exists():
            raise serializers.ValidationError("مستأجر المنصة محمي ولا يمكن حذفه.")
        if instance.users.exists():
            raise serializers.ValidationError("لا يمكن حذف منشأة مرتبطة بمستخدمين.")
        audit(self.request, "tenant_deleted", tenant=instance, target=instance)
        instance.delete()
    @action(detail=True, methods=["post", "delete"], url_path="logo")
    def logo(self, request, pk=None):
        obj = self.get_object()
        if request.method == "DELETE":
            if obj.logo: obj.logo.delete(save=False)
            obj.logo = None; obj.save(update_fields=["logo"])
        else:
            file = request.FILES.get("logo")
            if not file: return Response({"detail": "ملف الشعار مطلوب."}, status=400)
            if file.size > 3 * 1024 * 1024: return Response({"detail": "حجم الشعار يتجاوز 3MB."}, status=400)
            obj.logo = file; obj.save(update_fields=["logo"])
        return Response(TenantSerializer(obj, context={"request": request}).data)
    @action(detail=True, methods=["get"], url_path="vat-certificate")
    def vat_certificate(self, request, pk=None):
        obj = self.get_object()
        if not obj.vat_certificate: return Response({"detail": "لا توجد شهادة."}, status=404)
        content_type = mimetypes.guess_type(obj.vat_certificate.name)[0] or "application/octet-stream"
        return FileResponse(obj.vat_certificate.open("rb"), content_type=content_type)


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [FullAccess]
    def get_queryset(self):
        qs = User.objects.select_related("tenant").all()
        return qs if is_platform(self.request.user) else qs.filter(tenant=self.request.user.tenant).exclude(role="platform_admin")
    @transaction.atomic
    def perform_create(self, serializer):
        data = self.request.data
        tenant = self.request.user.tenant
        if is_platform(self.request.user) and data.get("tenant_name"):
            tenant, _ = Tenant.objects.get_or_create(name=data["tenant_name"], defaults={
                "tax_registration_number": data.get("tenant_vat", ""), "commercial_registration_number": data.get("tenant_cr", ""),
                "location_city": data.get("tenant_city", ""), "street_name": data.get("tenant_street", ""),
                "building_number": data.get("tenant_building", ""), "city_subdivision": data.get("tenant_district", ""),
                "postal_zone": data.get("tenant_postal", ""),
            })
        role = data.get("role", "employee")
        if not is_platform(self.request.user) and role == "platform_admin": raise serializers.ValidationError("صلاحية غير كافية.")
        if role != "platform_admin" and not tenant: raise serializers.ValidationError("يجب ربط المستخدم بشركة.")
        if role != "platform_admin": enforce_plan_limit(tenant, "users")
        user = serializer.save(tenant=None if role == "platform_admin" else tenant)
        certificate = self.request.FILES.get("vat_certificate")
        if tenant and certificate:
            extension = Path(certificate.name).suffix.lower()
            if certificate.size > 8 * 1024 * 1024:
                raise serializers.ValidationError({"vat_certificate": "حجم الشهادة يتجاوز 8MB."})
            if extension not in {".pdf", ".png", ".jpg", ".jpeg", ".webp"}:
                raise serializers.ValidationError({"vat_certificate": "الصيغ المقبولة: PDF أو PNG أو JPG أو WEBP."})
            if tenant.vat_certificate:
                tenant.vat_certificate.delete(save=False)
            tenant.vat_certificate = certificate
            tenant.save(update_fields=["vat_certificate", "updated_at"])
        plan_id = data.get("plan_id")
        if tenant and plan_id:
            Subscription.objects.update_or_create(tenant=tenant, defaults={"plan_id": plan_id, "status": "active"})
        audit(self.request, "user_created", tenant=tenant, target=user)
    def perform_destroy(self, instance):
        if instance.role == "platform_admin" or instance.is_superuser:
            raise serializers.ValidationError("حساب مدير المنصة محمي ولا يمكن حذفه.")
        if instance == self.request.user: raise serializers.ValidationError("لا يمكنك حذف حسابك الحالي.")
        audit(self.request, "user_deleted", tenant=instance.tenant, target=instance)
        instance.delete()
    def perform_update(self, serializer):
        instance = self.get_object()
        requested_active = self.request.data.get("is_active")
        platform_manager = instance.role == "platform_admin" or instance.is_superuser
        company_manager = instance.role == "company_admin" or instance.is_tenant_owner
        if (platform_manager or company_manager) and requested_active in (False, "false", "False", "0", 0):
            account_type = "مدير المنصة" if platform_manager else "مدير الشركة"
            raise serializers.ValidationError(f"حساب {account_type} محمي ولا يمكن تعطيله أو تعليقه.")
        updated = serializer.save()
        audit(self.request, "user_updated", tenant=updated.tenant, target=updated)


class TenantScopedViewSet(viewsets.ModelViewSet):
    def get_queryset(self): return scoped(self.queryset.select_related("tenant"), self.request.user)
    def perform_create(self, serializer):
        if not self.request.user.tenant: raise serializers.ValidationError("لا توجد شركة مرتبطة بالحساب.")
        resource = {"client": "clients", "product": "products", "invoice": "invoices"}.get(serializer.Meta.model._meta.model_name)
        if resource: enforce_plan_limit(self.request.user.tenant, resource)
        obj = serializer.save(tenant=self.request.user.tenant)
        audit(self.request, f"{obj._meta.model_name}_created", target=obj)
    def perform_update(self, serializer):
        obj = serializer.save()
        audit(self.request, f"{obj._meta.model_name}_updated", target=obj)
    def perform_destroy(self, instance):
        audit(self.request, f"{instance._meta.model_name}_deleted", target=instance)
        instance.delete()

class ClientViewSet(TenantScopedViewSet):
    queryset, serializer_class = Client.objects.all(), ClientSerializer
    def get_queryset(self):
        if not self.request.user.tenant_id:
            return Client.objects.none()
        return Client.objects.filter(tenant_id=self.request.user.tenant_id)
    @action(detail=True, methods=["get", "post"], url_path="certificate")
    def certificate(self, request, pk=None):
        client = self.get_object()
        if request.method == "GET":
            if not client.registration_certificate:
                return Response({"detail": "لا يوجد مرفق محفوظ للعميل."}, status=404)
            content_type = mimetypes.guess_type(client.registration_certificate.name)[0] or "application/octet-stream"
            return FileResponse(client.registration_certificate.open("rb"), content_type=content_type)
        file = request.FILES.get("certificate")
        if not file:
            return Response({"detail": "ملف شهادة العميل مطلوب."}, status=400)
        if file.size > 8 * 1024 * 1024:
            return Response({"detail": "حجم المرفق يتجاوز 8MB."}, status=400)
        if Path(file.name).suffix.lower() not in {".pdf", ".png", ".jpg", ".jpeg", ".webp"}:
            return Response({"detail": "الصيغ المقبولة: PDF أو PNG أو JPG أو WEBP."}, status=400)
        if client.registration_certificate:
            client.registration_certificate.delete(save=False)
        client.registration_certificate = file
        client.save(update_fields=["registration_certificate", "updated_at"])
        audit(request, "client_certificate_uploaded", target=client)
        return Response({"success": True, "certificate_url": f"/clients/{client.pk}/certificate/"})
    def perform_destroy(self, instance):
        if instance.invoices.exists():
            raise serializers.ValidationError("لا يمكن حذف عميل مرتبط بفواتير.")
        audit(self.request, "client_deleted", target=instance)
        instance.delete()
class ProductViewSet(TenantScopedViewSet):
    queryset, serializer_class = Product.objects.all(), ProductSerializer

class BillingTenantScopedViewSet(TenantScopedViewSet):
    """Keep billing records inside the signed-in user's own company."""
    def get_queryset(self):
        qs = self.queryset.select_related("tenant")
        tenant_id = self.request.user.tenant_id
        return qs.filter(tenant_id=tenant_id) if tenant_id else qs.none()

class CreditNoteViewSet(BillingTenantScopedViewSet):
    queryset, serializer_class = CreditNote.objects.select_related("invoice").all(), CreditNoteSerializer
class DebitNoteViewSet(BillingTenantScopedViewSet):
    queryset, serializer_class = DebitNote.objects.select_related("invoice").all(), DebitNoteSerializer

class InvoiceViewSet(BillingTenantScopedViewSet):
    queryset, serializer_class = Invoice.objects.prefetch_related("lines").all(), InvoiceSerializer
    def get_queryset(self):
        return super().get_queryset().order_by("-created_at", "-pk")
    def perform_destroy(self, instance):
        if instance.status in {"issued", "reported", "cleared"}: raise serializers.ValidationError("لا يمكن حذف فاتورة صادرة.")
        audit(self.request, "invoice_deleted", target=instance)
        instance.delete()
    @action(detail=True, methods=["post"], url_path="zatca-submit")
    def zatca_submit(self, request, pk=None):
        invoice = self.get_object()
        if invoice.tenant.zatca_status != "linked":
            return Response({"detail": "يجب ربط المنشأة مع ZATCA أولًا."}, status=409)
        return Response({"detail": "الإرسال الرسمي إلى ZATCA غير مفعّل على هذا الخادم بعد؛ لم تتغير حالة الفاتورة."}, status=501)
    @action(detail=True, methods=["post"], url_path="zatca-compliance")
    def zatca_compliance(self, request, pk=None):
        invoice = self.get_object()
        return Response({"success": True, "compliant": bool(invoice.lines.exists()), "message": "اكتمل فحص بنية الفاتورة."})


class PlanViewSet(viewsets.ModelViewSet):
    queryset, serializer_class = SubscriptionPlan.objects.all(), PlanSerializer
    def get_permissions(self):
        if self.action in {"list", "retrieve"}: return [IsAuthenticated()]
        return [PlatformOnly()]
    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(is_active=True) if self.request.query_params.get("active") else qs
    def perform_destroy(self, instance):
        if instance.subscriptions.exists():
            raise serializers.ValidationError("لا يمكن حذف باقة مرتبطة باشتراكات.")
        instance.delete()

class SubscriptionViewSet(viewsets.ModelViewSet):
    serializer_class, permission_classes = SubscriptionSerializer, [FullAccess]
    def get_queryset(self):
        return scoped(Subscription.objects.select_related("tenant", "plan"), self.request.user)

class AuditViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class, permission_classes = AuditLogSerializer, [FullAccess]
    def get_queryset(self):
        user = self.request.user
        if not _strict_tenant_scope(user):
            return AuditLog.objects.none()
        qs = AuditLog.objects.filter(tenant_id=user.tenant_id)
        if is_platform(user):
            qs = qs.filter(Q(user__role="platform_admin") | Q(user__is_superuser=True))
        return qs.select_related(
            "tenant", "user"
        ).order_by("-created_at")[:500]

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer
    def get_queryset(self):
        qs = scoped(Notification.objects.all(), self.request.user)
        return qs.filter(user__in=[self.request.user, None]).order_by("-created_at")
    @action(detail=False, methods=["post"], url_path="mark-read")
    def mark_read(self, request):
        qs = self.get_queryset()
        if request.data.get("id"): qs = qs.filter(pk=request.data["id"])
        qs.update(is_read=True)
        return Response({"success": True})


class BootstrapView(APIView):
    PAGE_DATA = {
        "clients": {"clients", "tenants"},
        "subscribers": {"plans", "users", "subscriptions", "tenants"},
        "invoices": {"clients", "invoices", "tenants"}, "create-invoice": {"clients", "products", "tenants"},
        "invoice-detail": {"clients", "invoices", "tenants"},
        "client-form": {"clients", "tenants"},
        "team": {"users", "tenants"}, "packages": {"plans"},
        "settings": {"tenants"}, "zatca": {"tenants"},
    }
    def get(self, request):
        page = request.query_params.get("page", "dashboard")
        if page in {"dashboard", "reports", "client-log"}:
            return Response({"detail": "استخدم واجهة البيانات المعزولة الخاصة بهذه الصفحة."}, status=404)
        if page not in self.PAGE_DATA:
            return Response({"detail": "الصفحة المطلوبة غير معروفة."}, status=404)
        wanted = self.PAGE_DATA.get(page, set())
        user, platform = request.user, is_platform(request.user)
        if page == "subscribers" and not platform:
            return Response({"detail": "هذه الصفحة متاحة لمدير المنصة فقط."}, status=403)
        billing_page = page in {"invoices", "create-invoice", "invoice-detail"}
        own_tenant = Tenant.objects.filter(pk=user.tenant_id) if user.tenant_id else Tenant.objects.none()
        own_clients = Client.objects.filter(tenant_id=user.tenant_id) if user.tenant_id else Client.objects.none()
        own_products = Product.objects.filter(tenant_id=user.tenant_id) if user.tenant_id else Product.objects.none()
        own_invoices = Invoice.objects.filter(tenant_id=user.tenant_id) if user.tenant_id else Invoice.objects.none()
        data = {"user": UserSerializer(user, context={"request": request}).data}
        mapping = {
            "tenants": lambda: TenantSerializer(own_tenant if billing_page else scoped(Tenant.objects.all(), user), many=True, context={"request": request}).data,
            "clients": lambda: ClientSerializer(own_clients, many=True).data,
            "products": lambda: ProductSerializer(own_products if billing_page else scoped(Product.objects.all(), user), many=True).data,
            "invoices": lambda: InvoiceSerializer((own_invoices if billing_page else scoped(Invoice.objects.all(), user)).select_related("client"), many=True).data,
            "plans": lambda: PlanSerializer(SubscriptionPlan.objects.all(), many=True).data,
            "subscriptions": lambda: SubscriptionSerializer(scoped(Subscription.objects.select_related("tenant", "plan"), user), many=True).data,
            "users": lambda: UserSerializer(
                User.objects.filter(tenant_id=user.tenant_id)
                if platform and page == "team"
                else (User.objects.all() if platform else User.objects.filter(tenant=user.tenant)),
                many=True, context={"request": request}
            ).data,
            "audit_logs": lambda: AuditLogSerializer(scoped(AuditLog.objects.order_by("-created_at"), user)[:200], many=True).data,
        }
        for key in wanted: data[key] = mapping[key]()
        summary_clients = own_clients
        summary_invoices = own_invoices if billing_page else scoped(Invoice.objects.all(), user)
        data["summary"] = {"clients": summary_clients.count(), "invoices": summary_invoices.count(),
                           "users": User.objects.count() if platform else User.objects.filter(tenant=user.tenant).count()}
        data["zatca_status"] = user.tenant.zatca_status if user.tenant else "unlinked"
        return Response(data)


def _strict_tenant_scope(user):
    """Force PostgreSQL RLS to ignore the platform bypass for sensitive reads."""
    if not user.tenant_id:
        return False
    if connection.vendor == "postgresql":
        with connection.cursor() as cursor:
            cursor.execute("SELECT set_config('app.strict_tenant_scope', 'true', false)")
    return True


class DashboardView(APIView):
    """Tenant-only dashboard payload; never returns platform-wide collections."""
    permission_classes = [FullAccess]

    def get(self, request):
        user = request.user
        if not _strict_tenant_scope(user):
            return Response({"detail": "لا توجد منشأة مرتبطة بالحساب."}, status=403)
        tenant_id = user.tenant_id
        invoices = Invoice.objects.filter(tenant_id=tenant_id).select_related("client").order_by("-created_at")
        clients = Client.objects.filter(tenant_id=tenant_id)
        users = User.objects.filter(tenant_id=tenant_id)
        return Response({
            "user": UserSerializer(user, context={"request": request}).data,
            "tenants": TenantSerializer(
                Tenant.objects.filter(pk=tenant_id), many=True, context={"request": request}
            ).data,
            "clients": ClientSerializer(clients, many=True).data,
            "invoices": InvoiceSerializer(invoices[:20], many=True).data,
            "users": UserSerializer(users, many=True, context={"request": request}).data,
            "summary": {
                "clients": clients.count(),
                "invoices": invoices.count(),
                "users": users.count(),
                "revenue": invoices.aggregate(value=Sum("total_amount"))["value"] or 0,
            },
            "zatca_status": user.tenant.zatca_status,
        })


class ReportsView(APIView):
    """Strict, aggregate-only report API for one tenant."""
    permission_classes = [FullAccess]

    def get(self, request):
        user = request.user
        if not _strict_tenant_scope(user):
            return Response({"detail": "لا توجد منشأة مرتبطة بالحساب."}, status=403)
        invoices = Invoice.objects.filter(tenant_id=user.tenant_id)
        paid = invoices.filter(status__in={"paid", "cleared", "reported"}).aggregate(
            value=Sum("total_amount")
        )["value"] or 0
        totals = invoices.aggregate(total=Sum("total_amount"), vat=Sum("tax_amount"))
        total = totals["total"] or 0
        return Response({
            "user": UserSerializer(user, context={"request": request}).data,
            "tenant_id": str(user.tenant_id),
            "summary": {
                "paid": paid,
                "outstanding": total - paid,
                "vat": totals["vat"] or 0,
                "invoices": invoices.count(),
            },
        })


class ActionLogContextView(APIView):
    """Authorization/context endpoint kept separate from generic page bootstrap."""
    permission_classes = [FullAccess]

    def get(self, request):
        if not _strict_tenant_scope(request.user):
            return Response({"detail": "لا توجد منشأة مرتبطة بالحساب."}, status=403)
        return Response({
            "user": UserSerializer(request.user, context={"request": request}).data,
            "tenant_id": str(request.user.tenant_id),
        })


class ZatcaOnboardView(APIView):
    permission_classes = [FullAccess]
    def get(self, request):
        tenant = request.user.tenant
        if not tenant: return Response({"status": "unlinked"})
        safe = {k: v for k, v in tenant.zatca_data.items() if k not in {"otp", "private_key", "secret"}}
        return Response({"status": tenant.zatca_status, **safe})
    def post(self, request): return self._save(request)
    def patch(self, request): return self._save(request)
    def _save(self, request):
        tenant = request.user.tenant
        if not tenant: return Response({"detail": "اربط حساب مدير المنصة بمنشأة أولًا."}, status=400)
        data = request.data.copy(); data.pop("otp", None)
        tenant.zatca_data = data; tenant.zatca_status = "configured"; tenant.save(update_fields=["zatca_data", "zatca_status"])
        audit(request, "zatca_configuration_saved")
        return Response({"status": "configured", "message": "تم حفظ بيانات المنشأة. لم يتم إصدار CSID أو ربطها رسميًا بعد."})

@api_view(["POST"])
@permission_classes([FullAccess])
def production_csid(request):
    if not request.user.tenant or request.user.tenant.zatca_status not in {"configured", "compliance"}:
        return Response({"detail": "أكمل بيانات المنشأة أولًا."}, status=409)
    return Response({"detail": "إصدار Production CSID غير مفعّل حتى تُضبط شهادات وواجهات ZATCA الرسمية."}, status=501)


class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    def get_queryset(self):
        qs = SupportConversation.objects.select_related("tenant", "customer", "assigned_to").prefetch_related("messages__sender")
        if is_platform(self.request.user) and self.request.query_params.get("mine") != "1": return qs.order_by("-updated_at")
        return qs.filter(customer=self.request.user).order_by("-updated_at")
    def perform_create(self, serializer):
        if not self.request.user.tenant: raise serializers.ValidationError("لا توجد شركة مرتبطة بالحساب.")
        serializer.save(tenant=self.request.user.tenant, customer=self.request.user)
    @action(detail=True, methods=["post"], url_path="messages")
    def messages_action(self, request, pk=None):
        conv = self.get_object()
        is_agent = is_platform(request.user)
        msg = SupportMessage.objects.create(tenant=conv.tenant, conversation=conv, sender=request.user,
            sender_type="agent" if is_agent else "customer", body=request.data.get("body", "").strip(),
            attachment=request.data.get("attachment", {}), is_internal=bool(request.data.get("is_internal") and is_agent))
        conv.status = "active" if is_agent else ("waiting" if conv.status != "ai" else conv.status)
        conv.save(update_fields=["status", "updated_at"])
        ai_message = None
        if not is_agent and conv.status == "ai" and msg.body:
            normalized_body = msg.body.lower()
            article = next((item for item in KnowledgeArticle.objects.filter(is_published=True)
                if any(str(keyword).strip().lower() in normalized_body for keyword in item.keywords if str(keyword).strip())), None)
            if article:
                reply = article.content[:1200]
                bot = SupportMessage.objects.create(tenant=conv.tenant, conversation=conv, sender=None,
                    sender_type="ai", body=reply)
                ai_message = MessageSerializer(bot).data
            else:
                support_settings = SupportSettings.objects.first()
                if not support_settings or support_settings.auto_handover:
                    conv.status = "waiting"; conv.save(update_fields=["status", "updated_at"])
        return Response({"message": MessageSerializer(msg).data, "ai_message": ai_message}, status=201)
    @action(detail=True, methods=["post"])
    def assign(self, request, pk=None):
        if not is_platform(request.user): return Response({"detail": "صلاحية غير كافية."}, status=403)
        conv = self.get_object(); conv.assigned_to = request.user; conv.status = "active"; conv.save()
        return Response(self.get_serializer(conv).data)
    @action(detail=True, methods=["post"])
    def typing(self, request, pk=None):
        conv = self.get_object()
        field = "agent_typing" if is_platform(request.user) else "customer_typing"
        setattr(conv, field, bool(request.data.get("typing"))); conv.save(update_fields=[field])
        return Response({"success": True})

@api_view(["GET"])
def support_analytics(request):
    if not is_platform(request.user): return Response({"detail": "صلاحية غير كافية."}, status=403)
    qs = SupportConversation.objects.all()
    return Response({"total": qs.count(), "waiting": qs.filter(status="waiting").count(),
        "active": qs.filter(status="active").count(), "ai": qs.filter(status="ai").count(),
        "avg_csat": round(qs.aggregate(v=Avg("csat_rating"))["v"] or 0, 1)})

class KnowledgeViewSet(viewsets.ModelViewSet):
    queryset, serializer_class, permission_classes = KnowledgeArticle.objects.all(), KnowledgeSerializer, [PlatformOnly]
class CannedViewSet(viewsets.ModelViewSet):
    queryset, serializer_class, permission_classes = CannedResponse.objects.all(), CannedSerializer, [PlatformOnly]

class SupportSettingsView(APIView):
    permission_classes = [PlatformOnly]
    def get_object(self): return SupportSettings.objects.first() or SupportSettings.objects.create()
    def get(self, request): return Response(SupportSettingsSerializer(self.get_object()).data)
    def patch(self, request):
        s = SupportSettingsSerializer(self.get_object(), data=request.data, partial=True)
        s.is_valid(raise_exception=True); s.save(); return Response(s.data)

@api_view(["POST"])
@permission_classes([FullAccess])
def vat_extract(request):
    file = request.FILES.get("certificate")
    if not file:
        return Response({"detail": "يرجى إرفاق شهادة بصيغة PDF أو صورة."}, status=400)
    if file.size > 8 * 1024 * 1024: return Response({"detail": "حجم الملف يتجاوز 8MB."}, status=400)
    extension = Path(file.name).suffix.lower()
    if extension not in {".pdf", ".png", ".jpg", ".jpeg", ".webp"}:
        return Response({"detail": "الصيغ المقبولة: PDF أو PNG أو JPG أو WEBP."}, status=400)
    tenant = None
    tenant_id = request.data.get("tenant_id")
    if tenant_id:
        tenant = get_object_or_404(scoped(Tenant.objects.all(), request.user), pk=tenant_id)
    elif not is_platform(request.user) and request.user.tenant_id:
        tenant = request.user.tenant
    if tenant:
        if tenant.vat_certificate:
            tenant.vat_certificate.delete(save=False)
        tenant.vat_certificate = file
        tenant.save(update_fields=["vat_certificate", "updated_at"])
        audit(request, "vat_certificate_uploaded", {"filename": Path(file.name).name}, tenant)
        file.seek(0)
    certificate_url = f"/tenants/{tenant.pk}/vat-certificate/" if tenant else ""
    fields, extracted_text = extract_certificate(file.read(), extension)
    extracted_count = sum(bool(value) for value in fields.values())
    if extracted_count:
        message = f"تم استخراج {extracted_count} من الحقول وحفظ الشهادة. راجع البيانات قبل اعتمادها."
    elif extracted_text.strip():
        message = "تمت قراءة الشهادة وحفظها، لكن لم تُطابق البيانات حقول الشهادة المعروفة. أدخلها يدويًا."
    else:
        message = "تم حفظ الشهادة، لكن جودة الملف لم تسمح بقراءة النص. جرّب صورة أوضح."
    return Response({"success": True, "fields": fields, **fields, "vat_certificate_url": certificate_url,
        "extracted_fields_count": extracted_count, "message": message})


@api_view(["POST"])
@permission_classes([FullAccess])
def client_certificate_extract(request):
    file = request.FILES.get("certificate")
    if not file:
        return Response({"detail": "يرجى إرفاق شهادة العميل بصيغة PDF أو صورة."}, status=400)
    if file.size > 8 * 1024 * 1024:
        return Response({"detail": "حجم المرفق يتجاوز 8MB."}, status=400)
    extension = Path(file.name).suffix.lower()
    if extension not in {".pdf", ".png", ".jpg", ".jpeg", ".webp"}:
        return Response({"detail": "الصيغ المقبولة: PDF أو PNG أو JPG أو WEBP."}, status=400)
    extracted_fields, extracted_text = extract_certificate(file.read(), extension)
    needed_fields = ("taxpayer_name", "vat_registration_number", "city", "street",
                     "building_number", "district", "postal_code")
    fields = {name: extracted_fields.get(name, "") for name in needed_fields}
    extracted_count = sum(bool(value) for value in fields.values())
    message = (
        f"تم استخراج {extracted_count} من بيانات العميل المطلوبة فقط. راجعها قبل الحفظ."
        if extracted_count else
        ("تمت قراءة المرفق دون مطابقة حقول واضحة. أدخل البيانات يدويًا."
         if extracted_text.strip() else "تعذر قراءة المرفق. جرّب صورة أوضح.")
    )
    return Response({"success": True, "fields": fields, **fields,
        "extracted_fields_count": extracted_count, "message": message})
