from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0005_subcategory_hidden'),
    ]

    operations = [
        migrations.AddField(
            model_name='subcategory',
            name='hidden_by',
            field=models.ManyToManyField(blank=True, related_name='hidden_subcategories', to=settings.AUTH_USER_MODEL),
        ),
    ]
