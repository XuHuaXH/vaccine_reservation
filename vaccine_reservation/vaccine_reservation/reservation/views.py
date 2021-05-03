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
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_403_FORBIDDEN,
    HTTP_404_NOT_FOUND,
    HTTP_200_OK,
    HTTP_201_CREATED
)
import random


@csrf_exempt
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

    # generate random geo coordinates ;)
    lat_min = -75.64535551802206
    lat_max = -71.86605890041902
    long_min = 38.974489
    long_max = 43.486928
    lat = lat_min + (lat_max - lat_min) * random.random()
    long = long_min + (long_max - long_min) * random.random()

    patient_serializer.save(user=user, patient_lat=lat, patient_long=long)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key}, status=status.HTTP_201_CREATED)


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def register_provider(request):
    user_serializer = ProviderUserSerializer(data=request.data)
    if not user_serializer.is_valid():
        return Response(data=user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    user = User.objects.create_user(
        username=request.data['username'], email=request.data['email'], password=request.data['password'])
    user.save()

    provider_serializer = ProviderSerializer(data=request.data)
    if not provider_serializer.is_valid():
        return Response(data=patient_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # generate random geo coordinates ;)
    lat_min = -75.64535551802206
    lat_max = -71.86605890041902
    long_min = 38.974489
    long_max = 43.486928
    lat = lat_min + (lat_max - lat_min) * random.random()
    long = long_min + (long_max - long_min) * random.random()

    provider_serializer.save(user=user, provider_lat=lat, provider_long=long)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key}, status=status.HTTP_201_CREATED)


@csrf_exempt
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
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key},
                    status=HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    logout(request)
    return Response(status=HTTP_200_OK)


@csrf_exempt
@api_view(["GET"])
def get_availability(request):
    try:
        patient = Patient.objects.get(user=request.user)
    except Patient.DoesNotExist:
        return Response(data={'message': 'patient-only API'}, status=HTTP_403_FORBIDDEN)
    results = PatientPreferredTime.objects.filter(patient=patient)
    serializer = PatientPreferredTimeSerializer(results, many=True)
    return Response(serializer.data, status=HTTP_200_OK)


@csrf_exempt
@api_view(["POST"])
def add_availability(request):
    try:
        patient = Patient.objects.get(user=request.user)
    except Patient.DoesNotExist:
        return Response(data={'message': 'patient-only API'}, status=HTTP_403_FORBIDDEN)

    # validate field values
    if request.data['day_of_week'] not in days_of_week or request.data['timeslot'] not in timeslots:
        return Response(status=HTTP_400_BAD_REQUEST)

    serializer = PatientPreferredTimeSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # check if this entry already exists
    entries = PatientPreferredTime.objects.filter(
        patient=patient, day_of_week=request.data['day_of_week'], timeslot=request.data['timeslot'])
    if len(entries) == 0:
        serializer.save(patient=patient)
    return Response(status=HTTP_200_OK)


@csrf_exempt
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


@csrf_exempt
@api_view(["GET"])
def get_appointments(request):
    try:
        provider = Provider.objects.get(user=request.user)
    except Provider.DoesNotExist:
        return Response(data={'message': 'provider-only API'}, status=HTTP_403_FORBIDDEN)


@csrf_exempt
@api_view(["POST"])
def add_appointment(request):
    try:
        provider = Provider.objects.get(user=request.user)
    except Provider.DoesNotExist:
        return Response(data={'message': 'provider-only API'}, status=HTTP_403_FORBIDDEN)

    serializer = AppointmentSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(data=serializer.errors, status=HTTP_400_BAD_REQUEST)
    serializer.save(provider=provider)
    return Response(status=HTTP_201_CREATED)
