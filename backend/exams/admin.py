from django.contrib import admin
from .models import Exam, Question, ExamAttempt, Answer

@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = ['title', 'field', 'required_level', 'duration_minutes', 'created_at']
    list_filter = ['field', 'required_level']
    search_fields = ['title', 'description']

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['exam', 'order', 'text', 'correct_answer', 'points']
    list_filter = ['exam', 'correct_answer']
    search_fields = ['text']

@admin.register(ExamAttempt)
class ExamAttemptAdmin(admin.ModelAdmin):
    list_display = ['student', 'exam', 'score', 'completed', 'started_at', 'submitted_at']
    list_filter = ['completed', 'exam', 'started_at']
    search_fields = ['student__username', 'exam__title']

@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ['attempt', 'question', 'selected_answer', 'is_correct']
    list_filter = ['is_correct', 'question__exam']
