import os
import sys
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import (
    Concours, ConcoursCategory, ConcoursSubCategory, University, 
    Testimonial, Ville, ConcoursDocument, Cycle, NiveauMinimum, NiveauObtenue, 
    GrandEcole, SearchHistory
)
from rest_framework_simplejwt.tokens import RefreshToken

# Utilisateur personnalisé
User = get_user_model()

# --- TEST DES MODÈLES ---
class ConcoursModelsTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        """Création des objets pour tous les tests (amélioration des performances)."""
        cls.category = ConcoursCategory.objects.create(name="Public", description="Concours public")
        cls.subcategory = ConcoursSubCategory.objects.create(name="Médecine", description="Médecine")
        cls.subcategory.categories.add(cls.category)
        
        cls.university = University.objects.create(name="Université de Test")
        cls.ville = Ville.objects.create(name="Yaoundé", departement="Mfoundi", region="Centre", arrondissements="Bastos, Melen")
        
        cls.cycle = Cycle.objects.create(name="Licence", description="Cycle Licence")
        cls.niveau_min = NiveauMinimum.objects.create(name="Baccalauréat", description="Diplôme requis")
        cls.niveau_obtenu = NiveauObtenue.objects.create(name="Licence", description="Diplôme obtenu")
        
        cls.grande_ecole = GrandEcole.objects.create(name="Grande École Test", university=cls.university)

        cls.concours = Concours.objects.create(
            name="Concours National",
            description="Test Concours Description",
            category=cls.category,
            subcategory=cls.subcategory
        )
        cls.concours.grandes_ecoles.add(cls.grande_ecole)
        cls.concours.villes.add(cls.ville)
        cls.concours.niveau_minimum.add(cls.niveau_min)
        cls.concours.niveau_obtenu.add(cls.niveau_obtenu)
        cls.concours.cycles.add(cls.cycle)

        cls.testimonial = Testimonial.objects.create(name="John Doe", content="Super concours !")

    def test_category_creation(self):
        self.assertEqual(self.category.name, "Public")

    def test_concours_creation(self):
        self.assertEqual(self.concours.name, "Concours National")
        self.assertEqual(self.concours.description, "Test Concours Description")
        self.assertEqual(self.concours.category, self.category)
        self.assertEqual(self.concours.subcategory, self.subcategory)

    def test_testimonial_creation(self):
        self.assertEqual(self.testimonial.name, "John Doe")

    def test_str_methods(self):
        self.assertEqual(str(self.category), "Public")
        self.assertEqual(str(self.concours), "Concours National")
        self.assertEqual(str(self.testimonial), "John Doe")


# --- TESTS DES URL ET VUES ---
class ConcoursViewsTestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="password123"
        )

        refresh = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)

        self.category = ConcoursCategory.objects.create(name="Public", description="Concours public")
        self.subcategory = ConcoursSubCategory.objects.create(name="Médecine", description="Médecine")
        self.subcategory.categories.set([self.category])

        self.university = University.objects.create(name="Université de Test")
        self.ville = Ville.objects.create(name="Yaoundé", departement="Mfoundi", region="Centre", arrondissements="Bastos, Melen")

        self.concours = Concours.objects.create(
            name="Concours National",
            description="Test Concours Description",
            category=self.category,
            subcategory=self.subcategory
        )

        self.testimonial = Testimonial.objects.create(name="John Doe", content="Super concours !")

        # ✅ Ajouter un document pour éviter l'erreur 404 dans le test `test_concours_documents_list`
        self.concours_document = ConcoursDocument.objects.create(
            concours=self.concours,
            title="Guide Test",
            document=SimpleUploadedFile("guide.pdf", b"dummy content")  # Simuler un fichier PDF
        )


    def test_published_concours_list(self):
        url = reverse('publishedconcours-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_category_list(self):
        url = reverse('concourscategory-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_subcategory_list(self):
        url = reverse('concourssubcategory-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_university_list(self):
        url = reverse('university-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_concours_detail_view(self):
        url = reverse('concours-detail', args=[self.concours.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.concours.name)

    def test_testimonial_list(self):
        url = reverse('testimonial-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_search_view(self):
        url = reverse('search') + '?q=concours'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_grandes_ecoles_with_concours(self):
        url = reverse('get_grandes_ecoles_with_concours', args=[self.university.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_concours_documents_list(self):
        url = reverse('all-documents', args=[self.concours.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_search_history(self):
        url = reverse('searchhistory')
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_grandes_ecoles_action(self):
        url = reverse('university-grandes-ecoles', args=[self.university.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


# --- TEST SIMPLE POUR VALIDER LA CONFIGURATION ---
class SimpleTestCase(TestCase):
    def test_basic_addition(self):
        self.assertEqual(1 + 1, 2)
# Tests des modèles (4)
# ✅ test_category_creation
# ✅ test_concours_creation
# ✅ test_testimonial_creation
# ✅ test_str_methods

# Tests des vues (11)
# ✅ test_published_concours_list
# ✅ test_category_list
# ✅ test_subcategory_list
# ✅ test_university_list
# ✅ test_concours_detail_view
# ✅ test_testimonial_list
# ❌ test_search_view (MANQUANT)
# ✅ test_get_grandes_ecoles_with_concours
# ✅ test_concours_documents_list
# ✅ test_search_history
# ✅ test_grandes_ecoles_action

# Test simple (1)
# ✅ test_basic_addition