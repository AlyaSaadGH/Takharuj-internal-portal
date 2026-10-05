from django.db import migrations

TENANT_TABLES = [
    "core_subscription", "core_client", "core_product", "core_invoice", "core_invoiceline",
    "core_auditlog", "core_notification", "core_supportconversation",
]

def install_rls(apps, schema_editor):
    if schema_editor.connection.vendor != "postgresql": return
    q = schema_editor.connection.ops.quote_name
    with schema_editor.connection.cursor() as cursor:
        for table in ["core_tenant", *TENANT_TABLES]:
            column = "id" if table == "core_tenant" else "tenant_id"
            expression = (
                "COALESCE(current_setting('app.is_platform_admin', true), '') = 'true' "
                f"OR {q(column)}::text = NULLIF(current_setting('app.tenant_id', true), '')"
            )
            policy = f"{table}_tenant_isolation"
            cursor.execute(f"ALTER TABLE {q(table)} ENABLE ROW LEVEL SECURITY")
            cursor.execute(f"ALTER TABLE {q(table)} FORCE ROW LEVEL SECURITY")
            cursor.execute(f"DROP POLICY IF EXISTS {q(policy)} ON {q(table)}")
            cursor.execute(f"CREATE POLICY {q(policy)} ON {q(table)} USING ({expression}) WITH CHECK ({expression})")

def remove_rls(apps, schema_editor):
    if schema_editor.connection.vendor != "postgresql": return
    q = schema_editor.connection.ops.quote_name
    with schema_editor.connection.cursor() as cursor:
        for table in ["core_tenant", *TENANT_TABLES]:
            cursor.execute(f"DROP POLICY IF EXISTS {q(table + '_tenant_isolation')} ON {q(table)}")
            cursor.execute(f"ALTER TABLE {q(table)} DISABLE ROW LEVEL SECURITY")

class Migration(migrations.Migration):
    dependencies = [("core", "0001_initial")]
    operations = [migrations.RunPython(install_rls, remove_rls)]

