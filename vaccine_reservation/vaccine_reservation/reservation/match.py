from reservation.models import *
from django.db import connection
import collections
import copy
from datetime import datetime, timedelta, timezone, date


# return all the patients who have not been vacinnated and do not have an appointment scheduled, and do not have an unexpired unresponded offer
def get_waiting_patients():
    not_waiting = Patient.objects.raw(
        "select reservation_patient.id from reservation_patient join reservation_offerhistory on reservation_patient.id = reservation_offerhistory.patient_id where (reservation_offerHistory.response_datetime is NULL and reservation_offerhistory.expiration_datetime > NOW()) or status='completed' or status='scheduled'")
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
    result = Appointment.objects.raw("select reservation_appointment.id, count(*) as count, reservation_appointment.capacity from reservation_appointment join reservation_offerhistory on reservation_appointment.id = reservation_offerhistory.appointment_id where reservation_offerhistory.response_datetime is NULL or   reservation_offerhistory.status = 'completed' or reservation_offerhistory.status='scheduled' group by reservation_appointment.id having count(*) < reservation_appointment.capacity union select reservation_appointment.id, 0, reservation_appointment.capacity from reservation_appointment where reservation_appointment.id not in (select reservation_offerhistory.appointment_id from reservation_offerhistory)")
    print('Found ' + str(len(result)) + ' available appointments')
    return result


class FFSolver:
    def __init__(self, priority):

        self.original_graph = {}
        self.residual_graph = {}
        self.flow_graph = {}
        self.patient_ids = set(())
        self.appointment_ids = set(())
        self.source = -1
        self.sink = -2
        self.residual_capacity = {}
        self.matchings = []  # stores computed result of patient-appointment matchings

        # get all possible patient-appointment matchings so that
        # 1. the appointment time is preferred by the patient and
        # 2. the provider is within max_distance from patient's location and
        # 3. the patient is not yet vaccinated nor scheduled and
        # 4. the appointment has not reached its capacity
        with connection.cursor() as cursor:
            cursor.execute(
                "select reservation_patient.id as patient_id, reservation_appointment.id as appointment_id from reservation_patient join reservation_prioritygroup on reservation_patient.priority_id = reservation_prioritygroup.id join reservation_patientpreferredtime on reservation_patient.id = reservation_patientpreferredtime.patient_id join reservation_appointment on reservation_patientpreferredtime.timeslot = reservation_appointment.timeslot and reservation_patientpreferredtime.day_of_week = DAYNAME(reservation_appointment.date) join reservation_provider on reservation_provider.id = reservation_appointment.provider_id where reservation_prioritygroup.priority = %s and ST_Distance_Sphere(point(patient_long, patient_lat), point(provider_long, provider_lat)) * .000621371192 <= reservation_patient.max_distance and reservation_patient.id not in (select reservation_patient.id from reservation_patient join reservation_offerhistory on reservation_patient.id = reservation_offerhistory.patient_id where (reservation_offerHistory.response_datetime is NULL and reservation_offerhistory.expiration_datetime > NOW()) or status='completed' or status='scheduled') and reservation_appointment.id in (select id from (select reservation_appointment.id, reservation_appointment.capacity from reservation_appointment join reservation_offerhistory on reservation_appointment.id = reservation_offerhistory.appointment_id where reservation_offerhistory.status = 'completed' or reservation_offerhistory.status='scheduled' group by reservation_appointment.id having count(*) < reservation_appointment.capacity union select reservation_appointment.id, reservation_appointment.capacity from reservation_appointment where reservation_appointment.id not in (select reservation_offerhistory.appointment_id from reservation_offerhistory) ) d1)", [priority])
            edges = cursor.fetchall()
            for row in cursor.fetchall():
                print(row)

            # build residual graph
            for e in edges:
                if e[0] not in self.patient_ids:
                    self.patient_ids.add(e[0])
                if e[1] not in self.appointment_ids:
                    self.appointment_ids.add(e[1])
                if e[0] not in self.residual_graph:
                    self.residual_graph[e[0]] = {}
                if e[1] not in self.residual_graph:
                    self.residual_graph[e[1]] = {}
                self.residual_graph[e[0]][e[1]] = 1
                self.residual_graph[e[1]][e[0]] = -1

            # get residual capacities of appointments
            cursor.execute("select id, capacity - count as residual from (select reservation_appointment.id, count(*) as count, reservation_appointment.capacity from reservation_appointment join reservation_offerhistory on reservation_appointment.id = reservation_offerhistory.appointment_id where reservation_offerhistory.status = 'completed' or reservation_offerhistory.status='scheduled' group by reservation_appointment.id having count(*) < reservation_appointment.capacity union select reservation_appointment.id, 0, reservation_appointment.capacity from reservation_appointment where reservation_appointment.id not in (select reservation_offerhistory.appointment_id from reservation_offerhistory)) d1")
            self.residual_capacity = {row[0]: row[1] for row in cursor.fetchall()}
            self.residual_graph[self.source] = {}
            self.residual_graph[self.sink] = {}
            for i in self.patient_ids:
                self.residual_graph[self.source][i] = 1
                self.residual_graph[i][self.source] = -1
            for i in self.appointment_ids:
                self.residual_graph[i][self.sink] = self.residual_capacity[i]
                self.residual_graph[self.sink][i] = -self.residual_capacity[i]
            self.original_graph = copy.deepcopy(self.residual_graph)

    # Returns true if there is a path from source 's' to sink 't' in residual graph. Also fills parent{} to store the path.
    def bfs(self, s, t, parent):
        visited = set(())
        queue = collections.deque()
        queue.append(s)
        visited.add(s)

        while queue:
            u = queue.popleft()
            for v in self.residual_graph[u]:
                if (v not in visited) and (self.residual_graph[u][v] > 0):
                    queue.append(v)
                    visited.add(v)
                    parent[v] = u

        # If we reached sink in BFS starting from source, then return
        # true, else false
        return t in visited

    def edmonds_karp(self):
        source = self.source
        sink = self.sink
        # This dict is filled by BFS and to store path
        parent = {}

        max_flow = 0  # There is no flow initially

        # Augment the flow while there is path from source to sink
        while self.bfs(source, sink, parent):

            # Find minimum residual capacity of the edges along the
            # path filled by BFS. Or we can say find the maximum flow
            # through the path found.
            path_flow = float("Inf")
            s = sink
            while s != source:
                path_flow = min(path_flow, self.residual_graph[parent[s]][s])
                s = parent[s]

            # Add path flow to overall flow
            max_flow += path_flow

            # update residual capacities of the edges and reverse edges
            # along the path
            v = sink
            while v != source:
                u = parent[v]
                self.residual_graph[u][v] -= path_flow
                self.residual_graph[v][u] += path_flow
                v = parent[v]

        self.flow_graph = copy.deepcopy(self.original_graph)
        for key in self.residual_graph:
            for val in self.residual_graph[key]:
                self.flow_graph[key][val] = self.original_graph[key][val] - \
                    self.residual_graph[key][val]

                # put the results in self.matchings
                if key in self.patient_ids and val in self.appointment_ids and self.flow_graph[key][val] > 0:
                    self.matchings.append((key, val))
                # print('(' + str(key) + ', ' + str(val) + ') : ' +
                #       str(self.flow_graph[key][val]))

        return max_flow

    def send_offers(self):
        for pair in self.matchings:
            patient = Patient.objects.get(id=pair[0])
            appointment = Appointment.objects.get(id=pair[1])
            offer = OfferHistory(patient=patient, appointment=appointment, sent_datetime=datetime.now(
                timezone.utc), expiration_datetime=datetime.now(timezone.utc) + timedelta(days=2))
            offer.save()


def match():
    priorities = PriorityGroup.objects.order_by('priority')
    for i in priorities:
        if date.today() < i.earliest_date:
            continue
        print('matching patients of priority ' + str(i.priority))
        solver = FFSolver(priority=i.priority)
        max_flow = solver.edmonds_karp()
        print('number of patients: ' + str(len(solver.patient_ids)))
        print('max flow is ' + str(max_flow))
        solver.send_offers()
