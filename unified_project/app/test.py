from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from .models import Book, Category, SousCategory, Comment, Favorite, Classeur, ClasseurBook, Branche, History
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework_simplejwt.tokens import RefreshToken
from django.test import TestCase



User = get_user_model()

class APITestCaseSetup(APITestCase):

    # TEST URLS
    def setUp(self):
        self.user = User.objects.create_user(
        username="testuser", 
        email='testuser@example.com', 
        password="password"
        )
        
        # Créer un token JWT pour l'utilisateur
        refresh = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)

        self.category = Category.objects.create(name="Category 1", description="Test Category")
        self.sous_category = SousCategory.objects.create(name="SousCategory 1", category=self.category)
        self.branche = Branche.objects.create(name="Branche 1", sous_category=self.sous_category)
        self.book = Book.objects.create(title="Book 1", description="Test Book", category=self.category)
        self.comment = Comment.objects.create(user=self.user, book=self.book, content="Great book!")
        self.favorite = Favorite.objects.create(user=self.user, document=self.book)
        self.classeur = Classeur.objects.create(user=self.user, name="Test Classeur")
        self.classeur_book = ClasseurBook.objects.create(book=self.book, classeur=self.classeur)
    

    def test_check_username_exists(self):
        url = reverse('exists')
        data = {'username': 'testuser'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username_exists'], True)

    def test_create_category(self):
        url = reverse('category-list-create')
        data = {'name': 'New Category', 'description': 'New Description'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'New Category')

    def test_category_list_create(self):
        url = reverse('category-list-create')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)

    def test_book_list_create(self):
        url = reverse('documents')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)

    def test_book_detail_view(self):
        url = reverse('book-detail', args=[self.book.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.book.title)

    def test_comment_list_create(self):
        url = reverse('comment-list', args=[self.book.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)

    def test_global_search(self):
        url = reverse('global-search') + '?search=book'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['books']), 0)

    # def test_book_create(self):
    #     url = reverse('documents')
    #     data = {
    #             title == "Test Book",
    #             description=="Test Description",
    #             auteur=="Test Auteur",
    #             contenu=="Test Contenu",
    #             document_type=="pdf",
    #             category==self.category,
    #             sous_category==self.sous_category,
    #             branche==self.branche
    #             }
    #     response = self.client.post(url, data)
    #     print(response.data)
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    #     self.assertEqual(response.data['title'], 'New Book')

    # def test_history_create(self):
    #     url = reverse('history')
    #     data = {'document_id': self.book.id}
    #     response = self.client.post(url, data)
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    # def test_history_delete(self):
    #     url = reverse('delete_all_history')
    #     response = self.client.delete(url)
    #     self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    # def test_classeur_list(self):
    #     url = reverse('classeur')
    #     response = self.client.get(url, HTTP_AUTHORIZATION=f'Bearer {self.token}')
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.assertGreater(len(response.data), 0)

    # def test_favorite_create(self):
    #     url = reverse('favorite')
    #     data = {'document': self.book.id}
    #     response = self.client.post(url, data)
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    #     self.assertEqual(response.data['document'], self.book.id)

    # def test_favorite_list(self):
    #     url = reverse('favorite')
    #     response = self.client.get(url)
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.assertGreater(len(response.data), 0)

    # def test_favorite_delete(self):
    #     url = reverse('delete_favorite_entry', args=[self.book.id])
    #     response = self.client.delete(url)
    #     self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    # def test_classeur_create(self):
    #     url = reverse('classeur')
    #     data = {'name': 'My New Classeur'}
    #     response = self.client.post(url, data)
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    #     self.assertEqual(response.data['name'], 'My New Classeur')

    # def test_classeur_delete(self):
    #     url = reverse('delete_classeur_entry', args=[self.classeur.id])
    #     response = self.client.delete(url)
    #     self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    # def test_classeurbook_create(self):
    #     url = reverse('classeur')
    #     data = {'book_id': self.book.id, 'classeur_id': self.classeur.id}
    #     response = self.client.post(url, data)
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)


#LES MODELS
class UserModelTest(TestCase):

    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="password123"
        )

    def test_user_creation(self):
        user = self.user
        self.assertEqual(user.username, "testuser")
        self.assertEqual(user.email, "testuser@example.com")
        self.assertTrue(user.check_password("password123"))

    def test_user_str_method(self):
        self.assertEqual(str(self.user), "testuser")

class CategoryModelTest(TestCase):

    def setUp(self):
        self.category = Category.objects.create(
            name="Test Category",
            description="Test Description",
            lien="https://example.com"
        )

    def test_category_creation(self):
        category = self.category
        self.assertEqual(category.name, "Test Category")
        self.assertEqual(category.description, "Test Description")
        self.assertEqual(category.lien, "https://example.com")

    def test_category_str_method(self):
        self.assertEqual(str(self.category), "Test Category")

class SousCategoryModelTest(TestCase):

    def setUp(self):
        self.category = Category.objects.create(name="Test Category")
        self.sous_category = SousCategory.objects.create(name="Test SousCategory", category=self.category)

    def test_sous_category_creation(self):
        sous_category = self.sous_category
        self.assertEqual(sous_category.name, "Test SousCategory")
        self.assertEqual(sous_category.category, self.category)

    def test_sous_category_str_method(self):
        self.assertEqual(str(self.sous_category), "Test SousCategory")

class BrancheModelTest(TestCase):

    def setUp(self):
        self.category = Category.objects.create(name="Test Category")
        self.sous_category = SousCategory.objects.create(name="Test SousCategory", category=self.category)
        self.branche = Branche.objects.create(name="Test Branche", sous_category=self.sous_category)

    def test_branche_creation(self):
        branche = self.branche
        self.assertEqual(branche.name, "Test Branche")
        self.assertEqual(branche.sous_category, self.sous_category)

    def test_branche_str_method(self):
        self.assertEqual(str(self.branche), "Test Branche")

class BookModelTest(TestCase):

    def setUp(self):
        self.category = Category.objects.create(name="Test Category")
        self.sous_category = SousCategory.objects.create(name="Test SousCategory", category=self.category)
        self.branche = Branche.objects.create(name="Test Branche", sous_category=self.sous_category)
        self.book = Book.objects.create(
            title="Test Book",
            description="Test Description",
            auteur="Test Auteur",
            contenu="Test Contenu",
            document_type="pdf",
            category=self.category,
            sous_category=self.sous_category,
            branche=self.branche
        )

    def test_book_creation(self):
        book = self.book
        self.assertEqual(book.title, "Test Book")
        self.assertEqual(book.description, "Test Description")
        self.assertEqual(book.auteur, "Test Auteur")
        self.assertEqual(book.document_type, "pdf")
        self.assertEqual(book.category, self.category)
        self.assertEqual(book.sous_category, self.sous_category)
        self.assertEqual(book.branche, self.branche)

    def test_book_str_method(self):
        self.assertEqual(str(self.book), "Test Book")

class CommentModelTest(TestCase):

    def setUp(self):
        self.user = get_user_model().objects.create_user(username="testuser", password="password123")
        self.book = Book.objects.create(
            title="Test Book",
            description="Test Description",
            auteur="Test Auteur",
            contenu="Test Contenu",
            document_type="pdf"
        )
        self.comment = Comment.objects.create(user=self.user, book=self.book, content="Test Comment")

    def test_comment_creation(self):
        comment = self.comment
        self.assertEqual(comment.user, self.user)
        self.assertEqual(comment.book, self.book)
        self.assertEqual(comment.content, "Test Comment")

    def test_comment_str_method(self):
        self.assertEqual(str(self.comment), "Test Comment")

class HistoryModelTest(TestCase):

    def setUp(self):
        self.user = get_user_model().objects.create_user(username="testuser", password="password123")
        self.book = Book.objects.create(
            title="Test Book",
            description="Test Description",
            auteur="Test Auteur",
            contenu="Test Contenu",
            document_type="pdf"
        )
        self.history = History.objects.create(user=self.user, document=self.book)

    def test_history_creation(self):
        history = self.history
        self.assertEqual(history.user, self.user)
        self.assertEqual(history.document, self.book)

    def test_history_str_method(self):
        self.assertEqual(str(self.history), f"History of {self.book.title} by {self.user.username}")

class FavoriteModelTest(TestCase):

    def setUp(self):
        self.user = get_user_model().objects.create_user(username="testuser", password="password123")
        self.book = Book.objects.create(
            title="Test Book",
            description="Test Description",
            auteur="Test Auteur",
            contenu="Test Contenu",
            document_type="pdf"
        )
        self.favorite = Favorite.objects.create(user=self.user, document=self.book)

    def test_favorite_creation(self):
        favorite = self.favorite
        self.assertEqual(favorite.user, self.user)
        self.assertEqual(favorite.document, self.book)

    def test_favorite_str_method(self):
        self.assertEqual(str(self.favorite), f"{self.user.username}")

class ClasseurModelTest(TestCase):

    def setUp(self):
        self.user = get_user_model().objects.create_user(username="testuser", password="password123")
        self.classeur = Classeur.objects.create(name="Test Classeur", user=self.user)
        self.book = Book.objects.create(
            title="Test Book",
            description="Test Description",
            auteur="Test Auteur",
            contenu="Test Contenu",
            document_type="pdf"
        )
        self.classeur_book = ClasseurBook.objects.create(classeur=self.classeur, book=self.book)

    def test_classeur_creation(self):
        classeur = self.classeur
        self.assertEqual(classeur.name, "Test Classeur")
        self.assertEqual(classeur.user, self.user)

    def test_classeur_book_creation(self):
        classeur_book = self.classeur_book
        self.assertEqual(classeur_book.classeur, self.classeur)
        self.assertEqual(classeur_book.book, self.book)

    def test_classeur_book_str_method(self):
        self.assertEqual(str(self.classeur_book), f'{self.classeur.name} - {self.book.title}')

#LES VIEWS
class TestAPIViews(APITestCase):

    def setUp(self):
        # Créez un utilisateur de test
        self.user = User.objects.create_user(username='testuser', password='password')
        
        # Créez des données pour les tests
        self.category = Category.objects.create(name='Test Category', description='Test Description')
        self.sous_category = SousCategory.objects.create(name='Test SousCategory', category=self.category)
        self.branche = Branche.objects.create(name="Branche 1", sous_category=self.sous_category)
        self.book = Book.objects.create(title='Test Book', description='Test Description', category=self.category)
        self.comment = Comment.objects.create(book=self.book, user=self.user, content='Great book!')
        self.favorite = Favorite.objects.create(user=self.user, document=self.book)
        
        # Authentification
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_check_username_exists(self):
        url = reverse('exists')
        response = self.client.post(url, {'username': 'testuser'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username_exists'], True)
        
        response = self.client.post(url, {'username': 'nonexistent'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['username_exists'], False)

    def test_category_list_create(self):
        url = reverse('category-list-create')
        
        # Test GET
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Test POST
        data = {'name': 'New Category', 'description': 'New Description'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'New Category')

    # def test_category_retrieve_update_destroy(self):
    #     url = reverse('category-detail', args=[self.category.id])
        
    #     # Test GET
    #     response = self.client.get(url)
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    #     # Test PUT
    #     data = {'name': 'Updated Category', 'description': 'Updated Description'}
    #     response = self.client.put(url, data, format='json')
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.assertEqual(response.data['name'], 'Updated Category')
        
    #     # Test DELETE
    #     response = self.client.delete(url)
    #     self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    # def test_book_list_create(self):
    #     url = reverse('documents')
        
    #     # Test GET
    #     response = self.client.get(url)
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    #     # Test POST
    #     data = {
    #         'title': "Test Book",
    #         'image': "jpg",
    #         'description': "Test Description",
    #         'auteur': "Test Auteur",
    #         'contenu': "Test Contenu",
    #         'document_type': "pdf",
    #         'category': self.category,
    #         'sous_category': self.sous_category,
    #         'branche': self.branche
    #         }
    #     response = self.client.post(url, data)
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    #     self.assertEqual(response.data['title'], 'Test Book')

    def test_book_detail(self):
        url = reverse('book-detail', args=[self.book.id])
        
        # Test GET
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # def test_comment_create(self):
    #     url = reverse('create_or_update_comment', args=[self.book.id])
    #     data = {'user': self.user, 'book': self.book, 'content': 'This is a comment'}
        
    #     # Test POST
    #     response = self.client.post(url, data)
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    #     self.assertEqual(response.data['content'], 'This is a comment')

    def test_comment_list(self):
        url = reverse('comment-list', args=[self.book.id])
        
        # Test GET
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)

    def test_history_create(self):
        url = reverse('history')
        data = {'document_id': self.book.id}
        
        # Test POST
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['detail'], 'History recorded.')

    # def test_favorite_create(self):
    #     url = reverse('favorite')
    #     data = {'user': self.user, 'document': self.book.id}
        
    #     # Test POST
    #     response = self.client.post(url, data)
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    #     self.assertEqual(response.data['document'], self.book.id)

    def test_favorite_list(self):
        url = reverse('favorite')
        
        # Test GET
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_classeur_create(self):
        url = reverse('classeur')
        data = {'name': 'Test Classeur', 'user': self.user}
        
        # Test POST
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'Test Classeur')

    # def test_classeur_book_create(self):
    #     url = reverse('classeur-book')
    #     data = {'classeur': self.category.id, 'book': self.book.id}
        
    #     # Test POST
    #     response = self.client.post(url, data, format='json')
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    #     self.assertEqual(response.data['book'], self.book.id)
        
    def test_global_search(self):
        url = reverse('global-search')
        response = self.client.get(url, {'search': 'Test'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('books', response.data)
        self.assertIn('categories', response.data)
        self.assertIn('sous_categories', response.data)