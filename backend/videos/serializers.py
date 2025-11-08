from rest_framework import serializers
from .models import Video

class VideoSerializer(serializers.ModelSerializer):
    uploader = serializers.ReadOnlyField(source='uploader.username')

    class Meta:
        model = Video
        fields = ['id', 'title', 'description', 'file', 'thumbnail', 'uploader', 'created_at']
