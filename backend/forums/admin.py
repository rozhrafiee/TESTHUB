from django.contrib import admin
from .models import ForumMessage

@admin.register(ForumMessage)
class ForumMessageAdmin(admin.ModelAdmin):
    list_display = ['sender', 'message', 'created_at']
    list_filter = ['created_at']
    search_fields = ['message', 'sender__username']

