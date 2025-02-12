import pytest
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from concours.models import Concours, Ville, GrandEcole, NiveauMinimum, NiveauObtenue, Cycle  # Modifie selon ton projet

User = get_user_model()

@pytest.fixture
def client():
    """Créer un client API pour les tests non authentifiés"""
    return APIClient()

@pytest.fixture
def user(db):
    """Créer un utilisateur test"""
    return User.objects.create_user(username="testuser", password="testpassword", email="test@example.com")

@pytest.fixture
def auth_client(user):
    """Créer un client API authentifié avec JWT"""
    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return client

@pytest.fixture
def ville(db):
    """Créer une ville"""
    return Ville.objects.create(name="Yaoundé", departement="Mfoundi", region="Centre", arrondissements="Bastos, Mvog-Ada")

@pytest.fixture
def niveau_minimum(db):
    """Créer un niveau minimum requis"""
    return NiveauMinimum.objects.create(name="Baccalauréat")

@pytest.fixture
def niveau_obtenu(db):
    """Créer un niveau obtenu après concours"""
    return NiveauObtenue.objects.create(name="Licence")

@pytest.fixture
def cycle(db):
    """Créer un cycle universitaire"""
    return Cycle.objects.create(name="Licence", description="Cycle de Licence")

@pytest.fixture
def concours(db, ville, niveau_minimum, niveau_obtenu, cycle):
    """Créer un concours avec des détails"""
    concours = Concours.objects.create(
        name="Concours Polytechnique",
        description="Concours d'entrée à Polytechnique",
        is_published=True
    )
    concours.villes.add(ville)
    concours.niveau_minimum.add(niveau_minimum)
    concours.niveau_obtenu.add(niveau_obtenu)
    concours.cycles.add(cycle)
    return concours

