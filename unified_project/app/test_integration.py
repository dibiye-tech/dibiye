from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from .models import Book, Category, Comment, Favorite, SousCategory, Branche, Classeur, ClasseurBook
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class AuthTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
        username="testuser", 
        email='testuser@example.com', 
        password="password"
        )
        self.category = Category.objects.create(name="Category 1", description="Test Category")
        self.sous_category = SousCategory.objects.create(name="SousCategory 1", category=self.category)
        self.branche = Branche.objects.create(name="Branche 1", sous_category=self.sous_category)
        self.book = Book.objects.create(title="Book 1", description="Test Book", category=self.category)
        self.comment = Comment.objects.create(user=self.user, book=self.book, content="Great book!")
        self.favorite = Favorite.objects.create(user=self.user, document=self.book)
        self.classeur = Classeur.objects.create(user=self.user, name="Test Classeur")
        self.classeur_book = ClasseurBook.objects.create(book=self.book, classeur=self.classeur)
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)

    def test_check_username_exists(self):
        url = reverse('exists')
        data = {'username': 'testuser'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username_exists'], True)

        data = {'username': 'user'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # def test_create_comment(self):
    #     """Test la création d'un commentaire sur un livre."""
    #     url = reverse('create_or_update_comment', kwargs={'book_id': self.book.id})
    #     data = {'book': self.book.id, 'content': 'This is a great book!'}
        
    #     # Authentifier l'utilisateur et envoyer la requête
    #     response = self.client.post(url, data, format='json',  HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

    #     # Vérifier que le commentaire a été créé
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    #     self.assertEqual(Comment.objects.count(), 1)
    #     self.assertEqual(Comment.objects.first().text, 'This is a great book!')

    def test_global_search(self):
        url = reverse('global-search') + '?search=book'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['books']), 0) 
