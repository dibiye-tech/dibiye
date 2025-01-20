from django.test import TestCase
from django.urls import reverse
from rest_framework import status

class UrlTests(TestCase):

    def test_exists_url(self):
        url = reverse('exists')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)  # Vérifie que la réponse est OK

    def test_category_list_create_url(self):
        url = reverse('category-list-create')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_category_detail_url(self):
        url = reverse('category-detail', kwargs={'pk': 1})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_souscategory_list_create_url(self):
        url = reverse('souscategory-list-create')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_souscategory_detail_url(self):
        url = reverse('souscategory-detail', kwargs={'pk': 1})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_documents_url(self):
        url = reverse('documents')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_recent_documents_url(self):
        url = reverse('recent-documents')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_documents_by_category_url(self):
        url = reverse('documents-by-category', kwargs={'category_id': 1})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_documents_by_sous_category_url(self):
        url = reverse('documents-by-sous-category', kwargs={'sous_category_id': 1})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_documents_by_branche_url(self):
        url = reverse('documents-by-branche', kwargs={'sous_category_id': 1, 'branche_id': 1})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_update_url(self):
        url = reverse('user-update')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_book_detail_url(self):
        url = reverse('book-detail', kwargs={'id': 1})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_comment_list_url(self):
        url = reverse('comment-list', kwargs={'book_id': 1})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_history_url(self):
        url = reverse('history')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_all_history_url(self):
        url = reverse('delete_all_history')
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_history_entry_url(self):
        url = reverse('delete_history_entry', kwargs={'document_id': 1})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_favorite_url(self):
        url = reverse('favorite')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_all_favorites_url(self):
        url = reverse('favorite-delete-all')
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_favorite_entry_url(self):
        url = reverse('delete_favorite_entry', kwargs={'document_id': 1})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_classeur_url(self):
        url = reverse('classeur')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_classeur_entry_url(self):
        url = reverse('delete_classeur_entry', kwargs={'pk': 1})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_classeurbook_url(self):
        url = reverse('classeur')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_classeurbook_delete_all_url(self):
        url = reverse('classeurbook-delete-all')
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_classeurbook_entry_url(self):
        url = reverse('delete_classeurbook_entry', kwargs={'book_id': 1})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_global_search_url(self):
        url = reverse('global-search')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_or_update_comment_url(self):
        url = reverse('create_or_update_comment', kwargs={'book_id': 1})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
