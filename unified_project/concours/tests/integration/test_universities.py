import pytest
from rest_framework.test import APIClient
from concours.models import University, GrandEcole

@pytest.fixture
def client():
    return APIClient()

@pytest.fixture
def university(db):
    return University.objects.create(name="Université de Douala")

@pytest.fixture
def grand_ecole(db, university):
    return GrandEcole.objects.create(name="Polytechnique Douala", university=university)

def test_liste_universites(client, university):
    """Test : Vérifier que les universités sont affichées"""
    response = client.get("/api/universities/")
    assert response.status_code == 200
    universites = response.json()
    
    assert any(u["name"] == "Université de Douala" for u in universites), "L'université doit être affichée"

def test_liste_grandes_ecoles(client, grand_ecole):
    """Test : Vérifier que les grandes écoles sont affichées"""
    response = client.get("/api/grandecoles/")
    assert response.status_code == 200
    grandes_ecoles = response.json()
    
    assert any(g["name"] == "Polytechnique Douala" for g in grandes_ecoles), "La grande école doit être affichée"
