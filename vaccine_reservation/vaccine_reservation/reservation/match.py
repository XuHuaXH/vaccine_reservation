from reservation.models import *
from django.db import connection


# return all the patients who have not been vacinnated and do not have an appointment scheduled
def get_waiting_patients():
    not_waiting = Patient.objects.raw(
        "select * from reservation_patient join reservation_offerhistory on reservation_patient.id = reservation_offerhistory.patient_id where status='completed' or status='scheduled'")
    record = set(())
    for p in not_waiting:
        record.add(p)
    all_patients = Patient.objects.all()
    result = []
    for p in all_patients:
        if p not in not_waiting:
            result.append(p)
    print('Found ' + str(len(result)) + ' waiting patients.')
    return result


# get all the appointments in the future that are not full yet
def get_appointments():
    result = Appointment.objects.raw("select reservation_appointment.id, count(*) as count, reservation_appointment.capacity from reservation_appointment join reservation_offerhistory on reservation_appointment.id = reservation_offerhistory.appointment_id where reservation_offerhistory.status = 'completed' or reservation_offerhistory.status='scheduled' group by reservation_appointment.id having count(*) < reservation_appointment.capacity union select reservation_appointment.id, 0, reservation_appointment.capacity from reservation_appointment where reservation_appointment.id not in (select reservation_offerhistory.appointment_id from reservation_offerhistory)")
    print('Found ' + str(len(result)) + ' available appointments')
    return result


class FFSolver:
    def __init__(self):
        # get all possible patient-appointment matchings so that
        # 1. the appointment time is preferred by the patient and
        # 2. the provider is within max_distance from patient's location and
        # 3. the patient is not yet vaccinated nor scheduled and
        # 4. the appointment has not reached its capacity
        with connection.cursor() as cursor:
            cursor.execute("select reservation_patient.id as patient_id, reservation_appointment.id as appointment_id from reservation_patient join reservation_patientpreferredtime on reservation_patient.id = reservation_patientpreferredtime.patient_id join reservation_appointment on reservation_patientpreferredtime.timeslot = reservation_appointment.timeslot and reservation_patientpreferredtime.day_of_week = DAYNAME(reservation_appointment.date) join reservation_provider on reservation_provider.id = reservation_appointment.provider_id where ST_Distance_Sphere(point(patient_long, patient_lat), point(provider_long, provider_lat)) * .000621371192 <= reservation_patient.max_distance and reservation_patient.id not in (select reservation_patient.id from reservation_patient join reservation_offerhistory on reservation_patient.id = reservation_offerhistory.patient_id where status='completed' or status='scheduled') and reservation_appointment.id in (select id from (select reservation_appointment.id, reservation_appointment.capacity from reservation_appointment join reservation_offerhistory on reservation_appointment.id = reservation_offerhistory.appointment_id where reservation_offerhistory.status = 'completed' or reservation_offerhistory.status='scheduled' group by reservation_appointment.id having count(*) < reservation_appointment.capacity union select reservation_appointment.id, reservation_appointment.capacity from reservation_appointment where reservation_appointment.id not in (select reservation_offerhistory.appointment_id from reservation_offerhistory) ) d1)")
            edges = cursor.fetchall()
            for row in cursor.fetchall():
                print(row)

            # build residual graph
            self.graph = {}
            self.patient_ids = set(())
            self.appointment_ids = set(())
            for e in edges:
                if e[0] not in patient_ids:
                    patient_ids.add(e[0])
                if e[1] not in appointment_ids:
                    appointments_ids.add(e[1])
                if e[0] not in self.graph:
                    self.graph[e[0]] = {}
                self.graph[e[0]][e[1]] = 1

            # get residual capacities of appointments
            cursor.execute("select id, capacity - count as residual from (select reservation_appointment.id, count(*) as count, reservation_appointment.capacity from reservation_appointment join reservation_offerhistory on reservation_appointment.id = reservation_offerhistory.appointment_id where reservation_offerhistory.status = 'completed' or reservation_offerhistory.status='scheduled' group by reservation_appointment.id having count(*) < reservation_appointment.capacity union select reservation_appointment.id, 0, reservation_appointment.capacity from reservation_appointment where reservation_appointment.id not in (select reservation_offerhistory.appointment_id from reservation_offerhistory)) d1")
            self.graph['s'] = {}
            self.graph['t'] = {}
            for i in self.patient_ids:
                self.graph['s'][i] = 1
            for i in self.appointment_ids:
                self.graph[i]['t'] = ???


def match():
    # patient_list = get_waiting_patients()
    # appointment_list = get_appointments()
    solver = FFSolver()
