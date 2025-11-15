from django.contrib import admin
from .models import Consultation, WeeklySchedule, ChatMessage

@admin.register(Consultation)
class ConsultationAdmin(admin.ModelAdmin):
    list_display = ['student', 'consultant', 'active', 'created_at']
    list_filter = ['active', 'created_at']
    search_fields = ['student__username', 'consultant__username']

@admin.register(WeeklySchedule)
class WeeklyScheduleAdmin(admin.ModelAdmin):
    list_display = ['consultation', 'day', 'time', 'activity', 'week_start_date']
    list_filter = ['day', 'week_start_date']
    search_fields = ['activity', 'consultation__student__username']

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ['consultation', 'sender', 'message', 'read', 'created_at']
    list_filter = ['read', 'created_at']
    search_fields = ['message', 'sender__username']
