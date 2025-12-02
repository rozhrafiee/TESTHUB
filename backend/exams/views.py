from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from .models import Exam, Question, ExamAttempt, Answer
from .serializers import (
    ExamSerializer, ExamDetailSerializer, ExamAttemptSerializer,
    ExamAttemptDetailSerializer, AnswerSerializer, QuestionWithAnswerSerializer
)
from accounts.permissions import IsStudent, IsAdmin, IsStudentOrAdmin, IsTeacher

def get_student_level(user):
    """Calculate student level based on exam attempts and scores"""
    if not user.is_student():
        return 0
    
    attempts = ExamAttempt.objects.filter(student=user, completed=True)
    if not attempts.exists():
        return 1
    
    # Level up based on completed exams and average score
    completed_count = attempts.count()
    avg_score = sum(a.score for a in attempts if a.score) / completed_count if completed_count > 0 else 0
    
    # Level calculation: base level + bonus from performance
    base_level = min(completed_count // 3 + 1, 10)  # Max level 10
    bonus = int(avg_score // 20)  # Bonus level from high scores
    
    return min(base_level + bonus, 10)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsTeacher])
def create_exam(request):
    """Create a new exam with questions"""
    serializer = ExamDetailSerializer(data=request.data)
    if serializer.is_valid():
        exam = serializer.save()
        return Response(ExamDetailSerializer(exam).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def list_exams(request):
    """List all available exams"""
    exams = Exam.objects.all().order_by('-created_at')
    serializer = ExamSerializer(exams, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def exam_detail(request, pk):
    """Get exam details with questions (for taking exam)"""
    try:
        exam = Exam.objects.get(pk=pk)
    except Exam.DoesNotExist:
        return Response({'error': 'Exam not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Check if user has required level
    if request.user.is_authenticated:
        user_level = get_student_level(request.user)
        if user_level < exam.required_level:
            return Response({
                'error': f'You need level {exam.required_level} to take this exam. Your current level is {user_level}.'
            }, status=status.HTTP_403_FORBIDDEN)
    
    serializer = ExamDetailSerializer(exam)
    return Response(serializer.data)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsStudent])
def start_exam(request, pk):
    """Start a new exam attempt"""
    try:
        exam = Exam.objects.get(pk=pk)
    except Exam.DoesNotExist:
        return Response({'error': 'Exam not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Check level requirement
    user_level = get_student_level(request.user)
    if user_level < exam.required_level:
        return Response({
            'error': f'You need level {exam.required_level} to take this exam. Your current level is {user_level}.'
        }, status=status.HTTP_403_FORBIDDEN)
    
    # Check if there's an incomplete attempt
    incomplete_attempt = ExamAttempt.objects.filter(
        student=request.user,
        exam=exam,
        completed=False
    ).first()
    
    if incomplete_attempt:
        serializer = ExamAttemptDetailSerializer(incomplete_attempt)
        return Response(serializer.data)
    
    # Create new attempt
    attempt = ExamAttempt.objects.create(student=request.user, exam=exam)
    serializer = ExamAttemptDetailSerializer(attempt)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsStudent])
def submit_answer(request, attempt_id):
    """Submit an answer for a question"""
    try:
        attempt = ExamAttempt.objects.get(pk=attempt_id, student=request.user, completed=False)
    except ExamAttempt.DoesNotExist:
        return Response({'error': 'Exam attempt not found or already completed'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = AnswerSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(attempt=attempt)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsStudent])
def submit_exam(request, attempt_id):
    """Submit completed exam and calculate score"""
    try:
        attempt = ExamAttempt.objects.get(pk=attempt_id, student=request.user, completed=False)
    except ExamAttempt.DoesNotExist:
        return Response({'error': 'Exam attempt not found or already completed'}, status=status.HTTP_404_NOT_FOUND)
    
    # Calculate score
    answers = Answer.objects.filter(attempt=attempt)
    total_points = 0
    earned_points = 0
    
    for answer in answers:
        question = answer.question
        total_points += question.points
        if answer.is_correct:
            earned_points += question.points
    
    score = (earned_points / total_points * 100) if total_points > 0 else 0
    
    # Update attempt
    attempt.score = score
    attempt.completed = True
    attempt.submitted_at = timezone.now()
    attempt.save()
    
    serializer = ExamAttemptDetailSerializer(attempt)
    return Response({
        'message': 'Exam submitted successfully',
        'score': score,
        'attempt': serializer.data
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsStudent])
def my_attempts(request):
    """Get all exam attempts by the current student"""
    attempts = ExamAttempt.objects.filter(student=request.user).order_by('-started_at')
    serializer = ExamAttemptSerializer(attempts, many=True)
    
    # Include user level
    user_level = get_student_level(request.user)
    return Response({
        'level': user_level,
        'attempts': serializer.data
    })

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsStudent])
def attempt_detail(request, attempt_id):
    """Get detailed results of an exam attempt"""
    try:
        attempt = ExamAttempt.objects.get(pk=attempt_id, student=request.user)
    except ExamAttempt.DoesNotExist:
        return Response({'error': 'Exam attempt not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = ExamAttemptDetailSerializer(attempt)
    
    # Include correct answers for review
    questions = Question.objects.filter(exam=attempt.exam)
    questions_data = QuestionWithAnswerSerializer(questions, many=True).data
    
    return Response({
        'attempt': serializer.data,
        'questions_with_answers': questions_data
    })

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsStudent])
def my_level(request):
    """Get current student level"""
    level = get_student_level(request.user)
    return Response({'level': level})
