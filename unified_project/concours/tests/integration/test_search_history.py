import pytest
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from concours.models import SearchHistory

@pytest.fixture
def client():
    return APIClient()

@pytest.fixture
def user(db):
    return User.objects.create_user(username="testuser", password="testpassword")

@pytest.fixture
def search_entry(db, user):
    return SearchHistory.objects.create(user=user, query="Concours médecine")

def test_historique_recherche(client, search_entry, user):
    """Test : Vérifier que l'historique des recherches est accessible"""
    client.force_authenticate(user=user)
    response = client.get("/api/searchhistory/")
    assert response.status_code == 200
    history = response.json()
    
    assert any(h["query"] == "Concours médecine" for h in history), "La recherche doit être enregistrée"
