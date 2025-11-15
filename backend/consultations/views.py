from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework import status
from .models import Consultation, WeeklySchedule, ChatMessage
from .serializers import ConsultationSerializer, WeeklyScheduleSerializer, ChatMessageSerializer
from accounts.permissions import IsStudent, IsConsultant, IsStudentOrAdmin
from accounts.models import User

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def list_consultants(request):
    """List all available consultants"""
    consultants = User.objects.filter(user_type='consultant')
    from accounts.serializers import UserSerializer
    serializer = UserSerializer(consultants, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsStudent])
def select_consultant(request):
    """Student selects a consultant"""
    consultant_id = request.data.get('consultant_id')
    if not consultant_id:
        return Response({'error': 'consultant_id is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        consultant = User.objects.get(id=consultant_id, user_type='consultant')
    except User.DoesNotExist:
        return Response({'error': 'Consultant not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Create or get consultation
    consultation, created = Consultation.objects.get_or_create(
        student=request.user,
        consultant=consultant,
        defaults={'active': True}
    )
    
    if not created:
        consultation.active = True
        consultation.save()
    
    serializer = ConsultationSerializer(consultation)
    return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def my_consultations(request):
    """Get consultations for current user (as student or consultant)"""
    if request.user.is_student():
        consultations = Consultation.objects.filter(student=request.user, active=True)
    elif request.user.is_consultant():
        consultations = Consultation.objects.filter(consultant=request.user, active=True)
    else:
        return Response({'error': 'Only students and consultants can access consultations'}, 
                       status=status.HTTP_403_FORBIDDEN)
    
    serializer = ConsultationSerializer(consultations, many=True)
    return Response(serializer.data)

@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def schedules(request, consultation_id):
    """Get or create weekly schedules for a consultation"""
    try:
        consultation = Consultation.objects.get(pk=consultation_id)
        # Check if user is part of this consultation
        if request.user != consultation.student and request.user != consultation.consultant:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
    except Consultation.DoesNotExist:
        return Response({'error': 'Consultation not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        schedules = WeeklySchedule.objects.filter(consultation=consultation)
        serializer = WeeklyScheduleSerializer(schedules, many=True)
        return Response(serializer.data)
    
    # POST - Create schedule (only consultant can create)
    if not request.user.is_consultant() or request.user != consultation.consultant:
        return Response({'error': 'Only the consultant can create schedules'}, status=status.HTTP_403_FORBIDDEN)
    
    serializer = WeeklyScheduleSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(consultation=consultation)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def chat_messages(request, consultation_id):
    """Get or send chat messages in consultation"""
    try:
        consultation = Consultation.objects.get(pk=consultation_id)
        # Check if user is part of this consultation
        if request.user != consultation.student and request.user != consultation.consultant:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
    except Consultation.DoesNotExist:
        return Response({'error': 'Consultation not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        messages = ChatMessage.objects.filter(consultation=consultation)
        # Mark messages as read if viewing
        ChatMessage.objects.filter(
            consultation=consultation
        ).exclude(
            sender=request.user
        ).filter(
            read=False
        ).update(read=True)
        
        serializer = ChatMessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    # POST - Send message
    serializer = ChatMessageSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(consultation=consultation, sender=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsStudent])
def end_consultation(request, consultation_id):
    """Student ends consultation"""
    try:
        consultation = Consultation.objects.get(pk=consultation_id, student=request.user)
        consultation.active = False
        consultation.save()
        return Response({'message': 'Consultation ended successfully'}, status=status.HTTP_200_OK)
    except Consultation.DoesNotExist:
        return Response({'error': 'Consultation not found'}, status=status.HTTP_404_NOT_FOUND)
