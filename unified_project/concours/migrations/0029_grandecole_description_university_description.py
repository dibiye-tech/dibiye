# Generated by Django 4.2.7 on 2024-11-15 10:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('concours', '0028_remove_concours_niveau_obtenue_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='grandecole',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='university',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
    ]
