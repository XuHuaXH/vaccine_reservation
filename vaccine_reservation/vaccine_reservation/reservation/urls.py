from django.urls import path, include
from reservation import views

urlpatterns = [
    path('register-patient/', views.register_patient),
    path('register-provider/', views.register_provider),
    path('login/', views.login),
    path('get-availability/', views.get_availability),
    path('add-availability/', views.add_availability),
    path('delete-availability/', views.delete_availability),
    # path('current-offers/', views.current_offers),
    # path('past-offers/', views.past_offers),
    # path('scheduled-offers/', views.scheduled_offers),
    path('get-appointments/', views.get_appointments),
    path('add-appointment/', views.add_appointment),
]
