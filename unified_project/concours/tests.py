import os
from django.conf import settings
from django.test import TestCase
from django.urls import reverse, resolve
from rest_framework import status
from concours.views import (
    ConcoursViewSet, ConcoursCategoryViewSet, ConcoursSubCategoryViewSet,
    UniversityViewSet, PublishedConcoursViewSet, TestimonialViewSet,
    SearchView, SearchHistoryView, ConcoursDocumentsListView, ConcoursDetailView,
    TestView, SimpleTestView, AllDocumentsView, GrandeEcoleListView,
    get_grandes_ecoles_with_concours
)
from concours.models import ConcoursCategory, Concours, ConcoursDocument


class UrlsTestCase(TestCase):
    def setUp(self):
        """
        Configure les données de test nécessaires.
        """
        # Chemin vers le fichier PDF de test
        self.test_file_dir = os.path.join(settings.BASE_DIR, 'tests_files')
        self.test_file_path = os.path.join(self.test_file_dir, 'bts.pdf')

        # Créez le répertoire et le fichier PDF si nécessaire
        os.makedirs(self.test_file_dir, exist_ok=True)
        with open(self.test_file_path, 'wb') as f:
            f.write(b"%PDF-1.4\n%Fake PDF content for testing\n")

        # Créez les données de test
        self.category = ConcoursCategory.objects.create(name='Test Category')
        self.concours = Concours.objects.create(name='Test Concours', category=self.category)

        self.document = ConcoursDocument.objects.create(
            concours=self.concours,
            title='Test Document',
            document=self.test_file_path
        )

    def tearDown(self):
        """
        Nettoie les fichiers de test après exécution.
        """
        if os.path.exists(self.test_file_path):
            os.remove(self.test_file_path)
        if os.path.exists(self.test_file_dir):
            os.rmdir(self.test_file_dir)

    def test_router_urls(self):
        """Tester les URLs générées par le DefaultRouter."""
        response = self.client.get('/published_concours/')
        self.assertEqual(response.status_code, 200)

    def test_search_url(self):
        """Test de l'URL de recherche."""
        url = reverse('search')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(resolve(url).func.view_class, SearchView)

    def test_searchhistory_url(self):
        """Test de l'URL de l'historique des recherches."""
        url = reverse('searchhistory')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(resolve(url).func.view_class, SearchHistoryView)

    def test_concours_documents_url(self):
        """Test de l'URL pour la liste des documents d'un concours."""
        url = reverse('concours-documents-list', args=[self.concours.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(resolve(url).func.view_class, ConcoursDocumentsListView)

    def test_simple_test_url(self):
        """Test de l'URL pour le simple test."""
        url = reverse('simple-test')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(resolve(url).func.view_class, SimpleTestView)

    def test_test_concours_documents_url(self):
        """Test de l'URL pour tester les documents d'un concours."""
        url = reverse('test-concours-documents', args=[self.concours.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(resolve(url).func.view_class, TestView)

    def test_category_detail_url(self):
        """Test de l'URL pour un détail de catégorie."""
        url = reverse('category-detail', args=[self.category.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(resolve(url).func.cls, ConcoursCategoryViewSet)

    def test_all_documents_url(self):
        """Test de l'URL pour tous les documents."""
        url = reverse('all-documents', args=[self.concours.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(resolve(url).func.view_class, AllDocumentsView)

    def test_grandecoles_list_url(self):
        """Test de l'URL pour la liste des grandes écoles."""
        url = reverse('grandecoles-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(resolve(url).func.view_class, GrandeEcoleListView)

    def test_concours_detail_url(self):
        """Test de l'URL pour les détails d'un concours."""
        url = reverse('concours-detail', args=[self.concours.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(resolve(url).func.view_class, ConcoursDetailView)

    def test_get_grandes_ecoles_with_concours_url(self):
        """Test de l'URL pour obtenir les grandes écoles avec concours."""
        url = reverse('get_grandes_ecoles_with_concours', args=[self.category.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(resolve(url).func, get_grandes_ecoles_with_concours)
