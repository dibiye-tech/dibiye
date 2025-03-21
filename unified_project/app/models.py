from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.conf import settings
from unidecode import unidecode



class User(AbstractUser):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_deactivated = models.BooleanField(default=False)
    photo = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    description = models.TextField(blank=True, null=True, max_length=50)
    subscribe_to_newsletter = models.BooleanField(default=False)

    # # Ajout de related_name pour éviter les conflits
    # groups = models.ManyToManyField(
    #     Group,
    #     related_name="custom_user_groups",  # Nom unique pour la relation inverse
    #     blank=True,
    # )
    # user_permissions = models.ManyToManyField(
    #     Permission,
    #     related_name="custom_user_permissions",  # Nom unique pour la relation inverse
    #     blank=True,
    # )


    def __str__(self):
        return self.username


class Category(models.Model):
    name = models.TextField()
    image = models.ImageField(upload_to='description/', blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    lien = models.URLField(max_length=200, null=True)

    def __str__(self):
        return self.name

class SousCategory(models.Model):
    name = models.CharField(max_length=255)
    category = models.ForeignKey(Category, related_name='sous_categories', on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Branche(models.Model):
    name = models.CharField(max_length=255)
    sous_category = models.ForeignKey(SousCategory, related_name='branches', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='description/', blank=True, null=True)
    description = models.CharField(max_length=255, null=False, default='Your default value here')

    def __str__(self):
        return self.name

class Book(models.Model):
    DOCUMENT_TYPES = (
        ('text', 'Text'),
        ('audio', 'Audio'),
        ('video', 'Video'),
        ('pdf', 'PDF'),
    )

    title = models.CharField(max_length=255)
    image = models.ImageField( upload_to="books/")
    description = models.TextField()
    auteur = models.CharField(max_length=50)
    contenu = models.TextField()
    document_type = models.CharField(max_length=10, choices=DOCUMENT_TYPES)
    file = models.FileField(upload_to='documents/')
    category = models.ForeignKey(Category, related_name='documents', on_delete=models.CASCADE, null=True, blank=True)
    sous_category = models.ForeignKey(SousCategory, related_name='documents', on_delete=models.CASCADE, null=True, blank=True)
    branche = models.ForeignKey(Branche, related_name='branches', on_delete=models.CASCADE, null=True, blank=True)
    domaine = models.CharField(max_length=20, null=True, blank=True)
    critere = models.CharField(max_length=20, null=True, blank=True)

    def __str__(self):
        return self.title

class Comment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, related_name='comments', on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.content

class History(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    document = models.ForeignKey(Book, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"History of {self.document.title}"

class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    document = models.ForeignKey(Book, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username}"

class Classeur(models.Model):
    name = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class ClasseurBook(models.Model):
    classeur = models.ForeignKey(Classeur, related_name='books', on_delete=models.CASCADE)
    book = models.ForeignKey(Book, related_name='classers', on_delete=models.CASCADE)

    class Meta:
        unique_together = ('classeur', 'book')

    def __str__(self):
        return f'{self.classeur.name} - {self.book.title}' 

class NewsletterSubscriber(models.Model):
    email = models.EmailField(unique=True)
    date_subscribed = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email

class Newsletter(models.Model):
    subject = models.CharField(max_length=200)
    message = models.TextField()
    date_sent = models.DateTimeField(null=True, blank=True)
    sent = models.BooleanField(default=False)

    def __str__(self):
        return self.subject

class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, related_name='ratings', on_delete=models.CASCADE)
    rating_value = models.IntegerField(choices=[(1, '1 étoile'), (2, '2 étoiles'), (3, '3 étoiles'), (4, '4 étoiles'), (5, '5 étoiles')])
    created_at = models.DateTimeField(auto_now_add=True)  # Date de la note

    def __str__(self):
        return f"Rating {self.rating_value} for {self.book.title} by {self.user.username}"


