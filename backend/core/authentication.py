from django.db import connection
from rest_framework_simplejwt.authentication import JWTAuthentication

CONTEXT_KEYS = (
    "app.tenant_id",
    "app.user_id",
    "app.is_platform_admin",
    "app.is_support_admin",
    "app.strict_tenant_scope",
)

def set_database_context(user):
    if connection.vendor != "postgresql": return
    platform = user.role == "platform_admin" or user.is_superuser
    values = (
        str(user.tenant_id or ""),
        str(user.pk),
        "true" if platform else "false",
        "true" if platform else "false",
        "false",
    )
    with connection.cursor() as cursor:
        for key, value in zip(CONTEXT_KEYS, values):
            cursor.execute("SELECT set_config(%s, %s, false)", [key, value])

def clear_database_context():
    if connection.vendor != "postgresql": return
    try:
        with connection.cursor() as cursor:
            for key in CONTEXT_KEYS: cursor.execute("SELECT set_config(%s, '', false)", [key])
    except Exception:
        connection.close()
        raise

class TenantJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        result = super().authenticate(request)
        if result: set_database_context(result[0])
        return result
