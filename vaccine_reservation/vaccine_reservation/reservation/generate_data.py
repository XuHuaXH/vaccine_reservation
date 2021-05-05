import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "vaccine_reservation.settings")
import django
django.setup()

from reservation.models import *
from reservation.options import *
from django.contrib.auth.models import User
from django.db import connection
import random
from datetime import datetime, timedelta
import string


def rand_char(count):
    return ''.join(random.choice(string.ascii_letters) for i in range(count))


def rand_date(start, end):
    return start + timedelta(
        seconds=random.randint(0, int((end - start).total_seconds())),
    )


def generate_patients(count):
    for i in range(count):
        username = 'test-' + rand_char(20)
        email = rand_char(10) + '@' + rand_char(10) + '.com'
        password = rand_char(30)
        first_name = rand_char(10)
        last_name = rand_char(10)

        user = User.objects.create_user(username=username, email=email,
                                        password=password, first_name=first_name, last_name=last_name)
        user.save()

        ssn = rand_char(11)
        dob = '1950-03-05'
        address = rand_char(20)
        phone = rand_char(20)
        max_distance = random.randint(30, 100)
        priority = PriorityGroup.objects.get(priority=random.randint(1, 2))

        # generate random geo coordinates ;)
        long_min = -75.64535551802206
        long_max = -71.86605890041902
        lat_min = 38.974489
        lat_max = 43.486928
        lat = lat_min + (lat_max - lat_min) * random.random()
        long = long_min + (long_max - long_min) * random.random()

        patient = Patient(user=user, ssn=ssn, dob=dob, patient_address=address, patient_lat=lat,
                          patient_long=long, patient_phone=phone, max_distance=max_distance, priority=priority)
        patient.save()

        # generate the availabilities
        num_of_availabilities = random.randint(2, 15)
        record = set(())
        for j in range(num_of_availabilities):
            day_of_week = random.choice(days_of_week)
            timeslot = random.choice(timeslots)
            if (day_of_week, timeslot) in record:
                continue
            record.add((day_of_week, timeslot))
            pt = PatientPreferredTime(day_of_week=day_of_week, timeslot=timeslot, patient=patient)
            pt.save()


def generate_providers(count):
    for i in range(count):
        username = 'test-' + rand_char(20)
        email = rand_char(10) + '@' + rand_char(10) + '.com'
        password = rand_char(30)

        user = User.objects.create_user(username=username, email=email, password=password)
        user.save()

        name = rand_char(30)
        type = rand_char(10)
        address = rand_char(20)
        phone = rand_char(20)

        # generate random geo coordinates ;)
        long_min = -75.64535551802206
        long_max = -71.86605890041902
        lat_min = 38.974489
        lat_max = 43.486928
        lat = lat_min + (lat_max - lat_min) * random.random()
        long = long_min + (long_max - long_min) * random.random()

        provider = Provider(user=user, provider_name=name, provider_address=address, provider_lat=lat,
                            provider_long=long, provider_phone=phone, provider_type=type)
        provider.save()

        # generate the appointments, which are all in one week for simplicity
        num_of_appointments = random.randint(1, 10)
        record = set(())
        for j in range(num_of_appointments):
            start = datetime.now()
            end = start + timedelta(days=7)
            date = rand_date(start, end)
            timeslot = random.choice(timeslots)
            capacity = random.randint(10, 50)
            if (date, timeslot) in record:
                continue
            record.add((date, timeslot))
            appointment = Appointment(date=date, timeslot=timeslot,
                                      capacity=capacity, provider=provider)
            appointment.save()


def delete_test_data():
    to_delete = User.objects.filter(username__startswith="test")
    for u in to_delete:
        u.delete()
