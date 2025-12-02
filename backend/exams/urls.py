from django.urls import path
from . import views

urlpatterns = [
    path('', views.list_exams, name='list_exams'),
    path('create/', views.create_exam, name='create_exam'),
    path('<int:pk>/', views.exam_detail, name='exam_detail'),
    path('<int:pk>/start/', views.start_exam, name='start_exam'),
    path('attempts/<int:attempt_id>/answer/', views.submit_answer, name='submit_answer'),
    path('attempts/<int:attempt_id>/submit/', views.submit_exam, name='submit_exam'),
    path('my-attempts/', views.my_attempts, name='my_attempts'),
    path('my-level/', views.my_level, name='my_level'),
    path('attempts/<int:attempt_id>/', views.attempt_detail, name='attempt_detail'),
]
