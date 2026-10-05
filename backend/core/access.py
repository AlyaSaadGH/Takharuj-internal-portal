from rest_framework.permissions import BasePermission

def is_platform(user): return bool(user.is_authenticated and (user.role == "platform_admin" or user.is_superuser))
def full_access(user): return is_platform(user) or user.permission_scope == "full_access"

class PlatformOnly(BasePermission):
    def has_permission(self, request, view): return is_platform(request.user)

class FullAccess(BasePermission):
    def has_permission(self, request, view): return full_access(request.user)

