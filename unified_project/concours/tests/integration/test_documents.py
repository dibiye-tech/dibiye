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

def test_documents_lies_concours(client, document, concours):
    """Test : Vérifier que les documents liés à un concours sont affichés"""
    response = client.get(f"/api/concours/documents/{concours.id}/")
    assert response.status_code == 200
    documents = response.json()
    
    assert any(doc["title"] == "Document de préparation" for doc in documents), "Le document doit être affiché"
