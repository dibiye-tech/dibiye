# Generated by Django 4.2.7 on 2024-11-21 10:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('concours', '0031_alter_grandecole_university'),
    ]

    operations = [
        migrations.AddField(
            model_name='concours',
            name='conccours_publication',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='concours',
            name='cycles',
            field=models.ManyToManyField(blank=True, related_name='concours', to='concours.cycle'),
        ),
        migrations.AlterField(
            model_name='concours',
            name='grandes_ecoles',
            field=models.ManyToManyField(blank=True, related_name='concours', to='concours.grandecole'),
        ),
        migrations.AlterField(
            model_name='concours',
            name='niveau_minimum',
            field=models.ManyToManyField(blank=True, related_name='concours_requis', to='concours.niveauminimum'),
        ),
        migrations.AlterField(
            model_name='concours',
            name='niveau_obtenu',
            field=models.ManyToManyField(blank=True, related_name='concours_obtenu', to='concours.niveauobtenue'),
        ),
    ]
