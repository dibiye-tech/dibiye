from django.contrib import admin
from .models import User, Category, SousCategory, Book, Comment, History, Favorite, Classeur, ClasseurBook, Branche, Rating
from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import send_mail
from django.conf import settings
from .models import Newsletter, NewsletterSubscriber


class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('email', 'username', 'is_active',
                    'is_deactivated', 'is_staff', 'is_superuser')

class CommentAdmin(admin.ModelAdmin):
    list_display = ['content', 'user', 'book', 'created_at']

    def get_form(self, request, obj=None, change=False, **kwargs):
        form = super().get_form(request, obj, change, **kwargs)
        try:
            if obj and obj.user is None:
                obj.user = None
        except ObjectDoesNotExist:
            pass
        return form

def send_newsletter_to_subscribers(modeladmin, request, queryset):
    # Récupérer tous les abonnés
    subscribers = NewsletterSubscriber.objects.all()

    for newsletter in queryset:
        # Vérifier si la newsletter a déjà été envoyée
        if newsletter.sent:
            modeladmin.message_user(request, f"La newsletter '{newsletter.subject}' a déjà été envoyée.")
            continue

        for subscriber in subscribers:
            try:
                send_mail(
                    newsletter.subject,
                    newsletter.message,
                    settings.EMAIL_HOST_USER,
                    [subscriber.email],  # L'email du destinataire
                )
            except Exception as e:
                modeladmin.message_user(request, f"Erreur lors de l'envoi à {subscriber.email}: {str(e)}", level="error")

        # Mettre à jour l'état de la newsletter comme envoyée
        newsletter.sent = True
        newsletter.save()

    modeladmin.message_user(request, "La newsletter a été envoyée à tous les abonnés.")

send_newsletter_to_subscribers.short_description = "Envoyer la newsletter aux abonnés"

class NewsletterAdmin(admin.ModelAdmin):
    list_display = ('subject', 'sent', 'date_sent')
    actions = [send_newsletter_to_subscribers]

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
admin.site.register(NewsletterSubscriber)
admin.site.register(Newsletter, NewsletterAdmin)
admin.site.register(Rating)