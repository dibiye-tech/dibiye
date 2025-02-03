from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views  # Importer tout le fichier views
from .views import (
    ConcoursViewSet, ConcoursCategoryViewSet, ConcoursSubCategoryViewSet, 
    UniversityViewSet, PublishedConcoursViewSet, TestimonialViewSet, 
    SearchView, SearchHistoryView, ConcoursDocumentsListView, ConcoursDetailView, 
    TestView, SimpleTestView, AllDocumentsView, GrandeEcoleListView,  GrandesEcolesWithConcoursView
)

router = DefaultRouter()
router.register(r'published_concours', PublishedConcoursViewSet, basename='publishedconcours')
router.register(r'concoursfonctionpubs', ConcoursViewSet, basename='concours')
router.register(r'concourscategories', ConcoursCategoryViewSet, basename='concourscategory')
router.register(r'testimonials', TestimonialViewSet, basename='testimonial')
router.register(r'concourssubcategories', ConcoursSubCategoryViewSet, basename='concourssubcategory')
router.register(r'universities', UniversityViewSet, basename='university')

urlpatterns = [
    path('', include(router.urls)),  # Inclure toutes les routes du routeur
    path('search/', SearchView.as_view(), name='search'),
    path('searchhistory/', SearchHistoryView.as_view(), name='searchhistory'),
    path('concours/documents/<int:concours_id>/', ConcoursDocumentsListView.as_view(), name='concours-documents-list'),
    path('test/simple/', SimpleTestView.as_view(), name='simple-test'),  # Route pour la vue simple
    path('test/concours/documents/<int:concours_id>/', TestView.as_view(), name='test-concours-documents'),
    path('concours/category/<int:pk>/', ConcoursCategoryViewSet.as_view({'get': 'retrieve'}), name='category-detail'),
    path('documents/<int:concours_id>/all/', AllDocumentsView.as_view(), name='all-documents'),
    path('grandecoles/', GrandeEcoleListView.as_view(), name='grandecoles-list'),
    path('concoursfonctionpubs/<int:id>/', ConcoursDetailView.as_view(), name='concours-detail'),
    path('universities/<int:university_id>/grandesecoles/', GrandesEcolesWithConcoursView.as_view(), name='get_grandes_ecoles_with_concours'),
]
