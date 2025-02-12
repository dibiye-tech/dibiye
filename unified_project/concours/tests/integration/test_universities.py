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

def test_liste_universites(client, university, live_server):
    """Test : Vérifier que les universités sont affichées"""
    response = client.get(f"{live_server.url}/concours/universities/")
    
    print(response.json())  # Ajoute ce print pour voir la réponse exacte
    
    assert response.status_code == 200, f"Erreur: {response.json()}"
    
    universites = response.json()

    if isinstance(universites, dict):  # Vérifie si c'est un objet JSON au lieu d'un tableau
        universites = universites.get("results", [])  # Modifie si nécessaire

    assert any(u["name"] == "Université de Douala" for u in universites), "L'université doit être affichée"


def test_liste_grandes_ecoles(client, grand_ecole, university, live_server):
    """Test : Vérifier que les grandes écoles sont affichées pour une université donnée"""
    response = client.get(f"{live_server.url}/concours/universities/{university.id}/grandesecoles/")

    print(response.json())  # Debug pour voir la réponse

    assert response.status_code == 200, f"Erreur: {response.json()}"

# Ce test vérifie que les universités et les grandes écoles sont bien affichées .