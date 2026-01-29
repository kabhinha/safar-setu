from django.test import TestCase
from rest_framework.test import APIClient, APIRequestFactory
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rbac.permissions import IsAdmin, IsHost

User = get_user_model()

class MockAdminView(APIView):
    permission_classes = [IsAdmin]
    def get(self, request):
        return Response({"status": "ok"})

class RbacTests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.admin_user = User.objects.create_user(username='admin', password='pw', role=User.Role.ADMIN)
        self.host_user = User.objects.create_user(username='host', password='pw', role=User.Role.HOST)
        self.traveler_user = User.objects.create_user(username='traveler', password='pw', role=User.Role.TRAVELER)
        
    def test_admin_access(self):
        view = MockAdminView.as_view()
        request = self.factory.get('/admin-only/')
        request.user = self.admin_user
        
        response = view(request)
        self.assertEqual(response.status_code, 200)

    def test_host_denied_admin(self):
        view = MockAdminView.as_view()
        request = self.factory.get('/admin-only/')
        request.user = self.host_user
        
        response = view(request)
        # Should be 403 Forbidden
        self.assertEqual(response.status_code, 403)
