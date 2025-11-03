from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    USER_TYPES = (
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('consultant', 'Consultant'),
        ('admin', 'Admin'),
    )
    user_type = models.CharField(max_length=20, choices=USER_TYPES, default='student')
    phone = models.CharField(max_length=15, blank=True)
    birth_date = models.DateField(null=True, blank=True)

    def is_student(self):
        return self.user_type == 'student'

    def is_teacher(self):
        return self.user_type == 'teacher'

    def is_consultant(self):
        return self.user_type == 'consultant'

    def is_admin(self):
        return self.user_type == 'admin'


class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    field_of_study = models.CharField(max_length=100)
    educational_level = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.user.username} - Student"


class TeacherProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    expertise = models.CharField(max_length=200)
    bio = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.username} - Teacher"


class ConsultantProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    specialization = models.CharField(max_length=200)
    experience = models.IntegerField(help_text="Years of experience")

    def __str__(self):
        return f"{self.user.username} - Consultant"
