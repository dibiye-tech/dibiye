from django.apps import AppConfig


class ConcoursConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'concours'
def ready(self):
        import concours.task