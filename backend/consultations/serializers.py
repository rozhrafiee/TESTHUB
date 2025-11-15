from rest_framework import serializers
from .models import Consultation, WeeklySchedule, ChatMessage
from accounts.serializers import UserSerializer

class ConsultationSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    consultant = UserSerializer(read_only=True)
    student_id = serializers.IntegerField(write_only=True, required=False)
    consultant_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = Consultation
        fields = ['id', 'student', 'consultant', 'student_id', 'consultant_id', 'created_at', 'active']
        read_only_fields = ['student', 'consultant', 'created_at']

class WeeklyScheduleSerializer(serializers.ModelSerializer):
    consultation_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = WeeklySchedule
        fields = ['id', 'consultation', 'consultation_id', 'day', 'time', 'activity', 'week_start_date', 'created_at']
        read_only_fields = ['consultation', 'created_at']

class ChatMessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    sender_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = ChatMessage
        fields = ['id', 'consultation', 'sender', 'sender_id', 'message', 'created_at', 'read']
        read_only_fields = ['sender', 'created_at']

