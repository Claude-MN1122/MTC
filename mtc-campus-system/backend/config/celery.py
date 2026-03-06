# Celery & Redis Configuration for MTC Campus System

from celery import Celery
from django.conf import settings
import os

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('mtc_campus')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps.
app.autodiscover_tasks()


@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')


# Additional Celery Beat Schedule (if needed)
app.conf.beat_schedule = {
    # Example: Daily meal statistics calculation
    # 'calculate-daily-meal-stats': {
    #     'task': 'meals.tasks.calculate_daily_stats',
    #     'schedule': crontab(hour=23, minute=59),
    # },
}

# Task serialization
app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='Africa/Harare',
    enable_utc=True,
)
