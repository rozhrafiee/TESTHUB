from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, StudentProfile, TeacherProfile, ConsultantProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'user_type', 'phone', 'birth_date']

class RegisterSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2', 'user_type', 'phone', 'birth_date']

    def validate(self, data):
        if data.get('password1') != data.get('password2'):
            raise serializers.ValidationError({"password2": "Passwords do not match."})
        return data

    def create(self, validated_data):
        validated_data.pop('password2', None)
        password = validated_data.pop('password1')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

# Profile serializers with optional fields (won't force a 400)
class StudentProfileSerializer(serializers.ModelSerializer):
    field_of_study = serializers.CharField(required=False, allow_blank=True)
    educational_level = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = StudentProfile
        fields = ['field_of_study', 'educational_level']

class TeacherProfileSerializer(serializers.ModelSerializer):
    expertise = serializers.CharField(required=False, allow_blank=True)
    bio = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = TeacherProfile
        fields = ['expertise', 'bio']

class ConsultantProfileSerializer(serializers.ModelSerializer):
    specialization = serializers.CharField(required=False, allow_blank=True)
    experience = serializers.IntegerField(required=False)

    class Meta:
        model = ConsultantProfile
        fields = ['specialization', 'experience']
