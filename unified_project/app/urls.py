from django.urls import path
from . import views
from .views import GlobalSearchView
from .views import CustomTokenObtainPairView
from .views import CategoryListCreateView, BookListCreateView, BookDetailView, CategoryRetrieveUpdateDestroyView, SousCategoryListCreateView, SousCategoryDetailView, RecentDocumentsView, DocumentsByCategoryView, DocumentsBySousCategoryView, UserUpdateView, CommentCreateView, CommentListView, HistoryViewSet, FavoriteViewSet, ClasseurViewSet, ClasseurBookViewSet, DocumentsByBrancheView


urlpatterns = [
    path('exists/', views.check_username_exists, name='exists'),
    path('categories/', CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', CategoryRetrieveUpdateDestroyView.as_view(), name='category-detail'),
    path('souscategories/', SousCategoryListCreateView.as_view(), name='souscategory-list-create'),
    path('souscategories/<int:pk>/', SousCategoryDetailView.as_view(), name='souscategory-detail'),
    path('documents', BookListCreateView.as_view(), name='documents'),
    path('documents/recent/', RecentDocumentsView.as_view(), name='recent-documents'),
    path('documents/category/<int:category_id>/', DocumentsByCategoryView.as_view(), name='documents-by-category'),
    path('documents/sous_category/<int:sous_category_id>/', DocumentsBySousCategoryView.as_view(), name='documents-by-sous-category'),
    path('documents/sous_category/<int:sous_category_id>/branche/<int:branche_id>/', DocumentsByBrancheView.as_view(), name='documents-by-branche'),
    path('user/update/', UserUpdateView.as_view(), name='user-update'),
    path('documents/<int:id>/', BookDetailView.as_view(), name='book-detail'),
    path('comments/<int:book_id>/', CommentListView.as_view(), name='comment-list'),
    path('history/', HistoryViewSet.as_view({'post': 'create', 'get': 'list'}), name='history'),  # Pour POST et GET
    path('history/delete/', HistoryViewSet.as_view({'delete': 'delete'}), name='delete_all_history'),  # DELETE tout l'historique
    path('history/<int:document_id>/', HistoryViewSet.as_view({'delete': 'destroy'}), name='delete_history_entry'),  # DELETE une entrée spécifique
    path('favorites/delete_all/', FavoriteViewSet.as_view({'delete': 'delete_all'}), name='favorite-delete-all'),
    path('favorites/', FavoriteViewSet.as_view({'post': 'create', 'get': 'list'}), name='favorite'),
    path('favorites/<int:document_id>/', FavoriteViewSet.as_view({'delete': 'destroy'}), name='delete_favorite_entry'),
    path('classeur/', ClasseurViewSet.as_view({'post': 'create', 'get' : 'list'}), name= 'classeur'),
    path('classeur/<int:pk>/', ClasseurViewSet.as_view({'delete': 'destroy'}), name='delete_classeur_entry'),
    path('classeurbook/', ClasseurBookViewSet.as_view({'post': 'create'}), name= 'classeur-book'),
    path('classeurbook/<int:classeur_id>/documents', ClasseurBookViewSet.as_view({'get': 'list'})),
    path('classeurbook/delete_all/', ClasseurBookViewSet.as_view({'delete': 'delete_all'}), name='classeurbook-delete-all'),
    path('classeurbook/<int:book_id>/', ClasseurBookViewSet.as_view({'delete': 'destroy'}), name='delete_classeurbook_entry'),
    path('search/', GlobalSearchView.as_view(), name='global-search'),
    path('comment/<int:book_id>/', CommentCreateView.as_view(), name='create_or_update_comment'),
    path('auth/jwt/create/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
]