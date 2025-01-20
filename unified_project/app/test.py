from django.test import TestCase
from django.urls import reverse
from rest_framework import status

class UrlTests(TestCase):

    def test_exists_url(self):
        url = reverse('exists')
        data = {'username': 'onyx'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_category_list_create_url(self):
        url = reverse('category-list-create')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_category_detail_url(self):
        url = reverse('category-detail', kwargs={'pk': 1})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)