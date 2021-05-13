from django.db import models
from django.contrib.auth.models import User
from concurrency.fields import IntegerVersionField


class PriorityGroup(models.Model):
    priority = models.IntegerField(unique=True)
    description = models.TextField()
    earliest_date = models.DateField()


class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    ssn = models.CharField(max_length=20)
    dob = models.DateField()
    patient_address = models.CharField(max_length=255)
    patient_lat = models.FloatField()
    patient_long = models.FloatField()
    patient_phone = models.CharField(blank=True, max_length=20)
    max_distance = models.IntegerField()
    priority = models.ForeignKey(PriorityGroup, null=True, on_delete=models.SET_NULL)


class PatientDocument(models.Model):
    document = models.BinaryField()
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)


class PatientPreferredTime(models.Model):
    version = IntegerVersionField()
    day_of_week = models.CharField(max_length=20)
    timeslot = models.TimeField()
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)


class Provider(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    provider_name = models.CharField(max_length=255)
    provider_address = models.CharField(max_length=255)
    provider_lat = models.FloatField()
    provider_long = models.FloatField()
    provider_phone = models.CharField(blank=True, max_length=20)
    provider_type = models.CharField(blank=True, max_length=100)


class Appointment(models.Model):
    date = models.DateField()
    timeslot = models.TimeField()
    capacity = models.IntegerField()
    provider = models.ForeignKey(Provider, on_delete=models.CASCADE)


class OfferHistory(models.Model):
    version = IntegerVersionField()
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    sent_datetime = models.DateTimeField()
    expiration_datetime = models.DateTimeField()
    response_datetime = models.DateTimeField(null=True)
    cancellation_datetime = models.DateTimeField(null=True)
    accepted = models.BooleanField(null=True)

    CHOICES = [
        ('cancelled', 'Cancelled'),
        ('missed', 'Missed'),
        ('completed', 'Completed'),
        ('scheduled', 'Scheduled')
    ]
    status = models.CharField(max_length=225, null=True, choices=CHOICES)
