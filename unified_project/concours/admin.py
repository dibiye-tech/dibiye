from django.contrib import admin
from .models import (
    Concours, ConcoursCategory, ConcoursSubCategory, University,
    Testimonial, ConcoursDocument, GrandEcole, Ville,
    NiveauMinimum, NiveauObtenue, Cycle  # Ajout du modèle Cycle
)

class ConcoursAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'description', 'subcategory', 'concours_date','concours_publication','image', 'is_published')
    filter_horizontal = ('grandes_ecoles', 'villes', 'cycles')  # Pour les relations ManyToMany

admin.site.register(Concours, ConcoursAdmin)

class ConcoursCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'image','description_plus')

admin.site.register(ConcoursCategory, ConcoursCategoryAdmin)

class ConcoursSubCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'get_categories', 'image')

    def get_categories(self, obj):
        return ", ".join([category.name for category in obj.categories.all()])
    get_categories.short_description = 'Catégories'

admin.site.register(ConcoursSubCategory, ConcoursSubCategoryAdmin)

class UniversityAdmin(admin.ModelAdmin):
    list_display = ('name', 'description','image')

admin.site.register(University, UniversityAdmin)

class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('name', 'content', 'image', 'created_at')

admin.site.register(Testimonial, TestimonialAdmin)

class ConcoursDocumentAdmin(admin.ModelAdmin):
    list_display = ('concours', 'title', 'document', 'uploaded_at', 'thumbnail')

admin.site.register(ConcoursDocument, ConcoursDocumentAdmin)

class GrandEcoleAdmin(admin.ModelAdmin):
    list_display = ('name', 'university', 'description','image')

admin.site.register(GrandEcole, GrandEcoleAdmin)


class VilleAdmin(admin.ModelAdmin):
    list_display = ('name', 'get_arrondissements', 'departement', 'region')

    def get_arrondissements(self, obj):
        # Si vous utilisez JSONField, affichez la liste directement
        if isinstance(obj.arrondissements, list):
            return ", ".join(obj.arrondissements)
        
        # Si vous utilisez un TextField séparé par des virgules
        return ", ".join(obj.get_arrondissements_list())
    
    get_arrondissements.short_description = 'Arrondissements'

admin.site.register(Ville, VilleAdmin)



class NiveauMinimumAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')

admin.site.register(NiveauMinimum, NiveauMinimumAdmin)

class NiveauObtenueAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')

admin.site.register(NiveauObtenue, NiveauObtenueAdmin)

# Ajout du modèle Cycle dans l'admin
class CycleAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')

admin.site.register(Cycle, CycleAdmin)
