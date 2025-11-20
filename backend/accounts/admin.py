from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, StudentProfile, TeacherProfile, ConsultantProfile


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'user_type', 'is_staff', 'is_superuser')
    list_filter = ('user_type', 'is_staff', 'is_superuser', 'is_active')
    fieldsets = BaseUserAdmin.fieldsets + (
        ('اطلاعات کاربری', {'fields': ('user_type', 'phone', 'birth_date')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('اطلاعات کاربری', {'fields': ('user_type', 'phone', 'birth_date')}),
    )
    search_fields = ('username', 'email', 'phone')


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'field_of_study', 'educational_level')
    search_fields = ('user__username', 'field_of_study', 'educational_level')


@admin.register(TeacherProfile)
class TeacherProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'expertise')
    search_fields = ('user__username', 'expertise')


@admin.register(ConsultantProfile)
class ConsultantProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'specialization', 'experience')
    search_fields = ('user__username', 'specialization')
