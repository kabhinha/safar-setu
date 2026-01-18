from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from listings.models import Hotspot
from listings.serializers import HotspotSerializer
from core.middleware import KioskIsolationMiddleware
# Kiosk app specifically handles unauthenticated or Machine-Authenticated requests

class KioskHomeView(APIView):
    """
    Public feed for Kiosks.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        # Return top approved hotspots
        hotspots = Hotspot.objects.filter(status=Hotspot.Status.Approved)[:10]
        serializer = HotspotSerializer(hotspots, many=True)
        return Response({
            "message": "Welcome to Project X Kiosk",
            "featured": serializer.data
        })
