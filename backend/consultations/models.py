from django.db import models
from django.conf import settings

class Consultation(models.Model):
    """Consultation relationship between student and consultant"""
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='consultations_as_student')
    consultant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='consultations_as_consultant')
    created_at = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ['student', 'consultant']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.student.username} - {self.consultant.username}"

class WeeklySchedule(models.Model):
    """Weekly schedule provided by consultant to student"""
    DAYS_OF_WEEK = [
        ('monday', 'Monday'),
        ('tuesday', 'Tuesday'),
        ('wednesday', 'Wednesday'),
        ('thursday', 'Thursday'),
        ('friday', 'Friday'),
        ('saturday', 'Saturday'),
        ('sunday', 'Sunday'),
    ]
    
    consultation = models.ForeignKey(Consultation, on_delete=models.CASCADE, related_name='schedules')
    day = models.CharField(max_length=10, choices=DAYS_OF_WEEK)
    time = models.TimeField()
    activity = models.TextField(help_text="Activity or task description")
    week_start_date = models.DateField(help_text="Start date of the week this schedule belongs to")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['week_start_date', 'day', 'time']
    
    def __str__(self):
        return f"{self.consultation.student.username} - {self.day} {self.time}"

class ChatMessage(models.Model):
    """Chat messages between student and consultant"""
    consultation = models.ForeignKey(Consultation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.sender.username}: {self.message[:50]}..."
