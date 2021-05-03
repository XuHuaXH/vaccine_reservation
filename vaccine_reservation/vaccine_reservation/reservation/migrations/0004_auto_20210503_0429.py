# Generated by Django 3.2 on 2021-05-03 04:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reservation', '0003_remove_patient_patient_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='offerhistory',
            name='accept',
        ),
        migrations.AddField(
            model_name='offerhistory',
            name='accepted',
            field=models.BooleanField(null=True),
        ),
        migrations.AddField(
            model_name='offerhistory',
            name='cancellation_datetime',
            field=models.DateTimeField(null=True),
        ),
        migrations.AlterField(
            model_name='offerhistory',
            name='response_datetime',
            field=models.DateTimeField(null=True),
        ),
        migrations.AlterField(
            model_name='offerhistory',
            name='status',
            field=models.CharField(choices=[('cancelled', 'Cancelled'), ('missed', 'Missed'), ('completed', 'Completed'), ('scheduled', 'Scheduled')], max_length=225, null=True),
        ),
    ]
