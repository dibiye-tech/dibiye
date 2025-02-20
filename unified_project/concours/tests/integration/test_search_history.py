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

    
# import pytest
# from rest_framework.test import APIClient
# from rest_framework_simplejwt.tokens import RefreshToken
# from django.contrib.auth import get_user_model
# from concours.models import SearchHistory

# User = get_user_model()  # Récupère le modèle utilisateur

# @pytest.fixture
# def client():
#     """Client API non authentifié"""
#     return APIClient()

# @pytest.fixture
# def user(db):
#     """Créer un utilisateur de test"""
#     return User.objects.create_user(username="testuser", password="testpassword", email="test@example.com")

# @pytest.fixture
# def auth_client(user):
#     """Client API avec authentification JWT"""
#     client = APIClient()
#     refresh = RefreshToken.for_user(user)
#     client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
#     return client

# @pytest.fixture
# def search_entry(db, user):
#     """Créer une entrée d'historique de recherche"""
#     return SearchHistory.objects.create(user=user, query="Concours médecine")

# def test_historique_recherche(auth_client, search_entry, live_server):
#     """Test : Vérifier que l'historique des recherches est accessible pour un utilisateur authentifié"""
#     response = auth_client.get(f"{live_server.url}/concours/searchhistory/")
    
#     print("Réponse API:", response.json())  # Debugging
    
#     assert response.status_code == 200, f"Erreur: {response.json()}"
    
#     history = response.json().get("history", [])  # Récupère la liste des recherches
    
#     assert isinstance(history, list), "La réponse doit contenir une liste dans 'history'"
#     assert any(h["query"] == "Concours médecine" for h in history), "La recherche doit être enregistrée"
