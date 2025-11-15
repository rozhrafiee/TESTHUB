from django.db import models

class Field(models.Model):
    """Field of study information"""
    FIELD_CHOICES = [
        ('computer_engineering', 'Computer Engineering'),
        ('computer_science', 'Computer Science'),
        ('electrical_engineering', 'Electrical Engineering'),
        ('it', 'Information Technology'),
    ]
    
    name = models.CharField(max_length=50, choices=FIELD_CHOICES, unique=True)
    title = models.CharField(max_length=200)
    description = models.TextField(help_text="General description of the field")
    exam_info = models.TextField(help_text="Information about the entrance exam")
    subjects = models.TextField(help_text="Main subjects covered in the exam")
    career_opportunities = models.TextField(blank=True, help_text="Career opportunities after graduation")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
