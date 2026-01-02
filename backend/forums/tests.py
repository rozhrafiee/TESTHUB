from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.urls import reverse

from accounts.models import User

class ForumTests(APITestCase):

    def setUp(self):
        self.student = User.objects.create_user(
            username='student', password='1234', user_type='student'
        )
        self.token = Token.objects.create(user=self.student)

    def auth(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Token {self.token.key}'
        )

    def test_get_messages(self):
        self.auth()
        response = self.client.get(reverse('forum_messages'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_post_message(self):
        self.auth()
        response = self.client.post(
            reverse('forum_messages'),
            {
                'message': 'پیام تست',  # ✅ فیلد صحیح
            }
        )

        # اگر خواستی همیشه خطاها را ببینی
        if response.status_code != status.HTTP_201_CREATED:
            print(response.data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
