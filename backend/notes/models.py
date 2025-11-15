from django.db import models
from django.conf import settings

class Note(models.Model):
    """PDF notes shared by students and teachers"""
    uploader = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notes')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to='notes/')
    field = models.CharField(max_length=100, blank=True, help_text="Field of study (optional)")
    approved = models.BooleanField(default=False, help_text="Admin must approve before note appears")
    is_paid = models.BooleanField(default=False, help_text="Is this a paid note? (Teachers only)")
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, help_text="Price in currency units")
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} by {self.uploader.username}"

class NotePurchase(models.Model):
    """Record of student purchasing a paid note"""
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='purchased_notes')
    note = models.ForeignKey(Note, on_delete=models.CASCADE, related_name='purchases')
    purchased_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['student', 'note']
        ordering = ['-purchased_at']
    
    def __str__(self):
        return f"{self.student.username} purchased {self.note.title}"
