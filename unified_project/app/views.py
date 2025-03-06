from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer, CategorySerializer, SousCategorySerializer, BookSerializer, UserUpdateSerializer, CommentSerializer, CommentCreateSerializer, HistorySerializer, FavoriteSerializer, ClasseurSerializer, ClasseurBookSerializer, BrancheSerializer, NewsletterSubscriberSerializer, NewsletterSerializer
from rest_framework import generics
from .models import Category, SousCategory, Book, Comment, History, Favorite, Classeur, ClasseurBook, Branche, NewsletterSubscriber
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import viewsets, pagination
from django.utils.crypto import get_random_string
from django.shortcuts import get_object_or_404
from django.http import Http404
from elasticsearch_dsl import Search, Q
from elasticsearch_dsl.connections import connections
from elasticsearch_dsl.query import MultiMatch
import logging
from math import ceil
from unidecode import unidecode
from django.core.mail import send_mail
from django.conf import settings


User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
def check_username_exists(request):
    if not request.data.get('username'):
        return Response({'error': 'Bad_request'}, status=status.HTTP_400_BAD_REQUEST)

    username = request.data.get('username')
    try:
        User.objects.get(username=username)
        return Response({'username_exists': True}, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({'username_exists': False}, status=status.HTTP_404_NOT_FOUND)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        try:
            user = User.objects.get(username=request.data.get('username'))
            if not user.is_active:
                return Response({'detail': 'Account not activated'}, status=status.HTTP_401_UNAUTHORIZED)
            if user.is_deactivated:
                return Response({'detail': 'Account deactivated'}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({'error': 'Invalid username or password'}, status=status.HTTP_400_BAD_REQUEST)

        return super().post(request, *args, **kwargs)

class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class CategoryRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class SousCategoryListCreateView(generics.ListCreateAPIView):
    queryset = SousCategory.objects.all()
    serializer_class = SousCategorySerializer
    permission_classes = [AllowAny]

class SousCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SousCategory.objects.all()
    serializer_class = SousCategorySerializer
    permission_classes = [AllowAny]

class BrancheListCreateView(generics.ListCreateAPIView):
    queryset = Branche.objects.all()
    serializer_class = BrancheSerializer
    permission_classes = [AllowAny]

class BrancheDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Branche.objects.all()
    serializer_class = BrancheSerializer
    permission_classes = [AllowAny]

class BookListCreateView(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [AllowAny]

class RecentDocumentsView(generics.ListAPIView):
    serializer_class = BookSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Book.objects.all().order_by('-id')[:4]

class DocumentsByCategoryView(generics.ListAPIView):
    serializer_class = BookSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        category_id = self.kwargs['category_id']
        return Book.objects.filter(category_id=category_id)

class DocumentsByBrancheView(generics.ListAPIView):
    serializer_class = BookSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        sous_category_id = self.kwargs['sous_category_id']
        branche_id = self.kwargs.get('branche_id')  # Branche optionnelle
        queryset = Book.objects.filter(sous_category_id=sous_category_id)

        if branche_id:
            queryset = queryset.filter(branche_id=branche_id)  # Filtre par branche

        return queryset

class BranchesBySousCategory(generics.ListAPIView):
    serializer_class = BrancheSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        sous_category_id = self.kwargs['sous_category_id']
        queryset = Branche.objects.filter(sous_category_id=sous_category_id)

        return queryset

class DocumentsBySousCategoryView(generics.ListAPIView):
    serializer_class = BookSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        sous_category_id = self.kwargs['sous_category_id']
        return Book.objects.filter(sous_category_id=sous_category_id)

class BookDetailView(generics.RetrieveAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        
        id = self.kwargs['id']
        try:
            
            return Book.objects.get(id=id)
        except Book.DoesNotExist:
            raise Http404("Book not found")

class UserUpdateView(generics.UpdateAPIView):
    serializer_class = UserUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class CommentCreateView(generics.CreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CommentListView(generics.ListAPIView):
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        document_id = self.kwargs.get('book_id')
        return Comment.objects.filter(book_id=document_id)


class HistoryViewSet(viewsets.ViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_user(self, request):
        # If the user is authenticated, return their user instance
        if request.user.is_authenticated:
            return request.user
        return None  # User not authenticated

    def create(self, request, format=None):
        document_id = request.data.get('document_id')
        if not document_id:
            return Response({'detail': 'Document ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            document = Book.objects.get(id=document_id)
        except Book.DoesNotExist:
            return Response({'detail': 'Document not found.'}, status=status.HTTP_404_NOT_FOUND)

        user = self.get_user(request)

        if user is None:
            # Notify frontend to save in local storage
            return Response({'detail': 'User not authenticated, please save to local storage.', 'document_id': document_id}, status=status.HTTP_403_FORBIDDEN)

        # Retrieve all history records for the user
        recent_histories = History.objects.filter(user=user).order_by('-timestamp')

        # Check if the document is already in the last 10 history records
        if any(history.document == document for history in recent_histories[:10]):
            return Response({'detail': 'This document is already in your history.'}, status=status.HTTP_200_OK)

        # Create a new history record
        History.objects.create(user=user, document=document)
        return Response({'detail': 'History recorded.'}, status=status.HTTP_201_CREATED)

    def list(self, request, format=None):
        user = self.get_user(request)

        try:
            histories = History.objects.filter(user=user).order_by('-timestamp')[:10]
            serializer = HistorySerializer(histories, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, format=None):
        user = self.get_user(request)

        if user is None:
            return Response({'detail': 'User not authenticated.'}, status=status.HTTP_403_FORBIDDEN)

        History.objects.filter(user=user).delete()
        return Response({'detail': 'All history entries have been deleted.'}, status=status.HTTP_204_NO_CONTENT)

    def destroy(self, request, document_id=None, format=None):
        user = self.get_user(request)

        if document_id is None:
            return Response({'detail': 'Document ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if user is None:
            return Response({'detail': 'User not authenticated.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            history_entries = History.objects.filter(user=user, document_id=document_id)
            count_deleted, _ = history_entries.delete()
            if count_deleted > 0:
                return Response({'detail': f'{count_deleted} history entry(s) deleted.'}, status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({'detail': 'History entry not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FavoriteViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = FavoriteSerializer

    def get_user(self, request):
        return request.user if request.user.is_authenticated else None

    def list(self, request):
        user = self.get_user(request)
        if user is None:
            return Response({'detail': 'User not authenticated.'}, status=status.HTTP_403_FORBIDDEN)

        # Récupérer tous les favoris de l'utilisateur
        queryset = Favorite.objects.filter(user=user)
        
        # Sérialiser les résultats sans pagination
        serializer = FavoriteSerializer(queryset, many=True)
        return Response(serializer.data)


    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    def create(self, request):
        document_id = request.data.get('document')

        if not document_id:
            return Response({'detail': 'Document ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the document exists
        if not Book.objects.filter(id=document_id).exists():
            return Response({'detail': 'Document not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Check if the user already has this document in favorites
        if Favorite.objects.filter(user=request.user, document_id=document_id).exists():
            return Response({'detail': 'This document is already in your favorites.'}, status=status.HTTP_409_CONFLICT)

        # Create a new favorite
        favorite_data = {'document': document_id}
        serializer = self.get_serializer(data=favorite_data)

        if serializer.is_valid():
            serializer.save(user=request.user)  # Set the user here
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



    def destroy(self, request, document_id=None,):
        user = self.get_user(request)
        if user is None:
            return Response({'detail': 'User not authenticated.'}, status=status.HTTP_403_FORBIDDEN)

        favorite = get_object_or_404(Favorite.objects.filter(user=user), document_id=document_id)
        favorite.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def delete_all(self, request):
        user = self.get_user(request)
        if user is None:
            return Response({'detail': 'User not authenticated.'}, status=status.HTTP_403_FORBIDDEN)

        Favorite.objects.filter(user=user).delete()
        return Response({'detail': 'All favorites have been deleted.'}, status=status.HTTP_204_NO_CONTENT)

class ClasseurViewSet(viewsets.ModelViewSet):
    queryset = Classeur.objects.all()
    serializer_class = ClasseurSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        # Filtrer les classeurs pour l'utilisateur authentifié
        queryset = Classeur.objects.filter(user=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def destroy(self, request, pk=None):
        try:
            classeur = self.get_object()
            classeur.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Http404:
            return Response({'detail': 'Classeur not found.'}, status=status.HTTP_404_NOT_FOUND)

class ClasseurBookViewSet(viewsets.ModelViewSet):
    queryset = ClasseurBook.objects.all()
    serializer_class = ClasseurBookSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        book_id = request.data.get('book_id')
        classeur_id = request.data.get('classeur_id')
        
        try:
            book = Book.objects.get(id=book_id)
            classeur = Classeur.objects.get(id=classeur_id)
            
            # Vérifiez si l'association existe déjà
            if ClasseurBook.objects.filter(book=book, classeur=classeur).exists():
                return Response({'error': 'This book is already in the selected classeur'}, status=status.HTTP_400_BAD_REQUEST)
            
            instance = ClasseurBook.objects.create(classeur=classeur, book=book)
            serializer = self.get_serializer(instance)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        except (Book.DoesNotExist, Classeur.DoesNotExist):
            return Response({'error': 'Book or Classeur not found'}, status=status.HTTP_404_NOT_FOUND)


    def list(self, request, classeur_id):
        documents = ClasseurBook.objects.filter(classeur_id=classeur_id)
        serializer = BookSerializer([doc.book for doc in documents], many=True)
        return Response(serializer.data)

    def destroy(self, request, document_id=None):
        # Vérifiez si le ClasseurBook existe avec le bon champ
        classeur_book = get_object_or_404(ClasseurBook, book_id=document_id)  # Remplacez `book_id` par le champ correct

        # Supprimez le ClasseurBook
        classeur_book.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)

    def delete_all(self, request):
        # Supprime tous les enregistrements de ClasseurBook
        deleted_count, _ = ClasseurBook.objects.all().delete()
        
        return Response({'detail': f'{deleted_count} classeurs ont été supprimés.'}, status=status.HTTP_204_NO_CONTENT)

@permission_classes([AllowAny])
class GlobalSearchView(APIView):
    def get(self, request, *args, **kwargs):
        query = request.GET.get('search', '')
        
        # Vérifie si la requête contient un terme de recherche
        if not query:
            return Response({'error': 'No query provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Normalisation de la requête (pour ignorer les accents et rendre en minuscules)
        normalized_query = unidecode(query.lower())
        
        # Recherche dans les livres
        books = [
            book for book in Book.objects.all()
            if normalized_query in unidecode(book.title.lower()) or
               normalized_query in unidecode(book.description.lower()) or
               normalized_query in unidecode(book.auteur.lower()) or
               normalized_query in unidecode(book.document_type.lower())
        ]
        book_serializer = BookSerializer(books, many=True, context={'request': request})
        
        # Recherche dans les catégories
        categories = [
            category for category in Category.objects.all()
            if normalized_query in unidecode(category.name.lower()) or
               normalized_query in unidecode(category.description.lower())
        ]
        category_serializer = CategorySerializer(categories, many=True, context={'request': request})
        
        # Recherche dans les sous-catégories
        sous_categories = [
            sous_category for sous_category in SousCategory.objects.all()
            if normalized_query in unidecode(sous_category.name.lower())
        ]
        sous_category_serializer = SousCategorySerializer(sous_categories, many=True, context={'request': request})
        
        # Compiler les résultats
        results = {
            'books': book_serializer.data,
            'categories': category_serializer.data,
            'sous_categories': sous_category_serializer.data,
        }

        return Response(results, status=status.HTTP_200_OK)

class NewsletterSignup(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = NewsletterSubscriberSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data.get('email')
            # Vérifie si l'email est déjà abonné
            if NewsletterSubscriber.objects.filter(email=email).exists():
                return Response({'detail': 'Email already subscribed.'}, status=status.HTTP_400_BAD_REQUEST)
            # Enregistrer l'email dans la base de données
            serializer.save()
            return Response({'detail': 'Subscribed successfully!'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['POST'])
# @permission_classes([AllowAny])
# def send_newsletter(request):
    # serializer = NewsletterSerializer(data=request.data)
    
    # if serializer.is_valid():
    #     subject = serializer.validated_data['subject']
    #     message = serializer.validated_data['message']
    #     from_email = settings.EMAIL_HOST_USER
        
    #     subscribers = NewsletterSubscriber.objects.all()
        
    #     for subscriber in subscribers:
    #         send_mail(
    #             subject,
    #             message,
    #             from_email,
    #             [subscriber.email], 
    #         )
        
    #     return Response({'message': 'Newsletter envoyée à tous les abonnés.'}, status=200)
    
    # return Response(serializer.errors, status=400)




