from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

router = DefaultRouter()
for prefix, view, base in [
    ("tenants", views.TenantViewSet, "tenant"), ("users", views.UserViewSet, "user"),
    ("clients", views.ClientViewSet, "client"), ("products", views.ProductViewSet, "product"),
    ("invoices", views.InvoiceViewSet, "invoice"), ("plans", views.PlanViewSet, "plan"),
    ("credit-notes", views.CreditNoteViewSet, "credit-note"), ("debit-notes", views.DebitNoteViewSet, "debit-note"),
    ("subscriptions", views.SubscriptionViewSet, "subscription"), ("audit-logs", views.AuditViewSet, "audit"),
    ("notifications", views.NotificationViewSet, "notification"),
    ("support/conversations", views.ConversationViewSet, "support-conversation"),
    ("support/knowledge", views.KnowledgeViewSet, "knowledge"),
    ("support/canned-responses", views.CannedViewSet, "canned"),
]: router.register(prefix, view, basename=base)

urlpatterns = [
    path("", views.api_root), path("auth/login/", views.LoginView.as_view()),
    path("auth/refresh/", TokenRefreshView.as_view()), path("auth/me/", views.me),
    path("auth/register/", views.registration_disabled), path("auth/password-reset/", views.password_reset),
    path("auth/password-reset/confirm/", views.password_reset_confirm),
    path("bootstrap/", views.BootstrapView.as_view()),
    path("dashboard/", views.DashboardView.as_view()),
    path("reports/", views.ReportsView.as_view()),
    path("action-log/context/", views.ActionLogContextView.as_view()),
    path("zatca/onboard", views.ZatcaOnboardView.as_view()), path("zatca/onboard/", views.ZatcaOnboardView.as_view()),
    path("zatca/production-csid/", views.production_csid),
    path("support/analytics/", views.support_analytics), path("support/settings/", views.SupportSettingsView.as_view()),
    path("vat-certificate/extract/", views.vat_extract),
    path("client-certificate/extract/", views.client_certificate_extract),
    path("public/tenants/<uuid:tenant_id>/logo/", views.public_tenant_logo),
    path("", include(router.urls)),
]
