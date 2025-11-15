from django.db import models
from django.conf import settings

class Exam(models.Model):
    """Exam model for practice tests"""
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    field = models.CharField(max_length=100, help_text="Field of study (e.g., Computer Engineering)")
    duration_minutes = models.IntegerField(help_text="Exam duration in minutes")
    required_level = models.IntegerField(default=1, help_text="Minimum user level required to take this exam")
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} - {self.field}"

class Question(models.Model):
    """Multiple choice question (4 options)"""
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    option_a = models.CharField(max_length=500)
    option_b = models.CharField(max_length=500)
    option_c = models.CharField(max_length=500)
    option_d = models.CharField(max_length=500)
    correct_answer = models.CharField(max_length=1, choices=[('A', 'A'), ('B', 'B'), ('C', 'C'), ('D', 'D')])
    points = models.IntegerField(default=1)
    order = models.IntegerField(default=0, help_text="Order of question in exam")
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"Q{self.order + 1}: {self.text[:50]}..."

class ExamAttempt(models.Model):
    """Student's attempt at an exam"""
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='exam_attempts')
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='attempts')
    started_at = models.DateTimeField(auto_now_add=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    score = models.FloatField(null=True, blank=True, help_text="Final score percentage")
    completed = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-started_at']
    
    def __str__(self):
        return f"{self.student.username} - {self.exam.title}"

class Answer(models.Model):
    """Student's answer to a question"""
    attempt = models.ForeignKey(ExamAttempt, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_answer = models.CharField(max_length=1, choices=[('A', 'A'), ('B', 'B'), ('C', 'C'), ('D', 'D')], null=True, blank=True)
    is_correct = models.BooleanField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.attempt.student.username} - Q{self.question.order + 1}"
