# Generated by Django 4.2.7 on 2024-08-01 12:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('concours', '0007_alter_concours_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='concours',
            name='is_published',
            field=models.BooleanField(default=False),
        ),
    ]
