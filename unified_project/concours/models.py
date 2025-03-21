from django.db import models
from django.contrib.auth.models import User  
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from pdf2image import convert_from_path
from django.conf import settings
import os
import sys
from django.conf import settings
from pdf2image.exceptions import PDFInfoNotInstalledError

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
    
class Ville(models.Model):
    """Modèle pour représenter une ville unique avec plusieurs arrondissements, département, et région."""
    name = models.CharField(max_length=100)
    departement = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    arrondissements = models.TextField(
        help_text="Séparer les arrondissements par une virgule.",
        blank=True,
        null=True
    )

    def __str__(self):
        return self.name

    def get_arrondissements_list(self):
        """Retourne une liste des arrondissements en les séparant par une virgule, ou une liste vide si aucun n'est défini."""
        if self.arrondissements:
            return [arr.strip() for arr in self.arrondissements.split(',')]
        return []

class University(models.Model):
    name = models.CharField(max_length=255)
    image = models.ImageField(_('Image'), upload_to=upload_to, default='posts/default.png')
    description = models.TextField(blank=True, null=True)
    # ville = models.ForeignKey(Ville, on_delete=models.CASCADE, related_name="University")
    def __str__(self):
        return self.name


class GrandEcole(models.Model):
    """Modèle pour représenter une Grande École liée à une université et à des concours."""
    name = models.CharField(max_length=255)
    image = models.ImageField(_('Image'), upload_to=upload_to, default='posts/default.png')
    university = models.ForeignKey(University, related_name='grandes_ecoles', on_delete=models.CASCADE,blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    # ville = models.ForeignKey(Ville, on_delete=models.CASCADE, related_name="grandes_ecoles", null=True, blank=True)
    def __str__(self):
        return self.name
    
    # def __str__(self):
    #     return f"{self.name} ({self.region}) - {self.departement}"

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
    views = models.IntegerField(default=0)  # Suivi des vues

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
        super().save(*args, **kwargs)  # Sauvegarde initiale du document

        # Éviter la conversion si le fichier n'est pas un PDF ou si un thumbnail existe déjà
        if not self.document.name.endswith('.pdf') or self.thumbnail:
            return

        # Désactiver la conversion dans les tests
        if "test" in sys.argv:
            return

        try:
            images = convert_from_path(self.document.path, first_page=1, last_page=1)
            image = images[0]

            # Chemin du thumbnail
            thumbnail_path = f'concours_thumbnails/{self.id}_thumbnail.jpg'
            full_thumbnail_path = os.path.join(settings.MEDIA_ROOT, thumbnail_path)

            # Sauvegarde de l'image
            image.save(full_thumbnail_path, 'JPEG')

            # Mettre à jour le champ `thumbnail`
            self.thumbnail = thumbnail_path
            super().save(update_fields=['thumbnail'])

        except PDFInfoNotInstalledError:
            print("⚠️ Poppler n'est pas installé, conversion PDF -> Thumbnail ignorée.")
        except Exception as e:
            print(f"❌ Erreur lors de la conversion du PDF en image: {e}")
            
# class EtablissementPrimaire(models.Model):
#     TYPE_CHOICES = [
#         ('publique', 'Publique'),
#         ('privee', 'Privée'),
#     ]
#     SYSTEM_CHOICES = [
#         ('fr', 'Français'),
#         ('en', 'Anglais'),
#     ]
    
#     nom = models.CharField(max_length=255)
#     logo = models.ImageField(upload_to='logos/', blank=True, null=True)
#     galerie = models.ImageField(upload_to='galerie/', blank=True, null=True)
#     type_sc = models.CharField(max_length=10, choices=TYPE_CHOICES)
#     system = models.CharField(max_length=5, choices=SYSTEM_CHOICES)
#     abbr = models.CharField(max_length=50, blank=True, null=True)

#     def __str__(self):
#         return self.nom

# class ClassePrimaire(models.Model):
#     etablissement = models.ForeignKey(EtablissementPrimaire, on_delete=models.CASCADE)
#     nom = models.CharField(max_length=255)
#     effectif = models.IntegerField()
#     success_percent = models.FloatField()
#     taux_ex_succes = models.FloatField()
#     system = models.CharField(max_length=50)
#     ville = models.ForeignKey(Ville, on_delete=models.CASCADE, related_name="etablissements_primaires", null=True, blank=True)
#     examen = models.OneToOneField('ExamenOfficiel', on_delete=models.CASCADE, null=True, blank=True)

#     def __str__(self):
#         return f"{self.nom} - {self.etablissement.nom}"

# class EtablissementScolaire(models.Model):
#     TYPE_CHOICES = [
#         ('publique', 'Publique'),
#         ('privee', 'Privée'),
#     ]
#     SYSTEM_CHOICES = [
#         ('fr', 'Français'),
#         ('en', 'Anglais'),
#     ]
#     GENRE_CHOICES = [
#         ('TECHNICIEN', 'Technicien'),
#         ('GENERALISTE', 'Généraliste'),
#         ('TECHNICIEN_GENERALISTE', 'Technicien & Généraliste'),
#     ]
    
#     nom = models.CharField(max_length=255)
#     abbr = models.CharField(max_length=50, blank=True, null=True)
#     logo = models.ImageField(upload_to='logos/', blank=True, null=True)
#     galerie = models.ImageField(upload_to='galerie/', blank=True, null=True)
#     type_sc = models.CharField(max_length=10, choices=TYPE_CHOICES)
#     system = models.CharField(max_length=5, choices=SYSTEM_CHOICES)
#     genre = models.CharField(max_length=25, choices=GENRE_CHOICES)
#     ville = models.ForeignKey(Ville, on_delete=models.CASCADE, related_name="etablissements_scolaires", null=True, blank=True)
    
#     def __str__(self):
#         return self.nom

# class AdresseEtablissement(models.Model):
#     etablissement_scolaire = models.ForeignKey(EtablissementScolaire, on_delete=models.CASCADE, null=True, blank=True)
#     etablissement_primaire = models.ForeignKey(EtablissementPrimaire, on_delete=models.CASCADE, null=True, blank=True)
#     University = models.ForeignKey(University, on_delete=models.CASCADE, null=True, blank=True)
#     grand_ecole = models.ForeignKey(GrandEcole, on_delete=models.CASCADE, null=True, blank=True)
#     ville = models.ForeignKey(Ville, on_delete=models.CASCADE, null=True, blank=True)  # Ajout du lien avec la ville
#     longitude = models.FloatField()
#     latitude = models.FloatField()

#     def __str__(self):
#         return f"{self.etablissement_scolaire or self.etablissement_primaire or self.universite or self.grand_ecole} - {self.ville}"


# class PersonnelEtablissement(models.Model):
#     SYSTEM_CHOICES = [
#         ('administratif', 'Administratif'),
#         ('enseignant', 'Enseignant'),
#     ]
#     TYPE_CHOICES = [
#         ('permanent', 'Permanent'),
#         ('contractuel', 'Contractuel'),
#     ]
    
#     etablissement_scolaire = models.ForeignKey(EtablissementScolaire, on_delete=models.CASCADE)
#     etablissement_primaire = models.ForeignKey(EtablissementPrimaire, on_delete=models.CASCADE)
#     annee = models.IntegerField()
#     poste = models.CharField(max_length=255)
#     system = models.CharField(max_length=15, choices=SYSTEM_CHOICES)
#     type_pc = models.CharField(max_length=15, choices=TYPE_CHOICES)

# class ClasseSecondaire(models.Model):
#     SPECIALITE_CHOICES = [
#         ('gen', 'Général'),
#         ('tec', 'Technique'),
#     ]
    
#     etablissement_scolaire = models.ForeignKey(EtablissementScolaire, on_delete=models.CASCADE)
#     nom = models.CharField(max_length=255)
#     effectif = models.IntegerField()
#     success_percent = models.FloatField()
#     taux_ex_succes = models.FloatField()
#     systeme = models.CharField(max_length=50)
#     specialite = models.CharField(max_length=10, choices=SPECIALITE_CHOICES)

#     def __str__(self):
#         return self.nom

# class SerieSpecialite(models.Model):
#     nom = models.CharField(max_length=255)
    
#     def __str__(self):
#         return self.nom

# class ExamenOfficiel(models.Model):
#     nom = models.CharField(max_length=255)
    
#     def __str__(self):
#         return self.nom

# class Niveau(models.Model):
#     CYCLE_CHOICES = [
#         ('primaire', 'Primaire'),
#         ('secondaire', 'Secondaire'),
#     ]
    
#     cycle = models.CharField(max_length=10, choices=CYCLE_CHOICES)
    
#     def __str__(self):
#         return self.cycle

# class Categorie(models.Model):
#     nom = models.CharField(max_length=255)
    
#     def __str__(self):
#         return self.nom

# # Relations Many-to-Many
# class ClasseSerie(models.Model):
#     classe = models.ForeignKey(ClasseSecondaire, on_delete=models.CASCADE)
#     serie = models.ForeignKey(SerieSpecialite, on_delete=models.CASCADE)

# class ClasseNiveau(models.Model):
#     classe = models.ForeignKey(ClasseSecondaire, on_delete=models.CASCADE)
#     niveau = models.ForeignKey(Niveau, on_delete=models.CASCADE)

# class ClasseExamen(models.Model):
#     classe = models.ForeignKey(ClasseSecondaire, on_delete=models.CASCADE)
#     examen = models.ForeignKey(ExamenOfficiel, on_delete=models.CASCADE)

# class Universite(models.Model):
#     nom = models.CharField(max_length=255)
    
#     def __str__(self):
#         return self.nom
