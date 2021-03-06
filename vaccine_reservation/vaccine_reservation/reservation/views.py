from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token
from reservation.models import Patient, Provider, Appointment, PatientDocument, PatientPreferredTime, OfferHistory
from reservation.serializers import *
from reservation.options import *
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, logout
from rest_framework.authtoken.models import Token
from django.db import connection
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_403_FORBIDDEN,
    HTTP_404_NOT_FOUND,
    HTTP_200_OK,
    HTTP_201_CREATED
)
import random
from datetime import datetime, timezone


@api_view(['POST'])
@permission_classes([AllowAny])
def register_patient(request):
    user_serializer = PatientUserSerializer(data=request.data)
    if not user_serializer.is_valid():
        return Response(data=user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    user = User.objects.create_user(username=request.data['username'], email=request.data['email'],
                                    password=request.data['password'], first_name=request.data['first_name'], last_name=request.data['last_name'])
    user.save()

    patient_serializer = PatientSerializer(data=request.data)
    if not patient_serializer.is_valid():
        return Response(data=patient_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # generate random geo coordinates for now
    long_min = -75.64535551802206
    long_max = -71.86605890041902
    lat_min = 38.974489
    lat_max = 43.486928
    lat = lat_min + (lat_max - lat_min) * random.random()
    long = long_min + (long_max - long_min) * random.random()

    patient_serializer.save(user=user, patient_lat=lat, patient_long=long)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_provider(request):
    user_serializer = ProviderUserSerializer(data=request.data)
    if not user_serializer.is_valid():
        return Response(data=user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    user = User.objects.create_user(
        username=request.data['username'], email=request.data['email'], password=request.data['password'])
    user.save()

    provider_serializer = ProviderCreateSerializer(data=request.data)
    if not provider_serializer.is_valid():
        return Response(data=provider_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # generate random geo coordinates for now
    long_min = -75.64535551802206
    long_max = -71.86605890041902
    lat_min = 38.974489
    lat_max = 43.486928
    lat = lat_min + (lat_max - lat_min) * random.random()
    long = long_min + (long_max - long_min) * random.random()

    provider_serializer.save(user=user, provider_lat=lat, provider_long=long)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key}, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes((AllowAny,))
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    if username is None or password is None:
        return Response({'error': 'Please provide both username and password'}, status=HTTP_400_BAD_REQUEST)
    user = authenticate(username=username, password=password)
    if not user:
        return Response({'error': 'Invalid Credentials'}, status=HTTP_404_NOT_FOUND)

    # determine if user is a patient or a provider
    type = ''
    try:
        patient = Patient.objects.get(user=user)
        type = 'patient'
    except Patient.DoesNotExist:
        type = 'provider'
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key, 'type': type},
                    status=HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    token = Token.objects.get(user=request.user)
    token.delete()
    return Response(status=HTTP_200_OK)


@api_view(["GET"])
def get_availability(request):
    try:
        patient = Patient.objects.get(user=request.user)
    except Patient.DoesNotExist:
        return Response(data={'message': 'patient-only API'}, status=HTTP_403_FORBIDDEN)
    results = PatientPreferredTime.objects.filter(patient=patient)
    serializer = PatientPreferredTimeSerializer(results, many=True)
    return Response(serializer.data, status=HTTP_200_OK)


@api_view(["POST"])
def add_availability(request):
    try:
        patient = Patient.objects.get(user=request.user)
    except Patient.DoesNotExist:
        return Response(data={'message': 'patient-only API'}, status=HTTP_403_FORBIDDEN)

    serializer = PatientPreferredTimeSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(data=serializer.errors, status=HTTP_400_BAD_REQUEST)

    # validate field values
    if request.data['day_of_week'] not in days_of_week or request.data['timeslot'] not in timeslots:
        return Response(status=HTTP_400_BAD_REQUEST)

    # check if this entry already exists
    entries = PatientPreferredTime.objects.filter(
        patient=patient, day_of_week=request.data['day_of_week'], timeslot=request.data['timeslot'])
    if len(entries) == 0:
        serializer.save(patient=patient)
    return Response(status=HTTP_200_OK)


@api_view(["DELETE"])
def delete_availability(request):
    try:
        patient = Patient.objects.get(user=request.user)
    except Patient.DoesNotExist:
        return Response(data={'message': 'patient-only API'}, status=HTTP_403_FORBIDDEN)

    serializer = PatientPreferredTimeSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(data=serializer.errors, status=HTTP_400_BAD_REQUEST)

    results = PatientPreferredTime.objects.filter(
        patient=patient, day_of_week=request.data['day_of_week'], timeslot=request.data['timeslot'])
    if len(results) == 0:
        return Response(data={'message': 'availability not found'}, status=HTTP_404_NOT_FOUND)
    else:
        for entry in results:
            entry.delete()
    return Response(status=HTTP_200_OK)


@api_view(["GET"])
def get_appointments(request):
    try:
        provider = Provider.objects.get(user=request.user)
    except Provider.DoesNotExist:
        return Response(data={'message': 'provider-only API'}, status=HTTP_403_FORBIDDEN)
    appointments = Appointment.objects.filter(provider_id=provider.id)
    serializer = GetAppointmentSerializer(appointments, many=True)
    return Response(serializer.data, status=HTTP_200_OK)


@api_view(["POST"])
def add_appointment(request):
    try:
        provider = Provider.objects.get(user=request.user)
    except Provider.DoesNotExist:
        return Response(data={'message': 'provider-only API'}, status=HTTP_403_FORBIDDEN)

    serializer = AddAppointmentSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(data=serializer.errors, status=HTTP_400_BAD_REQUEST)
    serializer.save(provider=provider)
    return Response(status=HTTP_201_CREATED)


@api_view(["GET"])
def provider_scheduled_appointments(request):
    try:
        provider = Provider.objects.get(user=request.user)
    except Provider.DoesNotExist:
        return Response(data={'message': 'provider-only API'}, status=HTTP_403_FORBIDDEN)

    results = OfferHistory.objects.raw(
        "select * from reservation_offerHistory join reservation_appointment on reservation_offerHistory.appointment_id = reservation_appointment.id where reservation_appointment.provider_id = %s and status='scheduled'", [provider.id])
    serializer = GetOfferHistorySerializer(results, many=True)
    return Response(serializer.data, status=HTTP_200_OK)


@api_view(["GET"])
def provider_cancelled_appointments(request):
    try:
        provider = Provider.objects.get(user=request.user)
    except Provider.DoesNotExist:
        return Response(data={'message': 'provider-only API'}, status=HTTP_403_FORBIDDEN)

    results = OfferHistory.objects.raw(
        "select * from reservation_offerHistory join reservation_appointment on reservation_offerHistory.appointment_id = reservation_appointment.id where reservation_appointment.provider_id = %s and status='cancelled'", [provider.id])
    serializer = GetOfferHistorySerializer(results, many=True)
    return Response(serializer.data, status=HTTP_200_OK)


@api_view(["GET"])
def provider_missed_appointments(request):
    try:
        provider = Provider.objects.get(user=request.user)
    except Provider.DoesNotExist:
        return Response(data={'message': 'provider-only API'}, status=HTTP_403_FORBIDDEN)

    results = OfferHistory.objects.raw(
        "select * from reservation_offerHistory join reservation_appointment on reservation_offerHistory.appointment_id = reservation_appointment.id where reservation_appointment.provider_id = %s and status='missed'", [provider.id])
    serializer = GetOfferHistorySerializer(results, many=True)
    return Response(serializer.data, status=HTTP_200_OK)


@api_view(["GET"])
def provider_completed_appointments(request):
    try:
        provider = Provider.objects.get(user=request.user)
    except Provider.DoesNotExist:
        return Response(data={'message': 'provider-only API'}, status=HTTP_403_FORBIDDEN)

    results = OfferHistory.objects.raw(
        "select * from reservation_offerHistory join reservation_appointment on reservation_offerHistory.appointment_id = reservation_appointment.id where reservation_appointment.provider_id = %s and status='completed'", [provider.id])
    serializer = GetOfferHistorySerializer(results, many=True)
    return Response(serializer.data, status=HTTP_200_OK)


@api_view(["GET"])
def patient_current_offers(request):
    try:
        patient = Patient.objects.get(user=request.user)
    except Patient.DoesNotExist:
        return Response(data={'message': 'patient-only API'}, status=HTTP_403_FORBIDDEN)

    results = OfferHistory.objects.raw(
        "select * from reservation_offerHistory join reservation_patient on reservation_offerHistory.patient_id = reservation_patient.id where reservation_patient.id = %s and accepted is NULL and reservation_offerHistory.expiration_datetime > NOW()", [patient.id])
    serializer = GetOfferHistorySerializer(results, many=True)
    return Response(serializer.data, status=HTTP_200_OK)


@api_view(["GET"])
def patient_expired_offers(request):
    try:
        patient = Patient.objects.get(user=request.user)
    except Patient.DoesNotExist:
        return Response(data={'message': 'patient-only API'}, status=HTTP_403_FORBIDDEN)

    results = OfferHistory.objects.raw(
        "select * from reservation_offerHistory join reservation_patient on reservation_offerHistory.patient_id = reservation_patient.id where reservation_patient.id = %s and accepted is NULL and reservation_offerHistory.expiration_datetime <= NOW()", [patient.id])
    serializer = GetOfferHistorySerializer(results, many=True)
    return Response(serializer.data, status=HTTP_200_OK)


@api_view(["GET"])
def patient_past_offers(request):
    try:
        patient = Patient.objects.get(user=request.user)
    except Patient.DoesNotExist:
        return Response(data={'message': 'patient-only API'}, status=HTTP_403_FORBIDDEN)

    results = OfferHistory.objects.raw(
        "select * from reservation_offerHistory join reservation_patient on reservation_offerHistory.patient_id = reservation_patient.id where reservation_patient.id = %s and (not status='scheduled' or accepted = 0)", [patient.id])
    serializer = GetOfferHistorySerializer(results, many=True)
    return Response(serializer.data, status=HTTP_200_OK)


@api_view(["GET"])
def patient_scheduled_appointments(request):
    try:
        patient = Patient.objects.get(user=request.user)
    except Patient.DoesNotExist:
        return Response(data={'message': 'patient-only API'}, status=HTTP_403_FORBIDDEN)

    results = OfferHistory.objects.raw(
        "select * from reservation_offerHistory join reservation_patient on reservation_offerHistory.patient_id = reservation_patient.id where reservation_patient.id = %s and status='scheduled'", [patient.id])
    serializer = GetOfferHistorySerializer(results, many=True)
    return Response(serializer.data, status=HTTP_200_OK)


@api_view(["GET"])
def offer_detail(request):
    try:
        patient = Patient.objects.get(user=request.user)
    except Patient.DoesNotExist:
        return Response(data={'message': 'patient-only API'}, status=HTTP_403_FORBIDDEN)

    try:
        offer = OfferHistory.objects.get(id=request.data['id'])
    except OfferHistory.DoesNotExist:
        return Response(data={'message': 'offer not found'}, status=HTTP_404_NOT_FOUND)

    # check ownership of the offer
    if offer.patient.user != request.user:
        return Response(data={'message': 'Patients can only see their own offers!'}, status=HTTP_403_FORBIDDEN)
    serializer = GetOfferHistorySerializer(offer)
    return Response(serializer.data, status=HTTP_200_OK)


@api_view(["POST"])
def cancel_appointment(request):
    try:
        patient = Patient.objects.get(user=request.user)
    except Patient.DoesNotExist:
        return Response(data={'message': 'patient-only API'}, status=HTTP_403_FORBIDDEN)

    try:
        offer = OfferHistory.objects.get(id=request.data['id'])
    except OfferHistory.DoesNotExist:
        return Response(data={'message': 'offer not found'}, status=HTTP_404_NOT_FOUND)

    # check ownership of the offer
    if offer.patient.user != request.user:
        return Response(data={'message': 'Patients can only cancel their own appointments!'}, status=HTTP_403_FORBIDDEN)
    elif offer.accepted is None or offer.status != 'scheduled':
        return Response(data={'message': 'This appointment is not eligible for cancellation or is already cancelled.'}, status=HTTP_403_FORBIDDEN)

    # update offer
    offer.status = 'cancelled'
    offer.cancellation_datetime = datetime.now(timezone.utc)
    offer.save()

    serializer = GetOfferHistorySerializer(offer)
    return Response(serializer.data, status=HTTP_200_OK)


@api_view(["POST"])
def offer_response(request):
    try:
        patient = Patient.objects.get(user=request.user)
    except Patient.DoesNotExist:
        return Response(data={'message': 'patient-only API'}, status=HTTP_403_FORBIDDEN)

    try:
        offer = OfferHistory.objects.get(id=request.data['id'])
    except OfferHistory.DoesNotExist:
        return Response(data={'message': 'offer not found'}, status=HTTP_404_NOT_FOUND)

    # check ownership of the offer
    if offer.patient.user != request.user:
        return Response(data={'message': 'Patients can only respond to their own offers!'}, status=HTTP_403_FORBIDDEN)
    elif offer.accepted is not None:
        return Response(data={'message': 'This appointment has already been responded.'}, status=HTTP_403_FORBIDDEN)

    # check if this offer has expired
    if datetime.now(timezone.utc) >= offer.expiration_datetime:
        return Response(data={'message': 'This offer has expired.'}, status=HTTP_403_FORBIDDEN)

    # update offer
    try:
        offer.accepted = request.data['accepted']
        offer.response_datetime = datetime.now(timezone.utc)
        if offer.accepted:
            offer.status = 'scheduled'
        offer.save()

        serializer = GetOfferHistorySerializer(offer)
        return Response(serializer.data, status=HTTP_200_OK)
    except:
        return Response(status=HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def provider_get_summary(request):
    try:
        provider = Provider.objects.get(user=request.user)
    except Provider.DoesNotExist:
        return Response(data={'message': 'provider-only API'}, status=HTTP_403_FORBIDDEN)

    with connection.cursor() as cursor:
        cursor.execute(
            "select count(*) from reservation_offerHistory join reservation_appointment on reservation_offerHistory.appointment_id = reservation_appointment.id where reservation_appointment.provider_id = %s and status='scheduled'", [provider.id])
        scheduled_count = cursor.fetchone()[0]

        cursor.execute(
            "select count(*) from reservation_offerHistory join reservation_appointment on reservation_offerHistory.appointment_id = reservation_appointment.id where reservation_appointment.provider_id = %s and status='cancelled'", [provider.id])
        cancelled_count = cursor.fetchone()[0]

        cursor.execute(
            "select count(*) from reservation_offerHistory join reservation_appointment on reservation_offerHistory.appointment_id = reservation_appointment.id where reservation_appointment.provider_id = %s and status='missed'", [provider.id])
        missed_count = cursor.fetchone()[0]

        cursor.execute(
            "select count(*) from reservation_offerHistory join reservation_appointment on reservation_offerHistory.appointment_id = reservation_appointment.id where reservation_appointment.provider_id = %s and status='completed'", [provider.id])
        completed_count = cursor.fetchone()[0]

        cursor.execute(
            "select count(*) from reservation_offerHistory join reservation_appointment on reservation_offerHistory.appointment_id = reservation_appointment.id where reservation_appointment.provider_id = %s and accepted is NULL", [provider.id])
        waiting_count = cursor.fetchone()[0]

    data = {'scheduled': scheduled_count, 'cancelled': cancelled_count, 'missed': missed_count,
            'completed': completed_count, 'waiting_for_response': waiting_count}
    return Response(data=data, status=HTTP_200_OK)


@api_view(["GET"])
def patient_info(request):
    try:
        patient = Patient.objects.get(user=request.user)
    except Patient.DoesNotExist:
        return Response(data={'message': 'patient-only API'}, status=HTTP_403_FORBIDDEN)
    serializer = PatientPublicSerializer(patient)
    return Response(serializer.data, status=HTTP_200_OK)


@api_view(["GET"])
def provider_info(request):
    try:
        provider = Provider.objects.get(user=request.user)
    except Provider.DoesNotExist:
        return Response(data={'message': 'provider-only API'}, status=HTTP_403_FORBIDDEN)
    serializer = ProviderSerializer(provider)
    return Response(serializer.data, status=HTTP_200_OK)


@api_view(["POST"])
def provider_appointment_action(request):
    try:
        provider = Provider.objects.get(user=request.user)
    except Provider.DoesNotExist:
        return Response(data={'message': 'provider-only API'}, status=HTTP_403_FORBIDDEN)

    action = request.data.get('action')
    if action is None or (action != 'missed' and action != 'completed'):
        return Response(status=HTTP_400_BAD_REQUEST)

    try:
        offer = OfferHistory.objects.get(id=request.data['id'])
    except OfferHistory.DoesNotExist:
        return Response(status=HTTP_400_BAD_REQUEST)

    # check ownership of that offer
    if offer.appointment.provider != provider:
        return Response(data={'message': 'not your appointment!'}, status=HTTP_403_FORBIDDEN)

    offer.status = action
    offer.save()

    return Response(status=HTTP_200_OK)
