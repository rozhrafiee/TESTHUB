from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User, StudentProfile, TeacherProfile, ConsultantProfile

class CustomUserCreationForm(UserCreationForm):
    USER_TYPE_CHOICES = (
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('consultant', 'Consultant'),
    )
    
    user_type = forms.ChoiceField(choices=USER_TYPE_CHOICES)
    phone = forms.CharField(max_length=15, required=False)
    birth_date = forms.DateField(required=False, widget=forms.DateInput(attrs={'type': 'date'}))
    
    class Meta:
        model = User
        fields = ('username', 'email', 'user_type', 'phone', 'birth_date', 'password1', 'password2')

class StudentProfileForm(forms.ModelForm):
    class Meta:
        model = StudentProfile
        fields = ('field_of_study', 'educational_level')

class TeacherProfileForm(forms.ModelForm):
    class Meta:
        model = TeacherProfile
        fields = ('expertise', 'bio')

class ConsultantProfileForm(forms.ModelForm):
    class Meta:
        model = ConsultantProfile
        fields = ('specialization', 'experience')