from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.urls import reverse

from accounts.models import User
from .models import Exam

class ExamTests(APITestCase):

    def setUp(self):
        self.student = User.objects.create_user(
            username='student', password='1234', user_type='student'
        )

        self.student_token = Token.objects.create(user=self.student)

        self.exam = Exam.objects.create(
            title='Test Exam',
            required_level=1,
            duration_minutes=30,   # ✅ فیلد اجباری
        )

    def auth(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Token {self.student_token.key}'
        )

    def test_list_exams(self):
        response = self.client.get(reverse('list_exams'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_exam_detail(self):
        response = self.client.get(
            reverse('exam_detail', args=[self.exam.id])
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_start_exam(self):
        self.auth()
        response = self.client.post(
            reverse('start_exam', args=[self.exam.id])
        )
        self.assertIn(response.status_code, [200, 201])
