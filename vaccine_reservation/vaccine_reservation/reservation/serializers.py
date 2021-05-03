from rest_framework import serializers
from django.contrib.auth.models import User
from reservation.models import PriorityGroup, Patient, Provider, Appointment, PatientDocument, PatientPreferredTime, OfferHistory


class PatientUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'first_name', 'last_name', 'email']


class ProviderUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email']


class PriorityGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = PriorityGroup
        fields = ['priority', 'description', 'earliest_date']


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['ssn',
                  'dob', 'patient_address', 'patient_phone', 'max_distance']


class PatientDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientDocument
        fields = ['document']


class PatientPreferredTimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientPreferredTime
        fields = ['day_of_week', 'timeslot']


class ProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provider
        fields = ['provider_name', 'provider_address', 'provider_phone', 'provider_type']


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['date', 'timeslot', 'capacity']


class AddOfferHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = OfferHistory
        fields = ['appointment', 'patient', 'sent_datetime']
