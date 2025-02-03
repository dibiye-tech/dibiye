from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from .models import Book, Category, SousCategory, Comment, Favorite, Classeur, ClasseurBook, Branche
from django.core.files.uploadedfile import SimpleUploadedFile



User = get_user_model()

class APITestCaseSetup(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", email='testuser@example.com', password="password")
        self.client.login(username="testuser", password="password")

        self.category = Category.objects.create(name="Category 1", description="Test Category")
        self.sous_category = SousCategory.objects.create(name="SousCategory 1", category=self.category)
        self.branche = Branche.objects.create(name="Branche 1", sous_category=self.sous_category)
        self.book = Book.objects.create(title="Book 1", description="Test Book", category=self.category)
        self.comment = Comment.objects.create(user=self.user, book=self.book, content="Great book!")
        self.favorite = Favorite.objects.create(user=self.user, document=self.book)
        self.classeur = Classeur.objects.create(user=self.user, name="Test Classeur")
        self.classeur_book = ClasseurBook.objects.create(book=self.book, classeur=self.classeur)
    
    def test_classeur_list(self):
        user = User.objects.create_user(username='testuser1', email='testuser1@example.com', password='testpassword1')
        logged_in = self.client.login(username='testuser1', password='testpassword1')
        self.assertTrue(logged_in, "Login failed")
        url = reverse('classeur')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)

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

    def test_book_create(self):
        url = reverse('documents')
        image_file = SimpleUploadedFile('test.jpg', b'\x89PNG\r\n\x1a\n...', content_type='image/jpeg')
        file_file = SimpleUploadedFile('book_file.pdf', b'file_content', content_type='application/pdf')
        data = {
                    'title': 'New Book',  
                    'image': image_file,
                    'description': 'New Book Description',
                    'auteur': 'Author Name',
                    'contenu': 'Book Content',
                    'document_type': 'PDF',
                    'file': file_file,
                    'category': self.category.id,
                    'sous_category': self.sous_category.id,
                    'branche': self.branche.id,
                }
        response = self.client.post(url, data)
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'New Book')

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

    def test_favorite_create(self):
        url = reverse('favorite')
        data = {'document': self.book.id}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['document'], self.book.id)

    def test_favorite_list(self):
        url = reverse('favorite')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)

    def test_favorite_delete(self):
        url = reverse('delete_favorite_entry', args=[self.book.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_classeur_create(self):
        url = reverse('classeur')
        data = {'name': 'My New Classeur'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'My New Classeur')

    def test_classeur_delete(self):
        url = reverse('delete_classeur_entry', args=[self.classeur.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_classeurbook_create(self):
        url = reverse('classeur')
        data = {'book_id': self.book.id, 'classeur_id': self.classeur.id}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_global_search(self):
        url = reverse('global-search') + '?search=book'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['books']), 0)

    def test_history_create(self):
        url = reverse('history')
        data = {'document_id': self.book.id}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_history_delete(self):
        url = reverse('delete_all_history')
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)