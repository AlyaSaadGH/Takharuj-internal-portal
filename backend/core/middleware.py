from .authentication import clear_database_context, set_database_context

class TenantContextCleanupMiddleware:
    def __init__(self, get_response): self.get_response = get_response
    def __call__(self, request):
        try:
            if request.path.startswith(("/admin/", "/takharuj-admin/")) and request.user.is_authenticated and request.user.is_staff:
                set_database_context(request.user)
            return self.get_response(request)
        finally:
            clear_database_context()
