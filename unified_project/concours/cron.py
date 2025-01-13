from django_cron import CronJobBase, Schedule
from .models import Concours
from django.utils import timezone

class PublishConcoursCronJob(CronJobBase):
    RUN_EVERY_MINS = 1440 

    schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
    code = 'concours.publish_concours_cron_job' 

    def do(self):
        today = timezone.now().date()
        concours_to_publish = Concours.objects.filter(concours_date=today, is_published=False)
        concours_to_publish.update(is_published=True)