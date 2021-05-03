from django.urls import path, include
from reservation import views

urlpatterns = [
    path('register-patient/', views.register_patient),
    path('register-provider/', views.register_provider),
    path('login/', views.login),
    path('get-availability/', views.get_availability),
    path('add-availability/', views.add_availability),
    path('delete-availability/', views.delete_availability),
    path('get-appointments/', views.get_appointments),
    path('add-appointment/', views.add_appointment),
    path('provider-scheduled-appointments/', views.provider_scheduled_appointments),
    path('provider-cancelled-appointments/', views.provider_cancelled_appointments),
    path('provider-missed-appointments/', views.provider_missed_appointments),
    path('provider-completed-appointments/', views.provider_completed_appointments),
    path('patient-current-offers/', views.patient_current_offers),
    path('patient-past-offers/', views.patient_past_offers),
    path('patient-scheduled-appointments/', views.patient_scheduled_appointments),
    path('offer-detail/', views.offer_detail),
    path('cancel-appointment/', views.cancel_appointment),
    path('offer-response/', views.offer_response),
    path('provider-get-summary/', views.provider_get_summary),
]
