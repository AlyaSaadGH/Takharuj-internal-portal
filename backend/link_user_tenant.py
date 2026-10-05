import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'takharuj_backend.settings')
django.setup()

from core.models import User, Tenant

# Get user and tenant
user = User.objects.get(email='admin@example.com')
tenant = Tenant.objects.first()

# Connect user to tenant
user.tenant_id = tenant.id
user.save()

print(f"✓ تم ربط {user.email} بـ {tenant.name}")
print(f"  User tenant_id: {user.tenant_id}")
