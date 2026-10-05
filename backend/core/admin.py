from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import AuthenticationForm, UserChangeForm, UserCreationForm
from django import forms
from .models import *

ARABIC_FIELD_LABELS = {
    "email": "البريد الإلكتروني", "password": "كلمة المرور",
    "first_name": "الاسم الأول", "last_name": "اسم العائلة",
    "manager_name": "اسم المدير", "tenant": "الشركة", "name": "الاسم",
    "role": "الدور", "permission_scope": "نطاق الصلاحية",
    "is_tenant_owner": "مالك الشركة", "is_active": "نشط",
    "is_staff": "عضو فريق الإدارة", "is_superuser": "مدير عام",
    "groups": "المجموعات", "user_permissions": "صلاحيات المستخدم",
    "last_login": "آخر دخول", "date_joined": "تاريخ الانضمام",
    "tax_registration_number": "الرقم الضريبي",
    "commercial_registration_number": "رقم السجل التجاري",
    "location_city": "المدينة", "city": "المدينة", "street_name": "اسم الشارع",
    "building_number": "رقم المبنى", "city_subdivision": "الحي",
    "postal_zone": "الرمز البريدي", "address_text": "العنوان",
    "invoice_seller_name": "اسم البائع في الفاتورة", "logo": "الشعار",
    "vat_certificate": "شهادة ضريبة القيمة المضافة", "status": "الحالة",
    "zatca_status": "حالة هيئة الزكاة والضريبة والجمارك",
    "zatca_data": "بيانات الربط", "description": "الوصف", "price": "السعر",
    "yearly_price": "السعر السنوي", "currency": "العملة",
    "plan_type": "نوع الباقة", "max_users": "الحد الأقصى للمستخدمين",
    "max_branches": "الحد الأقصى للفروع", "max_invoices": "الحد الأقصى للفواتير",
    "max_clients": "الحد الأقصى للعملاء", "max_products": "الحد الأقصى للمنتجات",
    "storage_gb": "مساحة التخزين (جيجابايت)", "features": "المزايا",
    "visibility_status": "حالة الظهور", "is_popular": "باقة شائعة",
    "free_trial_enabled": "تجربة مجانية", "trial_days": "أيام التجربة",
    "support_type": "نوع الدعم", "response_time": "زمن الاستجابة",
    "support_availability": "توفر الدعم", "plan": "الباقة",
    "starts_at": "تاريخ البداية", "ends_at": "تاريخ النهاية",
    "vat_number": "الرقم الضريبي", "sku": "رمز المنتج",
    "tax_rate": "نسبة الضريبة", "client": "العميل",
    "invoice_number": "رقم الفاتورة", "invoice_type": "نوع الفاتورة",
    "issue_date": "تاريخ الإصدار", "subtotal": "المجموع قبل الضريبة",
    "tax_amount": "مبلغ الضريبة", "total_amount": "الإجمالي",
    "xml_content": "محتوى XML", "zatca_response": "استجابة الهيئة",
    "qr_code_image": "رمز الاستجابة السريعة", "invoice": "الفاتورة",
    "quantity": "الكمية", "unit_price": "سعر الوحدة", "line_total": "إجمالي السطر",
    "note_number": "رقم الإشعار", "reason": "السبب", "amount": "المبلغ",
    "user": "المستخدم", "action": "الإجراء", "details": "التفاصيل",
    "title": "العنوان", "message": "الرسالة", "is_read": "مقروء",
    "subject": "الموضوع", "customer": "العميل", "assigned_to": "مسند إلى",
    "priority": "الأولوية", "csat_rating": "تقييم العميل",
    "customer_typing": "العميل يكتب", "agent_typing": "موظف الدعم يكتب",
    "conversation": "المحادثة", "sender": "المرسل", "sender_type": "نوع المرسل",
    "body": "النص", "attachment": "المرفق", "is_internal": "داخلي",
    "category": "التصنيف", "content": "المحتوى", "keywords": "الكلمات المفتاحية",
    "is_published": "منشور", "shortcut": "الاختصار", "enabled": "مفعّل",
    "availability": "التوفر", "notifications_enabled": "تفعيل الإشعارات",
    "auto_handover": "التحويل التلقائي", "welcome_message": "رسالة الترحيب",
    "created_at": "تاريخ الإنشاء", "updated_at": "تاريخ التحديث",
}

ARABIC_MODEL_NAMES = {
    Tenant: ("شركة", "الشركات"),
    User: ("مستخدم", "المستخدمون"),
    SubscriptionPlan: ("باقة اشتراك", "باقات الاشتراك"),
    Subscription: ("اشتراك", "الاشتراكات"),
    Client: ("عميل", "العملاء"),
    Product: ("منتج", "المنتجات"),
    Invoice: ("فاتورة", "الفواتير"),
    InvoiceLine: ("بند فاتورة", "بنود الفواتير"),
    CreditNote: ("إشعار دائن", "الإشعارات الدائنة"),
    DebitNote: ("إشعار مدين", "الإشعارات المدينة"),
    AuditLog: ("سجل تدقيق", "سجلات التدقيق"),
    Notification: ("إشعار", "الإشعارات"),
    SupportConversation: ("محادثة دعم", "محادثات الدعم"),
    SupportMessage: ("رسالة دعم", "رسائل الدعم"),
    KnowledgeArticle: ("مقالة معرفة", "مقالات المعرفة"),
    CannedResponse: ("رد جاهز", "الردود الجاهزة"),
    SupportSettings: ("إعدادات الدعم", "إعدادات الدعم"),
}

for model, (singular, plural) in ARABIC_MODEL_NAMES.items():
    model._meta.verbose_name = singular
    model._meta.verbose_name_plural = plural


class ArabicAdminAuthenticationForm(AuthenticationForm):
    username = forms.EmailField(
        label="البريد الإلكتروني",
        widget=forms.EmailInput(attrs={"autofocus": True, "autocomplete": "username"}),
    )


class ArabicFieldsAdmin(admin.ModelAdmin):
    def formfield_for_dbfield(self, db_field, request, **kwargs):
        kwargs.setdefault("label", ARABIC_FIELD_LABELS.get(db_field.name, db_field.verbose_name))
        if db_field.name == "vat_certificate":
            kwargs["widget"] = forms.ClearableFileInput(attrs={
                "accept": "application/pdf,image/png,image/jpeg,image/webp,.pdf,.png,.jpg,.jpeg,.webp",
            })
        return super().formfield_for_dbfield(db_field, request, **kwargs)

    def has_delete_permission(self, request, obj=None):
        if self.model is Tenant and obj and obj.users.filter(role="platform_admin").exists():
            return False
        return super().has_delete_permission(request, obj)


class EmailUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ("email",)


class EmailUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = User
        fields = "__all__"


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    add_form = EmailUserCreationForm
    form = EmailUserChangeForm
    ordering = ("email",)
    search_fields = ("email", "first_name", "last_name", "manager_name")
    list_display = ("email", "manager_name", "role", "tenant", "is_active")
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("المعلومات الشخصية", {"fields": ("first_name", "last_name", "manager_name")}),
        ("الشركة والصلاحيات", {"fields": ("tenant", "role", "permission_scope", "is_tenant_owner")}),
        ("صلاحيات الإدارة", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("التواريخ المهمة", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "password1", "password2", "manager_name", "tenant", "role", "permission_scope"),
        }),
    )

    def formfield_for_dbfield(self, db_field, request, **kwargs):
        kwargs.setdefault("label", ARABIC_FIELD_LABELS.get(db_field.name, db_field.verbose_name))
        return super().formfield_for_dbfield(db_field, request, **kwargs)

    def has_delete_permission(self, request, obj=None):
        if obj and (obj.role == "platform_admin" or obj.is_superuser):
            return False
        return super().has_delete_permission(request, obj)

for model in [Tenant, SubscriptionPlan, Subscription, Client, Product, Invoice, InvoiceLine, CreditNote, DebitNote,
              AuditLog, Notification, SupportConversation, SupportMessage, KnowledgeArticle, CannedResponse, SupportSettings]:
    admin.site.register(model, ArabicFieldsAdmin)
admin.site.login_form = ArabicAdminAuthenticationForm
admin.site.site_header = "إدارة منصة فواتير"
admin.site.site_title = "لوحة تحكم منصة فواتير"
admin.site.index_title = "إدارة نظام الفواتير"
admin.site.enable_nav_sidebar = True
