import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from concours.models import SearchHistory

@pytest.fixture
def client():
    return APIClient()

@pytest.fixture
def user(db):
    User = get_user_model()  # Récupère le modèle utilisateur personnalisé
    return User.objects.create_user(username="testuser", password="testpassword")

@pytest.fixture
def search_entry(db, user):
    return SearchHistory.objects.create(user=user, query="Concours médecine")

def test_historique_recherche(client, search_entry, user, live_server):
    """Test : Vérifier que l'historique des recherches est accessible"""
    client.force_authenticate(user=user)  # Authentifie l'utilisateur
    response = client.get(f"{live_server.url}/concours/searchhistory/")  # Ajoute "/concours/"

    print(response.json())  # Debug pour voir la réponse exacte
    assert response.status_code == 200, f"Erreur: {response.json()}"
