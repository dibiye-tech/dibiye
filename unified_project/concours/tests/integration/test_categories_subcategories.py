import pytest
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from concours.models import ConcoursCategory, ConcoursSubCategory  # Modifie selon ton projet

User = get_user_model()

@pytest.fixture
def client():
    """Créer un client API non authentifié"""
    return APIClient()

@pytest.fixture
def user(db):
    """Créer un utilisateur de test"""
    return User.objects.create_user(username="testuser", password="testpassword", email="test@example.com")

@pytest.fixture
def auth_client(user):
    """Créer un client API authentifié avec JWT"""
    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return client

@pytest.fixture
def category(db):
    """Créer une catégorie de concours"""
    return ConcoursCategory.objects.create(name="Concours Public", description="Concours du secteur public")

@pytest.fixture
def subcategory(db, category):
    """Créer une sous-catégorie liée à une catégorie"""
    subcategory = ConcoursSubCategory.objects.create(name="Médecine", description="Concours pour les médecins")
    subcategory.categories.add(category)
    return subcategory
