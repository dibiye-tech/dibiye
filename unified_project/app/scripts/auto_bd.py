import os
import django
from django.core.management import execute_from_command_line
from app.models import Book, Category, SousCategory  # Assurez-vous que c'est le bon modèle

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'your_project.settings')
django.setup()

# Chemin vers le dossier contenant les images
IMAGE_PATH = '/books'

# Liste de titres, descriptions, auteurs, types de documents, et fichiers
data = [
    {
        "title": "Introduction à la Mathématique",
        "description": "Une introduction aux concepts de base de la mathématique.",
        "auteur": "Jean Dupont",
        "contenu": "Contenu détaillé sur les mathématiques.",
        "document_type": 'text',
        "file": 'path/to/your/file1.pdf',
        "category_name": 'enseignements',
        "sous_category_name": 'Primaire',
    },
    {
        "title": "Histoire de la France",
        "description": "Un aperçu de l'histoire de France.",
        "auteur": "Marie Curie",
        "contenu": "Contenu détaillé sur l'histoire.",
        "document_type": 'pdf',
        "file": 'path/to/your/file2.pdf',
        "category_name": 'enseignements',
        "sous_category_name": 'Secondaire',
    },
    {
        "title": "Biologie 101",
        "description": "Les fondements de la biologie moderne.",
        "auteur": "Louis Pasteur",
        "contenu": "Contenu détaillé sur la biologie.",
        "document_type": 'audio',
        "file": 'path/to/your/file3.mp3',
        "category_name": 'enseignements',
        "sous_category_name": 'Supérieure',
    },
    # Ajoutez d'autres documents ici
]

def populate_db():
    for item in data:
        # Récupérer ou créer la catégorie
        category, created = Category.objects.get_or_create(name=item["category_name"])
        
        # Récupérer ou créer la sous-catégorie
        sous_category, created = SousCategory.objects.get_or_create(name=item["sous_category_name"])

        # Choisir une image de manière ordonnée
        image_file = os.path.join(IMAGE_PATH, os.listdir(IMAGE_PATH)[0])  # Choisissez la première image pour simplifier

        # Créer le document
        document = Book(
            title=item["title"],
            description=item["description"],
            image=image_file,
            auteur=item["auteur"],
            contenu=item["contenu"],
            document_type=item["document_type"],
            file=item["file"],
            category=category,
            sous_category=sous_category
        )
        document.save()

if __name__ == '__main__':
    populate_db()
