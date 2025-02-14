import pytest
from rest_framework.test import APIClient
from concours.models import Concours, ConcoursDocument, Cycle

@pytest.fixture
def client():
    return APIClient()

@pytest.fixture
def cycle(db):
    return Cycle.objects.create(name="Licence", description="Cycle de Licence")

@pytest.fixture
def concours(db, cycle):
    concours = Concours.objects.create(name="Concours Test", description="Un concours de test", is_published=True)
    concours.cycles.add(cycle)
    return concours

@pytest.fixture
def document(db, concours, cycle):
    return ConcoursDocument.objects.create(
        concours=concours,
        title="Document de préparation",
        document="concours_documents/test.pdf",
        cycle=cycle
    )

def test_documents_lies_concours(client, document, concours, live_server):
    """Test : Vérifier que les documents liés à un concours sont affichés"""
    response = client.get(f"{live_server.url}/concours/concours/documents/{concours.id}/")

    assert response.status_code == 200
    documents = response.json()
    
    assert any(doc["title"] == "Document de préparation" for doc in documents), "Le document doit être affiché"
# Ce test vérifie que les documents liés à un concours sont bien affichés .







# import pytest
# from rest_framework.test import APIClient
# from rest_framework_simplejwt.tokens import RefreshToken
# from django.contrib.auth import get_user_model
# from concours.models import Concours, ConcoursDocument, Cycle

# User = get_user_model()

# @pytest.fixture
# def client():
#     """Créer un client API pour les tests non authentifiés"""
#     return APIClient()

# @pytest.fixture
# def user(db):
#     """Créer un utilisateur test"""
#     return User.objects.create_user(username="testuser", password="testpassword", email="test@example.com")

# @pytest.fixture
# def auth_client(user):
#     """Créer un client API authentifié avec JWT"""
#     client = APIClient()
#     refresh = RefreshToken.for_user(user)
#     client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
#     return client

# @pytest.fixture
# def cycle(db):
#     """Créer un cycle universitaire"""
#     return Cycle.objects.create(name="Licence", description="Cycle de Licence")

# @pytest.fixture
# def concours(db, cycle):
#     """Créer un concours avec des détails"""
#     concours = Concours.objects.create(name="Concours Test", description="Un concours de test", is_published=True)
#     concours.cycles.add(cycle)
#     return concours

# @pytest.fixture
# def document(db, concours, cycle):
#     """Créer un document lié à un concours"""
#     return ConcoursDocument.objects.create(
#         concours=concours,
#         title="Document de préparation",
#         document="concours_documents/test.pdf",
#         cycle=cycle
#     )
