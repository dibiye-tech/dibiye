# Generated by Django 4.2.7 on 2024-08-01 08:23

import concours.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('concours', '0006_alter_concours_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='concours',
            name='image',
            field=models.ImageField(default='posts/image1.png', upload_to=concours.models.upload_to, verbose_name='Image'),
        ),
    ]
