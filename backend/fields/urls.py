from django.urls import path
from . import views

urlpatterns = [
    path('', views.list_fields, name='list_fields'),
    path('<int:pk>/', views.field_detail, name='field_detail'),
    path('name/<str:name>/', views.field_by_name, name='field_by_name'),
    path('create/', views.create_or_update_field, name='create_field'),
    path('<int:pk>/update/', views.create_or_update_field, name='update_field'),
]

