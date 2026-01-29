import os
import sys
import django
from pathlib import Path

# Setup Path same as manage.py
sys.path.append(str(Path(__file__).resolve().parent / 'apps'))
sys.path.append(str(Path(__file__).resolve().parent.parent / 'services'))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

print("Django Setup Successful")

from broadcasts.models import BroadcastMessage
print("BroadcastMessage imported")
from safety.models import CrowdAggregate
print("CrowdAggregate imported")
from safety.views import CrowdAggregateIngestView
print("CrowdAggregateIngestView imported")
from broadcasts.urls import urlpatterns as b_urls
print("Broadcast URLS imported")
from safety.urls import urlpatterns as s_urls
print("Safety URLS imported")
