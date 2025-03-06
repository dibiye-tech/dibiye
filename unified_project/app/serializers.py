from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer, UserSerializer as BaseUserSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model
from .models import User, Category, SousCategory, Book, Comment, History, Favorite, Classeur, ClasseurBook, Branche, NewsletterSubscriber
from rest_framework import serializers
from django.contrib.auth import authenticate


user = get_user_model()


class UserCreateSerializer(BaseUserCreateSerializer):

    class Meta(BaseUserCreateSerializer.Meta):
        fields = ['id', 'username', 'password', 'first_name', 'last_name',
                  'email'
                  , 'photo', 'description', 
                  ]

    def create(self, validated_data):

        user = super().create(validated_data)

        return user


class UserSerializer(BaseUserSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        fields = ['id', 'first_name', 'last_name', 'email', 'username',
                  'is_active', 'is_deactivated', 'photo', 'description']

    def validate(self, attrs):
        validated_attr = super().validate(attrs)
        username = validated_attr.get('username')

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise ValidationError("Utilisateur avec cet email non trouvé.")

        if user.is_deactivated:
            raise ValidationError("Compte désactivé.")
        if not user.is_active:
            raise ValidationError("Compte non activé.")

        return validated_attr


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'username', 'photo', 'description']

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        obj = self.user

        data.update({
            'id': obj.id, 'first_name': obj.first_name,
            'last_name': obj.last_name, 'email': obj.email,
            'username': obj.username,
            'is_active': obj.is_active,
            'is_deactivated': obj.is_deactivated,
            'description': obj.description,
        })

        return data

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'image', 'description', 'lien']

class SousCategorySerializer(serializers.ModelSerializer):
    category = CategorySerializer()

    class Meta:
        model = SousCategory
        fields = ['id', 'name', 'category']

class BrancheSerializer(serializers.ModelSerializer):
    sous_category = SousCategorySerializer()

    class Meta:
        model = Branche
        fields = ['id', 'name', 'image',  'sous_category']

class BookSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    sous_category = SousCategorySerializer()
    branche = BrancheSerializer()

    class Meta:
        model = Book
        fields = ['id', 'title', 'image', 'description', 'auteur', 'contenu', 'document_type', 'file', 'category', 'sous_category', 'branche']

class HistorySerializer(serializers.ModelSerializer):
    user = UserSerializer()
    document = BookSerializer()
    
    class Meta:
        model = History
        fields = ['id', 'user', 'document', 'timestamp']

class CommentCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = ['id', 'user', 'book', 'content', 'created_at', 'updated_at']

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    book = BookSerializer()

    class Meta:
        model = Comment
        fields = ['id', 'user', 'book', 'content', 'created_at', 'updated_at']

class FavoriteSerializer(serializers.ModelSerializer):
    document = serializers.PrimaryKeyRelatedField(queryset=Book.objects.all())  # Utiliser uniquement l'ID pour l'ajout
    document_details = serializers.SerializerMethodField()  # Ajouter un champ pour les détails du document

    class Meta:
        model = Favorite
        fields = ['id', 'document', 'document_details']  # Inclure le champ de détails

    def get_document_details(self, obj):
        return BookSerializer(obj.document).data  # Récupérer les détails du document

class ClasseurSerializer(serializers.ModelSerializer):

    class Meta:
        model = Classeur
        fields = ['id', 'name']

class ClasseurBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClasseurBook
        fields = '__all__'

class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ['email']

class NewsletterSerializer(serializers.Serializer):
    subject = serializers.CharField(max_length=255)
    message = serializers.CharField()

# class CustomUserLoginSerializer(serializers.Serializer):
#     email = serializers.EmailField()
#     password = serializers.CharField()

#     def validate(self, attrs):
#         email = attrs.get('email')
#         password = attrs.get('password')

#         if not email or not password:
#             raise serializers.ValidationError("Les deux champs email et mot de passe sont obligatoires")

#         try:
#             user = get_user_model().objects.get(email=email)
#         except get_user_model().DoesNotExist:
#             raise serializers.ValidationError("Aucun utilisateur trouvé avec cet email")

#         if not user.check_password(password):
#             raise serializers.ValidationError("Mot de passe incorrect")

#         return attrs