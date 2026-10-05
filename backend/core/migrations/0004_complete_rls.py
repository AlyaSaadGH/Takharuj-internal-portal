import django.db.models.deletion
from django.db import migrations, models

TABLES = ("core_supportmessage", "core_creditnote", "core_debitnote")

def secure_tables(apps, schema_editor):
    if schema_editor.connection.vendor != "postgresql": return
    q = schema_editor.connection.ops.quote_name
    with schema_editor.connection.cursor() as cursor:
        cursor.execute(
            "UPDATE core_supportmessage m SET tenant_id=c.tenant_id "
            "FROM core_supportconversation c WHERE m.conversation_id=c.id AND m.tenant_id IS NULL"
        )
        cursor.execute("ALTER TABLE core_supportmessage ALTER COLUMN tenant_id SET NOT NULL")
        for table in TABLES:
            expression = (
                "COALESCE(current_setting('app.is_platform_admin', true), '') = 'true' "
                "OR tenant_id::text = NULLIF(current_setting('app.tenant_id', true), '')"
            )
            policy = f"{table}_tenant_isolation"
            cursor.execute(f"ALTER TABLE {q(table)} ENABLE ROW LEVEL SECURITY")
            cursor.execute(f"ALTER TABLE {q(table)} FORCE ROW LEVEL SECURITY")
            cursor.execute(f"DROP POLICY IF EXISTS {q(policy)} ON {q(table)}")
            cursor.execute(f"CREATE POLICY {q(policy)} ON {q(table)} USING ({expression}) WITH CHECK ({expression})")

class Migration(migrations.Migration):
    dependencies = [("core", "0003_supportmessage_tenant_creditnote_debitnote")]
    operations = [
        migrations.RunPython(secure_tables, migrations.RunPython.noop),
        migrations.SeparateDatabaseAndState(state_operations=[
            migrations.AlterField(
                model_name="supportmessage", name="tenant",
                field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to="core.tenant"),
            )
        ]),
    ]
