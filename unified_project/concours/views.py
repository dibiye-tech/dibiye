from rest_framework import viewsets
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from datetime import datetime
import unicodedata
import logging
from django.db import OperationalError
from collections.abc import Iterable 
from django.shortcuts import get_object_or_404
from django_filters import rest_framework as django_filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from .models import Concours, ConcoursCategory, ConcoursSubCategory, University, Testimonial, SearchHistory, ConcoursDocument, Ville
from .serializers import ConcoursSerializer, ConcoursCategorySerializer, ConcoursSubCategorySerializer, UniversitySerializer, TestimonialSerializer, VilleSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
from django.db.models import Q
from .models import ConcoursDocument  # Importez votre modèle
from .serializers import ConcoursDocumentSerializer  # Importez votre serializer
from .models import University, GrandEcole
from .serializers import UniversitySerializer, GrandEcoleSerializer
from rest_framework.decorators import action
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from datetime import timedelta
from django.utils.timezone import now
logger = logging.getLogger(__name__)


@permission_classes([AllowAny])
class ConcoursPagination(LimitOffsetPagination):
    default_limit = 3
    max_limit = 3
    permission_classes = [AllowAny]

class UniversityPagination(LimitOffsetPagination):
    default_limit = 20
    max_limit = 20
    permission_classes = [AllowAny]

class SmallResultsSetPagination(PageNumberPagination):
    page_size = 10 
    permission_classes = [AllowAny]

class ConcoursFilter(django_filters.FilterSet):
    university = django_filters.CharFilter(field_name='university__name')
    permission_classes = [AllowAny]

    class Meta:
        model = Concours
        fields = ['university']

class PublishedConcoursViewSet(viewsets.ModelViewSet):
    serializer_class = ConcoursSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        # Récupérer les 5 concours les plus récents
        latest_concours = Concours.objects.filter(is_published=True).order_by('-concours_date')[:5]

        # Récupérer les 5 concours les plus populaires (avec le plus de vues)
        popular_concours = Concours.objects.filter(is_published=True).order_by('-views')[:5]

        # Fusionner les deux listes sans supprimer les doublons
        concours_combined = list(latest_concours) + [concours for concours in popular_concours if concours not in latest_concours]

        return concours_combined

class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all().order_by('-created_at')
    serializer_class = TestimonialSerializer
    permission_classes = [AllowAny]
    def partial_update(self, request, pk=None):
        try:
            testimonial = self.get_object()
        except Testimonial.DoesNotExist:
            raise NotFound(detail="The requested Testimonial does not exist.")
        
        serializer = self.get_serializer(testimonial, data=request.data, partial=True)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.save()
        return Response(serializer.data)
      

class GrandeEcoleListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        university_id = request.query_params.get('university_id')
        if not university_id:
            return Response({"error": "university_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        grandes_ecoles = GrandEcole.objects.filter(university_id=university_id)
        serializer = GrandEcoleSerializer(grandes_ecoles, many=True)
        return Response(serializer.data)
        
    
class ConcoursViewSet(viewsets.ModelViewSet):
    queryset = Concours.objects.all()
    serializer_class = ConcoursSerializer
    permission_classes = [AllowAny]
    def retrieve(self, request, pk=None):
        try:
            concours = self.get_object()  # Récupérer l'objet par ID
            serializer = self.get_serializer(concours)
            return Response(serializer.data)
        except Concours.DoesNotExist:
            raise NotFound(detail="Le concours demandé n'existe pas.")
           

class ConcoursDetailView(generics.RetrieveAPIView):
    queryset = Concours.objects.all()
    serializer_class = ConcoursSerializer
    permission_classes = [AllowAny] 

    def retrieve(self, request, pk=None):
        try:
            concours = self.get_object()
            serializer = self.get_serializer(concours)
            return Response(serializer.data)
        except Concours.DoesNotExist:
            raise NotFound(detail="Le concours demandé n'existe pas.")
            
class ConcoursCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ConcoursCategory.objects.all().order_by('-id')
    pagination_class = SmallResultsSetPagination
    serializer_class = ConcoursCategorySerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['name']
    search_fields = ['name', 'description']
    permission_classes = [AllowAny] 

    def retrieve(self, request, pk=None):
        logger.debug(f"Trying to retrieve ConcoursCategory with ID: {pk}")
        try:
            concours_category = self.get_object()
            serializer = self.get_serializer(concours_category)
            logger.debug(f"Retrieved ConcoursCategory: {serializer.data}")
            return Response(serializer.data)
        except ConcoursCategory.DoesNotExist:
            logger.error("La catégorie demandée n'existe pas.")
            raise NotFound(detail="La catégorie demandée n'existe pas.")
          

class ConcoursSubCategoryViewSet(viewsets.ModelViewSet):
    serializer_class = ConcoursSubCategorySerializer
    pagination_class = SmallResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['name', 'categories__id']  # Vous filtrez par ID de catégorie
    search_fields = ['name', 'categories__name']   # Vous permettez la recherche par nom de sous-catégorie et nom de catégorie
    permission_classes = [AllowAny]
    permission_classes = [AllowAny] 

    def get_queryset(self):
        category_id = self.request.query_params.get('category_id')
        queryset = ConcoursSubCategory.objects.all().order_by('-id')
        if category_id:
            # Filtrer uniquement les sous-catégories qui appartiennent à la catégorie spécifiée
            queryset = queryset.filter(categories__id=category_id)
        return queryset

    def retrieve(self, request, pk=None):
        """ Récupérer une sous-catégorie par son ID. """
        try:
            concours_subcategory = self.get_object()  # Cette méthode récupère l'objet par ID
            serializer = self.get_serializer(concours_subcategory)
            return Response(serializer.data)
        except ConcoursSubCategory.DoesNotExist:
            raise NotFound(detail="La sous-catégorie demandée n'existe pas.")

    def partial_update(self, request, pk=None):
        """ Mettre à jour partiellement une sous-catégorie. """
        try:
            concours_subcategory = self.get_object()
        except ConcoursSubCategory.DoesNotExist:
            raise NotFound(detail="La sous-catégorie demandée n'existe pas.")
        
        serializer = self.get_serializer(concours_subcategory, data=request.data, partial=True)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.save()
        return Response(serializer.data)


class UniversityViewSet(viewsets.ModelViewSet):
    """
    Vue pour gérer les opérations sur les universités, y compris la récupération des grandes écoles associées.
    """
    queryset = University.objects.all()
    serializer_class = UniversitySerializer     
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['name']
    search_fields = ['name']
    pagination_class = UniversityPagination
    permission_classes = [AllowAny] 
     

    @action(detail=True, methods=['get'], url_path='grandes-ecoles')
    def grandes_ecoles(self, request, pk=None):
        """
        Récupère les grandes écoles associées à une université donnée.
        """
        try:
            # Récupérer l'université par son ID
            university = University.objects.get(pk=pk)
        except University.DoesNotExist:
            raise NotFound(detail="Université non trouvée")

        # Filtrer les grandes écoles associées à cette université
        grandes_ecoles = GrandEcole.objects.filter(university=university)
        
        # Sérialiser les grandes écoles
        serializer = GrandEcoleSerializer(grandes_ecoles, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def partial_update(self, request, pk=None):
        """
        Mettre à jour partiellement les informations d'une université.
        """
        try:
            university = self.get_object()
        except University.DoesNotExist:
            raise NotFound(detail="L'université demandée n'existe pas.")
        
        serializer = self.get_serializer(university, data=request.data, partial=True)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.save()
        return Response(serializer.data)

from unidecode import unidecode
from datetime import datetime
from rest_framework.response import Response
from rest_framework import status

from unidecode import unidecode
from datetime import datetime
from rest_framework.response import Response
from rest_framework import status

class SearchView(APIView):
    permission_classes = [AllowAny] 
    def get(self, request, *args, **kwargs):
        query = request.GET.get('q', '')
        if not query:
            return Response({'error': 'No query provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Normaliser la requête pour ignorer les accents
        normalized_query = unidecode(query.lower())

        # Recherche dans Concours
        concours_results = [
            concours for concours in Concours.objects.all()
            if normalized_query in unidecode(concours.name.lower()) or
               normalized_query in unidecode(concours.description.lower())
        ]
        concours_serializer = ConcoursSerializer(concours_results, many=True, context={'request': request})

        # Recherche dans Categories
        category_results = [
            category for category in ConcoursCategory.objects.all()
            if normalized_query in unidecode(category.name.lower())
        ]
        category_serializer = ConcoursCategorySerializer(category_results, many=True, context={'request': request})

        # Recherche dans Subcategories
        subcategory_results = [
            subcategory for subcategory in ConcoursSubCategory.objects.all()
            if normalized_query in unidecode(subcategory.name.lower())
        ]
        subcategory_serializer = ConcoursSubCategorySerializer(subcategory_results, many=True, context={'request': request})

        # Recherche dans Universities
        university_results = [
            university for university in University.objects.all()
            if normalized_query in unidecode(university.name.lower())
        ]
        university_serializer = UniversitySerializer(university_results, many=True, context={'request': request})

        # Recherche dans Villes
        ville_results = [
            ville for ville in Ville.objects.all()
            if normalized_query in unidecode(ville.name.lower())
        ]
        ville_serializer = VilleSerializer(ville_results, many=True, context={'request': request})

        # Compiler les résultats
        results = {
            'concours': concours_serializer.data,
            'categories': category_serializer.data,
            'subcategories': subcategory_serializer.data,
            'universities': university_serializer.data,
            'ville': ville_serializer.data,
        }

        return Response(results, status=status.HTTP_200_OK)
        

class SearchHistoryView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):
        user = request.user
        if user.is_authenticated:
            history = SearchHistory.objects.filter(user=user).order_by('-timestamp')[:10]
        else:
            history = SearchHistory.objects.order_by('-timestamp')[:10]

        history_list = [{'query': item.query, 'timestamp': item.timestamp.isoformat()} for item in history]
        return Response({'history': history_list})

    def post(self, request, *args, **kwargs):
        user = request.user
        query = request.data.get('query', '')

        if user.is_authenticated:
            # Ajouter la recherche
            SearchHistory.objects.create(user=user, query=query)

            # Limiter à 10 entrées
            user_history = SearchHistory.objects.filter(user=user).order_by('-timestamp')
            if user_history.count() > 10:
                oldest = user_history[10:]
                oldest.delete()

        return Response({'message': 'Search query added to history.'}, status=status.HTTP_201_CREATED)



class ConcoursDocumentsListView(generics.ListAPIView):
    serializer_class = ConcoursDocumentSerializer
    permission_classes = [AllowAny] 

    def get_queryset(self):
        concours_id = self.kwargs['concours_id']
        return ConcoursDocument.objects.filter(concours_id=concours_id)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():
            raise NotFound(detail="No documents found for this concours.")
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class TestView(APIView):
    def get(self, request, concours_id):
        return Response({"message": f"Success! You accessed concours with ID {concours_id}."})
        permission_classes = [AllowAny] 
class SimpleTestView(APIView):
    def get(self, request):
        return Response({"message": "This is a simple test response."})
# class ConcoursDocumentDetailView(generics.RetrieveAPIView):

#     queryset = ConcoursDocument.objects.all()
#     serializer_class = ConcoursDocumentSerializer
#     lookup_field = 'id' 
class AllDocumentsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, concours_id):
        documents = ConcoursDocument.objects.filter(concours_id=concours_id)
        permission_classes = [AllowAny] 
        if not documents.exists():
            raise NotFound(detail="No documents found for this concours.")
        
        # Incluez la vignette et les informations de cycle dans les données renvoyées
        data = [
            {
                "title": doc.title,
                "url": doc.document.url,
                "thumbnail": doc.thumbnail.url if doc.thumbnail else None,
                "cycle": {
                    "name": doc.cycle.name,
                    "description": doc.cycle.description
                } if doc.cycle else None  # Vérifiez si un cycle est associé
            }
            for doc in documents
        ]
        return Response(data)
    
    from django.http import JsonResponse
from .models import University

class GrandesEcolesWithConcoursView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, university_id):
        university = get_object_or_404(University, id=university_id)
        grandes_ecoles = university.grandes_ecoles.all()

        data = []
        for ecole in grandes_ecoles:
            concours_list = [
                {
                    "concours_id": concours.id,
                    "concours_name": concours.name,
                    "concours_description": concours.description,
                    "concours_image": request.build_absolute_uri(concours.image.url) if concours.image else None,
                    "subcategory_id": concours.subcategory.id if concours.subcategory else None,
                    "subcategory_name": concours.subcategory.name if concours.subcategory else None,
                }
                for concours in ecole.concours.all()
            ]
            
            data.append({
                "ecole_id": ecole.id,
                "ecole_name": ecole.name,
                "ecole_image": request.build_absolute_uri(ecole.image.url) if ecole.image else None,
                "ecole_description": ecole.description,
                "concours": concours_list,
            })

        return Response(data)
#     from django.http import JsonResponse
# from .models import AdresseEtablissement


# class LocationListView(APIView):
#     permission_classes = [AllowAny]
    
#     def get(self, request):
#         locations = AdresseEtablissement.objects.select_related('ville').values(
#             'universite__name', 'grand_ecole__name', 'etablissement_scolaire__nom',
#             'etablissement_primaire__nom', 'ville__name', 'latitude', 'longitude'
#         )
        
#         data = []
#         for loc in locations:
#             data.append({
#                 "nom": loc.get("universite__name") or loc.get("grand_ecole__name") or 
#                         loc.get("etablissement_scolaire__nom") or loc.get("etablissement_primaire__nom"),
#                 "ville": loc.get("ville__name"),
#                 "latitude": loc.get("latitude"),
#                 "longitude": loc.get("longitude"),
#             })
        
#         return Response(data)
class TrendingConcoursView(APIView):
    """
    Vue qui récupère les concours en tendance :
    - Plus de 100 vues en 7 jours
    - Concours avec les dates de publication les plus récentes
    """
    permission_classes = [AllowAny]  

    def get(self, request):
        one_week_ago = now() - timedelta(days=7)

        # Récupérer les concours tendances (100+ vues en 7 jours)
        trending_concours = Concours.objects.filter(
            views__gt=100, concours_publication__gte=one_week_ago
        ).order_by('-views')

        # Récupérer les concours les plus récents
        recent_concours = Concours.objects.filter(
            concours_publication__gte=one_week_ago
        ).order_by('-concours_publication')

        # Fusionner les résultats sans doublons
        concours_set = set(trending_concours) | set(recent_concours)
        concours_list = sorted(concours_set, key=lambda x: (x.views, x.concours_publication), reverse=True)[:10]  

        if not concours_list:
            raise NotFound(detail="Aucun concours tendance trouvé.")

        serializer = ConcoursSerializer(concours_list, many=True)
        return Response(serializer.data)
    
class UpdateConcoursViews(APIView):
    """
    Vue API pour incrémenter le nombre de vues d'un concours.
    """
    permission_classes = [AllowAny]

    def post(self, request, concours_id):
        concours = get_object_or_404(Concours, id=concours_id)
        concours.views += 1  # Incrémente la vue
        concours.save(update_fields=["views"])  # Enregistre la mise à jour
        return Response({"message": "Vue enregistrée", "views": concours.views})