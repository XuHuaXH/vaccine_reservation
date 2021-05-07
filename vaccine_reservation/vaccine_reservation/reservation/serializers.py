from rest_framework import serializers
from django.contrib.auth.models import User
from reservation.models import PriorityGroup, Patient, Provider, Appointment, PatientDocument, PatientPreferredTime, OfferHistory


class UserPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']


class PatientPublicSerializer(serializers.ModelSerializer):
    user = UserPublicSerializer()

    class Meta:
        model = Patient
        fields = ['user', 'ssn',
                  'dob', 'patient_address', 'patient_phone', 'max_distance']


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


class ProviderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provider
        fields = ['provider_name', 'provider_address', 'provider_phone', 'provider_type']


class ProviderSerializer(serializers.ModelSerializer):
    user = UserPublicSerializer()

    class Meta:
        model = Provider
        fields = ['user', 'provider_name', 'provider_address', 'provider_phone', 'provider_type']


class AddAppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['date', 'timeslot', 'capacity']


class GetAppointmentSerializer(serializers.ModelSerializer):
    provider = ProviderSerializer()

    class Meta:
        model = Appointment
        fields = ['provider', 'date', 'timeslot', 'capacity']


class AddOfferHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = OfferHistory
        fields = ['appointment', 'patient', 'sent_datetime']


class GetOfferHistorySerializer(serializers.ModelSerializer):
    appointment = GetAppointmentSerializer()
    patient = PatientPublicSerializer()

    class Meta:
        model = OfferHistory
        fields = ['id', 'appointment', 'patient', 'sent_datetime', 'expiration_datetime',
                  'response_datetime', 'cancellation_datetime', 'accepted', 'status']
