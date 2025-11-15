from rest_framework import serializers
from .models import Exam, Question, ExamAttempt, Answer

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'text', 'option_a', 'option_b', 'option_c', 'option_d', 'points', 'order']
        read_only_fields = ['id', 'points', 'order']

class QuestionWithAnswerSerializer(serializers.ModelSerializer):
    """Serializer for questions with correct answer (for results)"""
    class Meta:
        model = Question
        fields = ['id', 'text', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer', 'points', 'order']

class ExamSerializer(serializers.ModelSerializer):
    question_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Exam
        fields = ['id', 'title', 'description', 'field', 'duration_minutes', 'required_level', 'question_count', 'created_at']
    
    def get_question_count(self, obj):
        return obj.questions.count()

class ExamDetailSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Exam
        fields = ['id', 'title', 'description', 'field', 'duration_minutes', 'required_level', 'questions', 'created_at']

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'question', 'selected_answer']
    
    def create(self, validated_data):
        attempt = validated_data['attempt']
        question = validated_data['question']
        selected_answer = validated_data.get('selected_answer')
        
        # Check if answer is correct
        is_correct = (selected_answer == question.correct_answer) if selected_answer else None
        
        answer, created = Answer.objects.update_or_create(
            attempt=attempt,
            question=question,
            defaults={'selected_answer': selected_answer, 'is_correct': is_correct}
        )
        return answer

class ExamAttemptSerializer(serializers.ModelSerializer):
    exam_title = serializers.ReadOnlyField(source='exam.title')
    student_username = serializers.ReadOnlyField(source='student.username')
    
    class Meta:
        model = ExamAttempt
        fields = ['id', 'exam', 'exam_title', 'student', 'student_username', 'started_at', 'submitted_at', 'score', 'completed']

class ExamAttemptDetailSerializer(serializers.ModelSerializer):
    exam = ExamSerializer(read_only=True)
    answers = AnswerSerializer(many=True, read_only=True)
    
    class Meta:
        model = ExamAttempt
        fields = ['id', 'exam', 'started_at', 'submitted_at', 'score', 'completed', 'answers']

