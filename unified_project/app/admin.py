from django.contrib import admin
from .models import User, Category, SousCategory, Book, Comment, History, Favorite, Classeur, ClasseurBook, Branche
from django.core.exceptions import ObjectDoesNotExist


class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('email', 'username', 'is_active',
                    'is_deactivated', 'is_staff', 'is_superuser')

class CommentAdmin(admin.ModelAdmin):
    list_display = ['content', 'user', 'book', 'created_at']

    def get_form(self, request, obj=None, change=False, **kwargs):
        form = super().get_form(request, obj, change, **kwargs)
        try:
            if obj and obj.user is None:
                obj.user = None  # Handle user deletion case
        except ObjectDoesNotExist:
            pass  # Ignore the exception if the user doesn't exist
        return form

admin.site.register(User, CustomUserAdmin)
admin.site.register(Category)
admin.site.register(SousCategory)
admin.site.register(Book)
admin.site.register(Comment, CommentAdmin)
admin.site.register(History)
admin.site.register(Favorite)
admin.site.register(Classeur)
admin.site.register(ClasseurBook)
admin.site.register(Branche)