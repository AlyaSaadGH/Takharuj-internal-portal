import uuid
from decimal import Decimal
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.validators import MinValueValidator
from django.db import models
from django.utils import timezone


class UserManager(BaseUserManager):
    use_in_migrations = True
    def create_user(self, email, password=None, **extra):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email).lower()
        user = self.model(email=email, username=email, **extra)
        user.set_password(password)
        user.save(using=self._db)
        return user
    def create_superuser(self, email, password=None, **extra):
        extra.update(is_staff=True, is_superuser=True, is_active=True, role="platform_admin", permission_scope="full_access")
        return self.create_user(email, password, **extra)


class Tenant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    tax_registration_number = models.CharField(max_length=32, blank=True)
    commercial_registration_number = models.CharField(max_length=64, blank=True)
    location_city = models.CharField(max_length=120, blank=True)
    street_name = models.CharField(max_length=255, blank=True)
    building_number = models.CharField(max_length=20, blank=True)
    city_subdivision = models.CharField(max_length=120, blank=True)
    postal_zone = models.CharField(max_length=20, blank=True)
    address_text = models.TextField(blank=True)
    invoice_seller_name = models.CharField(max_length=255, blank=True)
    logo = models.ImageField(upload_to="tenant-logos/", blank=True, null=True)
    vat_certificate = models.FileField(upload_to="vat-certificates/", blank=True, null=True)
    status = models.CharField(max_length=20, default="active")
    zatca_status = models.CharField(max_length=20, default="unlinked")
    zatca_data = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self): return self.name


class User(AbstractUser):
    ROLE_CHOICES = [("platform_admin", "مدير منصة"), ("company_admin", "مدير شركة"), ("employee", "موظف")]
    SCOPE_CHOICES = [("full_access", "النظام كامل"), ("invoices", "الفواتير")]
    email = models.EmailField(unique=True)
    tenant = models.ForeignKey(Tenant, null=True, blank=True, on_delete=models.PROTECT, related_name="users")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="employee")
    permission_scope = models.CharField(max_length=20, choices=SCOPE_CHOICES, default="invoices")
    manager_name = models.CharField(max_length=255, blank=True)
    is_tenant_owner = models.BooleanField(default=False)
    USERNAME_FIELD, REQUIRED_FIELDS = "email", []
    objects = UserManager()
    def save(self, *args, **kwargs):
        self.email = self.email.lower().strip()
        self.username = self.email
        if self.role in {"platform_admin", "company_admin"}:
            self.permission_scope = "full_access"
        super().save(*args, **kwargs)


class SubscriptionPlan(models.Model):
    name = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    yearly_price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    currency = models.CharField(max_length=8, default="SAR")
    plan_type = models.CharField(max_length=20, default="monthly")
    max_users = models.PositiveIntegerField(default=1)
    max_branches = models.PositiveIntegerField(default=1)
    max_invoices = models.PositiveIntegerField(default=100)
    max_clients = models.PositiveIntegerField(default=100)
    max_products = models.PositiveIntegerField(default=100)
    storage_gb = models.PositiveIntegerField(default=5)
    features = models.JSONField(default=list, blank=True)
    custom_features = models.JSONField(default=list, blank=True)
    visibility_status = models.CharField(max_length=20, default="active")
    is_popular = models.BooleanField(default=False)
    free_trial_enabled = models.BooleanField(default=False)
    trial_days = models.PositiveIntegerField(default=14)
    support_type = models.CharField(max_length=100, default="دعم أساسي")
    response_time = models.CharField(max_length=100, default="خلال 24 ساعة")
    support_availability = models.CharField(max_length=100, default="أيام العمل")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self): return self.name


class Subscription(models.Model):
    tenant = models.OneToOneField(Tenant, on_delete=models.CASCADE, related_name="subscription")
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.PROTECT, related_name="subscriptions")
    status = models.CharField(max_length=20, default="active")
    starts_at = models.DateField(default=timezone.localdate)
    ends_at = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class TenantModel(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    class Meta: abstract = True


class Client(TenantModel):
    name = models.CharField(max_length=255)
    vat_number = models.CharField(max_length=32, blank=True)
    email = models.EmailField(blank=True)
    phone_number = models.CharField(max_length=32, blank=True)
    city = models.CharField(max_length=120, blank=True)
    street_name = models.CharField(max_length=255, blank=True)
    building_number = models.CharField(max_length=20, blank=True)
    city_subdivision = models.CharField(max_length=120, blank=True)
    postal_zone = models.CharField(max_length=20, blank=True)
    registration_certificate = models.FileField(upload_to="client-certificates/", blank=True, null=True)
    status = models.CharField(max_length=20, default="active")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Product(TenantModel):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    sku = models.CharField(max_length=80, blank=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=15)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Invoice(TenantModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.ForeignKey(Client, null=True, blank=True, on_delete=models.PROTECT, related_name="invoices")
    invoice_number = models.CharField(max_length=80)
    invoice_type = models.CharField(max_length=20, default="standard")
    issue_date = models.DateField(default=timezone.localdate)
    status = models.CharField(max_length=20, default="draft")
    subtotal = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    xml_content = models.TextField(blank=True, default="{}")
    zatca_status = models.CharField(max_length=30, default="not_submitted")
    zatca_response = models.JSONField(default=dict, blank=True)
    qr_code_image = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        constraints = [models.UniqueConstraint(fields=["tenant", "invoice_number"], name="uniq_tenant_invoice_number")]


class InvoiceLine(TenantModel):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="lines")
    description = models.CharField(max_length=500)
    quantity = models.DecimalField(max_digits=12, decimal_places=3, default=1, validators=[MinValueValidator(Decimal("0.001"))])
    unit_price = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=15)
    line_total = models.DecimalField(max_digits=14, decimal_places=2, default=0)

class CreditNote(TenantModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    invoice = models.ForeignKey(Invoice, on_delete=models.PROTECT, related_name="credit_notes")
    note_number = models.CharField(max_length=80)
    reason = models.TextField()
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    status = models.CharField(max_length=20, default="draft")
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        constraints = [models.UniqueConstraint(fields=["tenant", "note_number"], name="uniq_tenant_credit_number")]

class DebitNote(TenantModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    invoice = models.ForeignKey(Invoice, on_delete=models.PROTECT, related_name="debit_notes")
    note_number = models.CharField(max_length=80)
    reason = models.TextField()
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    status = models.CharField(max_length=20, default="draft")
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        constraints = [models.UniqueConstraint(fields=["tenant", "note_number"], name="uniq_tenant_debit_number")]


class AuditLog(TenantModel):
    user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    action = models.CharField(max_length=120)
    details = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Notification(TenantModel):
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    message = models.TextField(blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


class SupportConversation(TenantModel):
    subject = models.CharField(max_length=255, default="محادثة دعم جديدة")
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="support_conversations")
    assigned_to = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name="assigned_support")
    status = models.CharField(max_length=20, default="ai")
    priority = models.CharField(max_length=20, default="normal")
    csat_rating = models.PositiveSmallIntegerField(null=True, blank=True)
    customer_typing = models.BooleanField(default=False)
    agent_typing = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class SupportMessage(TenantModel):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    conversation = models.ForeignKey(SupportConversation, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    sender_type = models.CharField(max_length=20, default="customer")
    body = models.TextField()
    attachment = models.JSONField(default=dict, blank=True)
    is_internal = models.BooleanField(default=False)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


class KnowledgeArticle(models.Model):
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=120, default="عام")
    content = models.TextField()
    keywords = models.JSONField(default=list, blank=True)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)


class CannedResponse(models.Model):
    title = models.CharField(max_length=255)
    shortcut = models.CharField(max_length=80, unique=True)
    content = models.TextField()
    is_active = models.BooleanField(default=True)


class SupportSettings(models.Model):
    enabled = models.BooleanField(default=True)
    availability = models.CharField(max_length=50, default="24/7")
    response_time = models.CharField(max_length=100, default="فوراً")
    notifications_enabled = models.BooleanField(default=True)
    auto_handover = models.BooleanField(default=True)
    welcome_message = models.TextField(default="مرحباً، كيف يمكننا مساعدتك؟")
