from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.urls import reverse

from accounts.models import User
class NoteTests(APITestCase):

    def setUp(self):
        self.student = User.objects.create_user(
            username='student', password='1234', user_type='student'
        )
        self.token = Token.objects.create(user=self.student)

    def auth(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Token {self.token.key}'
        )

    def test_list_notes(self):
        response = self.client.get(reverse('list_notes'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_my_notes(self):
        self.auth()
        response = self.client.get(reverse('my_notes'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
