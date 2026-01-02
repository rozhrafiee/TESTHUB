from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
class VideoTests(APITestCase):

    def test_list_videos(self):
        response = self.client.get(reverse('list_videos'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
