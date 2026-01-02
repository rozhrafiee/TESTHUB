from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse

from .models import Field
class FieldTests(APITestCase):

    def setUp(self):
        self.field = Field.objects.create(name='Computer Science')

    def test_list_fields(self):
        response = self.client.get(reverse('list_fields'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_field_detail(self):
        response = self.client.get(
            reverse('field_detail', args=[self.field.id])
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_field_by_name(self):
        response = self.client.get(
            reverse('field_by_name', args=[self.field.name])
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
