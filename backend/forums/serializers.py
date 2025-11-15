from rest_framework import serializers
from .models import ForumMessage
from accounts.serializers import UserSerializer

class ForumMessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    
    class Meta:
        model = ForumMessage
        fields = ['id', 'sender', 'message', 'created_at']
        read_only_fields = ['sender', 'created_at']

