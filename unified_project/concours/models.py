from django.db import models
from django.contrib.auth.models import User  
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from pdf2image import convert_from_path
import os
from django.conf import settings

def upload_to(instance, filename):
    return f'posts/{filename}'

class Cycle(models.Model):
    """Modèle pour représenter un cycle (Licence, Master, Doctorat, etc.)."""
    name = models.CharField(max_length=50)
    description = models.TextField()

    def __str__(self):
        return self.name

class ConcoursCategory(models.Model):
    """Représente les types de concours : Privé, Public, Professionnel."""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(_('Image'), upload_to=upload_to, default='posts/default.png')
    description_plus = models.TextField(blank=True, null=True)
    def __str__(self):
        return self.name


class ConcoursSubCategory(models.Model):
    """Représente les sous-catégories de concours, comme Enseignant, Médecine, etc."""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    categories = models.ManyToManyField(ConcoursCategory, related_name='subcategories')
    image = models.ImageField(_('Image'), upload_to=upload_to, default='posts/default.png')

    def __str__(self):
        return self.name


class University(models.Model):
    name = models.CharField(max_length=255)
    image = models.ImageField(_('Image'), upload_to=upload_to, default='posts/default.png')
    description = models.TextField(blank=True, null=True)
    def __str__(self):
        return self.name


class GrandEcole(models.Model):
    """Modèle pour représenter une Grande École liée à une université et à des concours."""
    name = models.CharField(max_length=255)
    image = models.ImageField(_('Image'), upload_to=upload_to, default='posts/default.png')
    university = models.ForeignKey(University, related_name='grandes_ecoles', on_delete=models.CASCADE,blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    def __str__(self):
        return self.name


class Ville(models.Model):
    """Modèle pour représenter une ville unique avec plusieurs arrondissements, département, et région."""
    name = models.CharField(max_length=100)
    departement = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    arrondissements = models.TextField(
        help_text="Séparer les arrondissements par une virgule.",
        blank=True,  # Permettre des valeurs vides
        null=True    # Permettre la valeur NULL en base de données
    )

    def __str__(self):
        return f"{self.name} ({self.region}) - {self.departement}"

    def get_arrondissements_list(self):
        """Retourne une liste des arrondissements en les séparant par une virgule, ou une liste vide si aucun n'est défini."""
        if self.arrondissements:
            return [arr.strip() for arr in self.arrondissements.split(',')]
        return []


class NiveauMinimum(models.Model):
    """Niveau minimum requis pour participer à un concours."""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class NiveauObtenue(models.Model):
    """Niveau obtenu après avoir réussi un concours."""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class Concours(models.Model):
    category = models.ForeignKey(ConcoursCategory, on_delete=models.CASCADE, null=True, blank=True)
    subcategory = models.ForeignKey(ConcoursSubCategory, on_delete=models.CASCADE, related_name='concours_set', null=True, blank=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    concours_date = models.DateField(blank=True, null=True)
    concours_publication = models.DateField(blank=True, null=True)
    image = models.ImageField(_('Image'), upload_to=upload_to, default='posts/default.png')
    is_published = models.BooleanField(default=False)
    grandes_ecoles = models.ManyToManyField(GrandEcole, related_name='concours', blank=True)  # Suppression de null=True
    villes = models.ManyToManyField(Ville, related_name='concours')
    niveau_minimum = models.ManyToManyField(NiveauMinimum, related_name='concours_requis', blank=True)  # Suppression de null=True
    niveau_obtenu = models.ManyToManyField(NiveauObtenue, related_name='concours_obtenu', blank=True)  # Suppression de null=True
    cycles = models.ManyToManyField(Cycle, related_name='concours', blank=True)  # Suppression de null=True

    def __str__(self):
        return self.name



class ConcoursInstance(models.Model):
    concours = models.ForeignKey(Concours, related_name='instances', on_delete=models.CASCADE)
    concours_date = models.DateField()

    def __str__(self):
        return f"{self.concours.name} on {self.concours_date}"


class Testimonial(models.Model):
    name = models.CharField(max_length=100)
    content = models.TextField()
    image = models.ImageField(_('Image'), upload_to=upload_to, default='posts/default.png')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class SearchHistory(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="search_histories",
        null=True, blank=True  # Permet de rendre optionnelle une recherche globale
    )
    query = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)


class ConcoursDocument(models.Model):
    concours = models.ForeignKey(Concours, related_name='documents', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    document = models.FileField(upload_to='concours_documents/')
    thumbnail = models.ImageField(upload_to='concours_thumbnails/', blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    cycle = models.ForeignKey(Cycle, on_delete=models.CASCADE, related_name='documents', null=True, blank=True)
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.document.name.endswith('.pdf') and not self.thumbnail:
            images = convert_from_path(self.document.path, first_page=1, last_page=1)
            image = images[0]
            thumbnail_path = f'concours_thumbnails/{self.id}_thumbnail.jpg'
            image.save(os.path.join(settings.MEDIA_ROOT, thumbnail_path), 'JPEG')
            self.thumbnail = thumbnail_path
            super().save(update_fields=['thumbnail'])
