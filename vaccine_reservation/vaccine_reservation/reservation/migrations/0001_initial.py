# Generated by Django 3.2 on 2021-05-01 20:31

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Appointment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('timeslot', models.TimeField()),
                ('capacity', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Patient',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('patient_name', models.CharField(max_length=255)),
                ('ssn', models.CharField(max_length=20)),
                ('dob', models.DateField()),
                ('patient_address', models.CharField(max_length=255)),
                ('patient_lat', models.FloatField()),
                ('patient_long', models.FloatField()),
                ('patient_phone', models.CharField(blank=True, max_length=20)),
                ('max_distance', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='PriorityGroup',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('priority', models.IntegerField(unique=True)),
                ('description', models.TextField()),
                ('earliest_date', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='Provider',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('provider_name', models.CharField(max_length=255)),
                ('patient_address', models.CharField(max_length=255)),
                ('provider_lat', models.FloatField()),
                ('provider_long', models.FloatField()),
                ('provider_phone', models.CharField(blank=True, max_length=20)),
                ('provider_type', models.CharField(blank=True, max_length=100)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='PatientPreferredTime',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('day_of_week', models.CharField(max_length=20)),
                ('timeslot', models.TimeField()),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='reservation.patient')),
            ],
        ),
        migrations.CreateModel(
            name='PatientDocument',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('document', models.BinaryField()),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='reservation.patient')),
            ],
        ),
        migrations.AddField(
            model_name='patient',
            name='priority',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='reservation.prioritygroup'),
        ),
        migrations.AddField(
            model_name='patient',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='OfferHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sent_datetime', models.DateTimeField()),
                ('expiration_datetime', models.DateTimeField()),
                ('response_datetime', models.DateTimeField()),
                ('accept', models.BooleanField()),
                ('status', models.CharField(choices=[('cancelled', 'Cancelled'), ('missed', 'Missed'), ('completed', 'Completed'), ('scheduled', 'Scheduled')], max_length=225)),
                ('appointment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='reservation.appointment')),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='reservation.patient')),
            ],
        ),
        migrations.AddField(
            model_name='appointment',
            name='provider',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='reservation.provider'),
        ),
    ]
