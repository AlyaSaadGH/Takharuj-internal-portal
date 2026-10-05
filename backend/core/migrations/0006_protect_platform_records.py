from django.db import migrations


FORWARD_SQL = """
CREATE OR REPLACE FUNCTION protect_platform_user_delete()
RETURNS trigger AS $$
BEGIN
    IF OLD.role = 'platform_admin' OR OLD.is_superuser THEN
        RAISE EXCEPTION 'Platform administrator accounts are protected from deletion.';
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS protect_platform_user_delete_trigger ON core_user;
CREATE TRIGGER protect_platform_user_delete_trigger
BEFORE DELETE ON core_user
FOR EACH ROW EXECUTE FUNCTION protect_platform_user_delete();

CREATE OR REPLACE FUNCTION protect_platform_tenant_delete()
RETURNS trigger AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM core_user
        WHERE tenant_id = OLD.id AND (role = 'platform_admin' OR is_superuser)
    ) THEN
        RAISE EXCEPTION 'Platform tenant is protected from deletion.';
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS protect_platform_tenant_delete_trigger ON core_tenant;
CREATE TRIGGER protect_platform_tenant_delete_trigger
BEFORE DELETE ON core_tenant
FOR EACH ROW EXECUTE FUNCTION protect_platform_tenant_delete();
"""

REVERSE_SQL = """
DROP TRIGGER IF EXISTS protect_platform_user_delete_trigger ON core_user;
DROP FUNCTION IF EXISTS protect_platform_user_delete();
DROP TRIGGER IF EXISTS protect_platform_tenant_delete_trigger ON core_tenant;
DROP FUNCTION IF EXISTS protect_platform_tenant_delete();
"""


class Migration(migrations.Migration):
    dependencies = [("core", "0005_client_registration_certificate")]
    operations = [migrations.RunSQL(FORWARD_SQL, REVERSE_SQL)]
