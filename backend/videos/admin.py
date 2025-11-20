from django.contrib import admin
from .models import Video


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ('title', 'uploader', 'approved', 'created_at')
    list_filter = ('approved', 'created_at')
    search_fields = ('title', 'description', 'uploader__username')
    list_editable = ('approved',)
    readonly_fields = ('created_at',)
    actions = ['approve_selected']

    @admin.action(description="تأیید ویدیوهای انتخاب‌شده")
    def approve_selected(self, request, queryset):
        updated = queryset.update(approved=True)
        self.message_user(request, f"{updated} ویدیو تأیید شد.")
