# Generated by Django 4.2.7 on 2024-08-14 14:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('concours', '0011_concourscategory_image_concourssubcategory_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='concours',
            name='category',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='concours.concourscategory'),
        ),
    ]
