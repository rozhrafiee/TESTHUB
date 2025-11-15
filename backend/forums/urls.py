from django.urls import path
from . import views

urlpatterns = [
    path('messages/', views.forum_messages, name='forum_messages'),
    path('messages/<int:pk>/delete/', views.delete_message, name='delete_message'),
]

