from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='accounts-register'),
    path('login/', views.login_view, name='accounts-login'),
    path('profile/', views.profile, name='accounts-profile'),
]
