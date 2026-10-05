from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("core", "0006_protect_platform_records")]

    operations = [
        migrations.AddField(
            model_name="client",
            name="email",
            field=models.EmailField(blank=True, max_length=254),
        ),
        migrations.AddField(
            model_name="client",
            name="phone_number",
            field=models.CharField(blank=True, max_length=32),
        ),
    ]
