from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.urls import reverse

from accounts.models import User
from .models import Consultation
class ConsultationTests(APITestCase):

    def setUp(self):
        self.student = User.objects.create_user(
            username='student', password='1234', user_type='student'
        )
        self.consultant = User.objects.create_user(
            username='consultant', password='1234', user_type='consultant'
        )

        self.student_token = Token.objects.create(user=self.student)
        self.consultant_token = Token.objects.create(user=self.consultant)

    def auth(self, token):
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token.key}')

    def test_list_consultants(self):
        self.auth(self.student_token)
        response = self.client.get(reverse('list_consultants'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_select_consultant(self):
        self.auth(self.student_token)
        response = self.client.post(
            reverse('select_consultant'),
            {'consultant_id': self.consultant.id}
        )
        self.assertIn(response.status_code, [200, 201])

    def test_my_consultations(self):
        Consultation.objects.create(
            student=self.student,
            consultant=self.consultant,
            active=True
        )
        self.auth(self.student_token)
        response = self.client.get(reverse('my_consultations'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
