from django.contrib import admin
from .models import Note, NotePurchase

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ['title', 'uploader', 'field', 'is_paid', 'price', 'approved', 'created_at']
    list_filter = ['approved', 'is_paid', 'field', 'created_at']
    search_fields = ['title', 'description', 'uploader__username']
    list_editable = ['approved']

@admin.register(NotePurchase)
class NotePurchaseAdmin(admin.ModelAdmin):
    list_display = ['student', 'note', 'purchased_at']
    list_filter = ['purchased_at']
    search_fields = ['student__username', 'note__title']
