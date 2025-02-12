import pytest
from django.contrib.auth import get_user_model
from concours.models import Concours, University, GrandEcole, ConcoursDocument

@pytest.fixture
def user(db):
    User = get_user_model()
    return User.objects.create_user(username="testuser", password="testpassword")

@pytest.fixture
def concours(db):
    return Concours.objects.create(name="Concours Test", is_published=True)

@pytest.fixture
def university(db):
    return University.objects.create(name="Université de Test")

@pytest.fixture
def grand_ecole(db, university):
    return GrandEcole.objects.create(name="Polytechnique Test", university=university)

@pytest.fixture
def document(db, concours):
    return ConcoursDocument.objects.create(title="Document Test", concours=concours)
