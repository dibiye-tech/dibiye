from rest_framework import serializers
from .models import Concours, ConcoursCategory, ConcoursSubCategory, University, Testimonial, ConcoursDocument, Cycle , GrandEcole, Ville  # Ajoutez ConcoursDocument
from rest_framework.reverse import reverse

class CycleSerializer(serializers.ModelSerializer):
    """ Sérialiseur pour le modèle Cycle """
    class Meta:
        model = Cycle
        fields = ['id', 'name', 'description']

class GrandEcoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = GrandEcole
        fields = ['id', 'name', 'image', 'description', 'university']

class ConcoursSerializer(serializers.HyperlinkedModelSerializer):
    category = serializers.HyperlinkedRelatedField(
        view_name='concourscategory-detail',
        read_only=True
    )
    subcategory = serializers.HyperlinkedRelatedField(
        view_name='concourssubcategory-detail',
        read_only=True
    )
    university = serializers.HyperlinkedRelatedField(
        view_name='university-detail',
        read_only=True
    )
    cycles = CycleSerializer(many=True, read_only=True)  # Cycles associés
    ville = serializers.HyperlinkedRelatedField(
        view_name='ville-detail',
        read_only=True
    )
    grandes_ecoles = GrandEcoleSerializer(many=True, read_only=True)  # Ajout des grandes écoles

    # Champs personnalisés
    category_description_plus = serializers.SerializerMethodField()
    concours_description = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()  # Nouveau champ

    class Meta:
        model = Concours
        fields = (
            'url', 'id', 'name', 'description', 'concours_date', 'concours_publication',
            'image', 'is_published', 'category', 'subcategory', 'university', 
            'cycles', 'ville', 'grandes_ecoles', 'category_description_plus', 
            'concours_description', 'category_name'  # Ajout de 'category_name'
        )

    def get_category_description_plus(self, obj):
        """Retourne description_plus de la catégorie, si disponible"""
        return obj.category.description_plus if obj.category else None

    def get_concours_description(self, obj):
        """Retourne la description du concours"""
        return obj.description

    def get_category_name(self, obj):
        """Retourne le nom de la catégorie"""
        return obj.category.name if obj.category else None


class GrandEcoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = GrandEcole
        fields = ['id', 'name', 'image', 'description', 'university']


class VilleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ville
        fields = ['id', 'name', 'departement', 'region', 'arrondissements']


class ConcoursCategorySerializer(serializers.HyperlinkedModelSerializer):
    subcategories = serializers.HyperlinkedRelatedField(
        many=True,
        view_name='concourssubcategory-detail',
        read_only=True
    )

    class Meta:
        model = ConcoursCategory
        fields = ('url', 'id', 'name', 'description', 'image', 'subcategories','description_plus')


class ConcoursSubCategorySerializer(serializers.HyperlinkedModelSerializer):
    categories = ConcoursCategorySerializer(many=True, read_only=True)
    concours_set = ConcoursSerializer(many=True, read_only=True)  # Inclure les concours associés
    category_names = serializers.SerializerMethodField()  # Champ personnalisé pour les noms de catégories

    class Meta:
        model = ConcoursSubCategory
        fields = ('url', 'id', 'name', 'description', 'categories', 'image', 'concours_set', 'category_names')

    def get_category_names(self, obj):
        return [category.name for category in obj.categories.all()]


class UniversitySerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()  # Ajoute le champ `id` en tant que champ en lecture seule

    class Meta:
        model = University
        fields = ['id', 'url', 'name', 'image', 'description']  # Incluez `id` et les autres champs ici
        extra_kwargs = {
            'url': {'view_name': 'university-detail'}
        }


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ['id', 'name', 'content', 'image', 'created_at']


# Nouveau sérialiseur pour le modèle ConcoursDocument
class ConcoursDocumentSerializer(serializers.ModelSerializer):
    """ Sérialiseur pour les documents associés aux concours """
    cycle = CycleSerializer(read_only=True)
    concours = serializers.HyperlinkedRelatedField(
        view_name='concours-detail',
        read_only=True
    )

class Meta:
        model = ConcoursDocument
        fields = ['id', 'title', 'document', 'thumbnail', 'uploaded_at', 'concours', 'cycle']



# Sérialiseurs pour l'exportation Elasticsearch
class ConcoursESSerializer(serializers.Serializer):
    id = serializers.CharField() 
    name = serializers.CharField()
    description = serializers.CharField()
    category = serializers.CharField()
    subcategory = serializers.CharField()
    university = serializers.CharField()
    image = serializers.CharField()


class ConcoursCategoryESSerializer(serializers.Serializer):
    id = serializers.CharField() 
    name = serializers.CharField()
    description = serializers.CharField(required=False, allow_blank=True) 
    image = serializers.CharField()


class ConcoursSubCategoryESSerializer(serializers.Serializer):
    id = serializers.CharField() 
    name = serializers.CharField()
    description = serializers.CharField(required=False, allow_blank=True) 
    image = serializers.CharField()


class UniversityESSerializer(serializers.Serializer):
    id = serializers.CharField()  
    name = serializers.CharField()
    autocomplete = serializers.ListField(child=serializers.CharField(), required=False)
    image = serializers.CharField()
