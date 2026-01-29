import sys
import os
import django
from django.conf import settings
from pathlib import Path

# Fix paths similar to manage.py
sys.path.append(str(Path(__file__).resolve().parent))
sys.path.append(str(Path(__file__).resolve().parent / 'apps'))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from bookings.models import Inquiry

def check_latest_inquiry():
    try:
        latest = Inquiry.objects.latest('created_at')
        print(f"Latest Inquiry ID: {latest.id}")
        print(f"User: {latest.user}")
        print(f"Created At: {latest.created_at}")
        
    except Inquiry.DoesNotExist:
        print("No inquiries found.")

if __name__ == "__main__":
    check_latest_inquiry()
