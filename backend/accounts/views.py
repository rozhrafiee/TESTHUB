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
def register(request):
    # Step 1: Receive JSON from request
    serializer = RegisterSerializer(data=request.data)
    
    # Step 2: Validate user fields
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Step 3: Save the user (password is set correctly in serializer)
    user = serializer.save()
    
    # Step 4: Prepare profile data container
    profile_data = {}
    
    # Step 5: Create profile based on user_type
    if user.user_type == 'student':
        prof_serializer = StudentProfileSerializer(data=request.data)
        if prof_serializer.is_valid():
            profile = prof_serializer.save(user=user)
            profile_data = StudentProfileSerializer(profile).data

    elif user.user_type == 'teacher':
        prof_serializer = TeacherProfileSerializer(data=request.data)
        if prof_serializer.is_valid():
            profile = prof_serializer.save(user=user)
            profile_data = TeacherProfileSerializer(profile).data

    elif user.user_type == 'consultant':
        prof_serializer = ConsultantProfileSerializer(data=request.data)
        if prof_serializer.is_valid():
            profile = prof_serializer.save(user=user)
            profile_data = ConsultantProfileSerializer(profile).data

    # Step 6: Generate token
    token, _ = Token.objects.get_or_create(user=user)

    # Step 7: Return final response
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
            'user_id': user.id,
            'username': user.username
        })
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    if request.method == 'GET':
        profile_data = {}
        if hasattr(user, 'studentprofile'):
            profile_data = StudentProfileSerializer(user.studentprofile).data
        elif hasattr(user, 'teacherprofile'):
            profile_data = TeacherProfileSerializer(user.teacherprofile).data
        elif hasattr(user, 'consultantprofile'):
            profile_data = ConsultantProfileSerializer(user.consultantprofile).data
        return Response({'user': UserSerializer(user).data, 'profile': profile_data})

    # PUT - update basic user fields only (extend as needed)
    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
