from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("core", "0004_complete_rls")]
    operations = [
        migrations.AddField(
            model_name="client",
            name="registration_certificate",
            field=models.FileField(blank=True, null=True, upload_to="client-certificates/"),
        ),
    ]
