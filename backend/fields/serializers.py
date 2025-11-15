from rest_framework import serializers
from .models import Field

class FieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = Field
        fields = ['id', 'name', 'title', 'description', 'exam_info', 'subjects', 'career_opportunities', 'created_at', 'updated_at']

