# Generated Migration
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0006_alter_subcategory_video'),
    ]

    operations = [
        migrations.AddField(
            model_name='subcategory',
            name='voice',
            field=models.FileField(blank=True, upload_to='subcategories/voices/'),
        ),
    ]
