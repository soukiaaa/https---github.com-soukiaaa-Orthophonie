from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0004_delete_customsubcategory'),
    ]

    operations = [
        migrations.AddField(
            model_name='subcategory',
            name='hidden',
            field=models.BooleanField(default=False),
        ),
    ]
