from django.urls import path
from . import views

urlpatterns = [
    path('', views.list_notes, name='list_notes'),
    path('upload/', views.upload_note, name='upload_note'),
    path('<int:pk>/', views.note_detail, name='note_detail'),
    path('<int:pk>/purchase/', views.purchase_note, name='purchase_note'),
    path('<int:pk>/approve/', views.approve_note, name='approve_note'),
    path('my-notes/', views.my_notes, name='my_notes'),
    path('my-purchases/', views.my_purchases, name='my_purchases'),
]

