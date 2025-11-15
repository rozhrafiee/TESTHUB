from django.urls import path
from . import views

urlpatterns = [
    path('consultants/', views.list_consultants, name='list_consultants'),
    path('select/', views.select_consultant, name='select_consultant'),
    path('my-consultations/', views.my_consultations, name='my_consultations'),
    path('<int:consultation_id>/schedules/', views.schedules, name='schedules'),
    path('<int:consultation_id>/messages/', views.chat_messages, name='chat_messages'),
    path('<int:consultation_id>/end/', views.end_consultation, name='end_consultation'),
]

