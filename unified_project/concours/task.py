from celery import shared_task
from .models import Concours
from datetime import date

@shared_task
def publish_concours():
    today = date.today()
    for exam in Concours.objects.filter(publication_date=today, is_published=False):
        exam.is_published = True
        exam.save()