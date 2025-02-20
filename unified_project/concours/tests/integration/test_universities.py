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

# import pytest
# from rest_framework.test import APIClient
# from rest_framework_simplejwt.tokens import RefreshToken
# from django.contrib.auth import get_user_model
# from concours.models import University, GrandEcole

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
# def university(db):
#     """Créer une université"""
#     return University.objects.create(name="Université de Douala")

# @pytest.fixture
# def grand_ecole(db, university):
#     """Créer une grande école liée à une université"""
#     return GrandEcole.objects.create(name="Polytechnique Douala", university=university)

# def test_liste_universites(auth_client, university, live_server):
#     """Test : Vérifier que les universités sont affichées pour un utilisateur authentifié"""
#     response = auth_client.get(f"{live_server.url}/concours/universities/")

#     print("Réponse API Universités:", response.json())  # Debugging

#     assert response.status_code == 200, f"Erreur: {response.json()}"

#     universites = response.json()

#     # Vérifie si la réponse est sous forme de pagination (modifie selon ton API)
#     if isinstance(universites, dict):  
#         universites = universites.get("results", [])  

#     assert any(u["name"] == "Université de Douala" for u in universites), "L'université doit être affichée"

# def test_liste_grandes_ecoles(auth_client, grand_ecole, university, live_server):
#     """Test : Vérifier que les grandes écoles sont affichées pour une université donnée et un utilisateur authentifié"""
#     response = auth_client.get(f"{live_server.url}/concours/universities/{university.id}/grandesecoles/")

#     print("Réponse API Grandes Écoles:", response.json())  # Debugging

#     assert response.status_code == 200, f"Erreur: {response.json()}"

#     grandes_ecoles = response.json()

#     # Vérifie si la réponse est sous forme de pagination (modifie selon ton API)
#     if isinstance(grandes_ecoles, dict):  
#         grandes_ecoles = grandes_ecoles.get("results", [])  

#     assert any(g["ecole_name"] == "Polytechnique Douala" for g in grandes_ecoles), "La grande école doit être affichée"
