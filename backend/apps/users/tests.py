from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from users.models import InviteCode

User = get_user_model()

class AuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.invite = InviteCode.objects.create(
            code="TEST-INVITE",
            assigned_role=User.Role.TRAVELER,
            max_usage=1
        )

    def test_signup_success(self):
        data = {
            "username": "newuser",
            "email": "new@example.com",
            "password": "password123",
            "invite_code": "TEST-INVITE",
            "phone_number": "9999999999",
            "nationality": "INDIAN",
            "identity_type": "Aadhaar",
            "identity_value": "TESTID1234"
        }
        response = self.client.post('/api/v1/auth/signup/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="newuser").exists())

    def test_signup_invalid_invite(self):
        data = {
            "username": "baduser",
            "password": "password123",
            "email": "bad@example.com",
            "invite_code": "WRONG-CODE",
            "phone_number": "8888888888",
            "nationality": "INDIAN",
            "identity_type": "Aadhaar",
            "identity_value": "TESTID9999"
        }
        response = self.client.post('/api/v1/auth/signup/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_profile(self):
        # 1. Signup a user
        user = User.objects.create_user(
            username="testprofile",
            email="testprofile@example.com",
            password="password123",
            role=User.Role.TRAVELER
        )
        self.client.force_authenticate(user=user)

        # 2. Try to update name and email (email should be ignored/read-only)
        data = {
            "first_name": "Updated",
            "last_name": "Name",
            "email": "hacker@example.com", # Should NOT update
            "role": "ADMIN" # Should NOT update
        }
        
        response = self.client.patch('/api/v1/users/me/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # 3. Verify changes
        user.refresh_from_db()
        self.assertEqual(user.first_name, "Updated")
        self.assertEqual(user.last_name, "Name")
        self.assertEqual(user.email, "testprofile@example.com") # Unchanged
        self.assertEqual(user.role, User.Role.TRAVELER) # Unchanged
