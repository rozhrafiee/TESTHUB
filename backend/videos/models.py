from django.db import models
from django.conf import settings

class Video(models.Model):
    """
    Video model:
    - Stores file path in DB (PostgreSQL), actual video on disk.
    - uploader: links to user who uploaded the video.
    - title, description: metadata for display.
    - file: uploaded video file (MP4 recommended).
    - thumbnail: optional image preview.
    """
    uploader = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='videos')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to='videos/')  # actual video stored on disk
    thumbnail = models.ImageField(upload_to='thumbnails/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} by {self.uploader.username}"
