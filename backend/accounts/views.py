from django.db import transaction
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate

from .serializers import (
    RegisterSerializer,
    UserSerializer,
    StudentProfileSerializer,
    TeacherProfileSerializer,
    ConsultantProfileSerializer
)
from .models import StudentProfile, TeacherProfile, ConsultantProfile


@api_view(['POST'])
@transaction.atomic
def register(request):
    """
    Expected payload (example):
    {
      "username": "alice",
      "email": "a@example.com",
      "password1": "Secret123!",
      "password2": "Secret123!",
      "user_type": "student",
      "phone": "0912...",
      "birth_date": "2000-01-01",
      // profile fields (optional or required depending on your choice)
      "field_of_study": "Computer Engineering",
      "educational_level": "BSc"
    }
    """
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()

    profile_serializer_class = {
        'student': StudentProfileSerializer,
        'teacher': TeacherProfileSerializer,
        'consultant': ConsultantProfileSerializer
    }.get(user.user_type)

    profile_data = {}
    if profile_serializer_class:
        # Always create profile, even with empty values
        prof_serializer = profile_serializer_class(data=request.data)
        if prof_serializer.is_valid():
            try:
                profile = prof_serializer.save(user=user)
                profile_data = profile_serializer_class(profile).data
            except Exception as e:
                # If profile already exists, get it
                profile_instance = getattr(user, f"{user.user_type}profile", None)
                if profile_instance:
                    profile_data = profile_serializer_class(profile_instance).data
                # If profile creation fails for other reasons, user is still created
                # Profile can be created/updated later via profile endpoint
                import traceback
                print(f"Profile creation error: {e}")
                print(traceback.format_exc())

    token, _ = Token.objects.get_or_create(user=user)

    return Response({
        "user": UserSerializer(user).data,
        "profile": profile_data,
        "token": token.key
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({"detail": "username and password required"}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        })
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@transaction.atomic
def profile(request):
    user = request.user
    profile_serializer_class = {
        'student': StudentProfileSerializer,
        'teacher': TeacherProfileSerializer,
        'consultant': ConsultantProfileSerializer
    }.get(user.user_type)

    if request.method == 'GET':
        profile_data = {}
        if profile_serializer_class:
            profile_instance = getattr(user, f"{user.user_type}profile", None)
            if profile_instance:
                profile_data = profile_serializer_class(profile_instance).data
        return Response({'user': UserSerializer(user).data, 'profile': profile_data})

    # PUT - update User and profile
    user_serializer = UserSerializer(user, data=request.data, partial=True)
    user_serializer.is_valid(raise_exception=True)
    user_serializer.save()

    profile_data = {}
    if profile_serializer_class:
        profile_instance = getattr(user, f"{user.user_type}profile", None)
        if profile_instance:
            profile_serializer = profile_serializer_class(profile_instance, data=request.data, partial=True)
            profile_serializer.is_valid(raise_exception=True)
            profile_serializer.save()
            profile_data = profile_serializer.data

    return Response({'user': user_serializer.data, 'profile': profile_data})
