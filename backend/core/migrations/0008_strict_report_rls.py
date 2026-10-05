from django.db import migrations


TENANT_TABLES = (
    "core_tenant",
    "core_subscription",
    "core_client",
    "core_product",
    "core_invoice",
    "core_invoiceline",
    "core_creditnote",
    "core_debitnote",
    "core_auditlog",
    "core_notification",
    "core_supportconversation",
    "core_supportmessage",
)


def enforce_strict_scope(apps, schema_editor):
    if schema_editor.connection.vendor != "postgresql":
        return
    q = schema_editor.connection.ops.quote_name
    with schema_editor.connection.cursor() as cursor:
        for table in TENANT_TABLES:
            column = "id" if table == "core_tenant" else "tenant_id"
            tenant_match = (
                f"{q(column)}::text = "
                "NULLIF(current_setting('app.tenant_id', true), '')"
            )
            platform_bypass = (
                "COALESCE(current_setting('app.is_platform_admin', true), '') = 'true' "
                "AND COALESCE(current_setting('app.strict_tenant_scope', true), '') <> 'true'"
            )
            expression = f"(({tenant_match}) OR ({platform_bypass}))"
            policy = f"{table}_tenant_isolation"
            cursor.execute(f"ALTER TABLE {q(table)} ENABLE ROW LEVEL SECURITY")
            cursor.execute(f"ALTER TABLE {q(table)} FORCE ROW LEVEL SECURITY")
            cursor.execute(f"DROP POLICY IF EXISTS {q(policy)} ON {q(table)}")
            cursor.execute(
                f"CREATE POLICY {q(policy)} ON {q(table)} "
                f"USING ({expression}) WITH CHECK ({expression})"
            )


class Migration(migrations.Migration):
    dependencies = [("core", "0007_client_contact_fields")]
    operations = [migrations.RunPython(enforce_strict_scope, migrations.RunPython.noop)]
