import sys
import os
import json
from pathlib import Path

# Fix paths
sys.path.append(str(Path(__file__).resolve().parent))
sys.path.append(str(Path(__file__).resolve().parent / 'apps'))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.test import APIRequestFactory, force_authenticate
from bookings.views import UserInquiryListView
from django.contrib.auth import get_user_model
User = get_user_model()

def check_api():
    try:
        user = User.objects.get(username='ab') # Adjust username if needed
        print(f"Testing for user: {user.username}")
        
        factory = APIRequestFactory()
        request = factory.get('/api/v1/bookings/my-inquiries')
        force_authenticate(request, user=user)
        
        view = UserInquiryListView.as_view()
        response = view(request)
        
        print("Response Status:", response.status_code)
        print("Response Data:", json.dumps(response.data, default=str))

    except User.DoesNotExist:
        print("User 'ab' not found.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_api()
