from rest_framework import viewsets, permissions, filters
from .models import Hotspot
from .serializers import HotspotSerializer, HotspotCreateSerializer
from rbac.permissions import IsHost, IsTraveler

class HotspotViewSet(viewsets.ModelViewSet):
    """
    Standard CRUD for Hotspots.
    - Public/Travelers: View Approved only.
    - Hosts: View Own + Create.
    - Admin/Mod: View All + Update Status.
    """
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'district', 'description']
    
    def get_queryset(self):
        user = self.request.user
        qs = Hotspot.objects.all()
        
        if user.is_anonymous:
            # Public/Kiosk view - Strictly Approved
            return qs.filter(status=Hotspot.Status.Approved)
            
        if user.role in ['ADMIN', 'SUPER_ADMIN', 'MODERATOR']:
            return qs
            
        if user.role == 'HOST':
            # Hosts see their own + approved (competitors/feed)
            return qs.filter(host=user) | qs.filter(status=Hotspot.Status.Approved)
            
        # Travelers
        return qs.filter(status=Hotspot.Status.Approved)

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return HotspotCreateSerializer
        return HotspotSerializer

    def perform_create(self, serializer):
        # Auto-assign host
        serializer.save(host=self.request.user)

    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            return [permissions.IsAuthenticated(), IsHost()]
        return [permissions.AllowAny()] # Read-only for public
