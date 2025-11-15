from rest_framework import serializers
from .models import Note, NotePurchase

class NoteSerializer(serializers.ModelSerializer):
    uploader = serializers.ReadOnlyField(source='uploader.username')
    is_purchased = serializers.SerializerMethodField()
    
    class Meta:
        model = Note
        fields = ['id', 'title', 'description', 'file', 'field', 'uploader', 'approved', 'is_paid', 'price', 'is_purchased', 'created_at']
        read_only_fields = ['approved', 'is_purchased']
    
    def get_is_purchased(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated and obj.is_paid:
            return NotePurchase.objects.filter(student=request.user, note=obj).exists()
        return False

class NotePurchaseSerializer(serializers.ModelSerializer):
    note_title = serializers.ReadOnlyField(source='note.title')
    student_username = serializers.ReadOnlyField(source='student.username')
    
    class Meta:
        model = NotePurchase
        fields = ['id', 'student', 'note', 'note_title', 'student_username', 'purchased_at']

