from rest_framework import serializers
from .models import Video

class VideoSerializer(serializers.ModelSerializer):
    uploader = serializers.ReadOnlyField(source='uploader.username')

    class Meta:
        model = Video
        fields = ['id', 'title', 'description', 'file', 'thumbnail', 'uploader', 'approved', 'created_at']
        read_only_fields = ['approved']  # Only admin can change approval status
