# Generated by Django 3.2 on 2021-05-02 13:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reservation', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='provider',
            old_name='patient_address',
            new_name='provider_address',
        ),
    ]
