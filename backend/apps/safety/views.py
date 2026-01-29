from rest_framework import viewsets, permissions, generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from .models import ModerationTicket, CrowdAggregate, DistrictRestriction, EmergencyContact
from .serializers import (
    ModerationTicketSerializer, ModerationActionSerializer,
    CrowdAggregateSerializer, CrowdIngestSerializer,
    DistrictRestrictionSerializer, EmergencyContactSerializer
)
from rbac.permissions import IsModerator

class ModerationTicketViewSet(viewsets.ModelViewSet):
    """
    Moderation Queue.
    - User: Create Report.
    - Moderator: View All, Resolve.
    """
    queryset = ModerationTicket.objects.all()
    serializer_class = ModerationTicketSerializer
    
    def get_permissions(self):
        if self.action in ['create']:
            return [permissions.IsAuthenticated()]
        return [IsModerator()] # Only mods can view list/update

    def perform_create(self, serializer):
        serializer.save(reported_by=self.request.user)

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return ModerationActionSerializer
        return ModerationTicketSerializer

# --- Safety & Crowd APIs ---

class CrowdAggregateIngestView(APIView):
    # This should be protected by a device key or admin token.
    # For now, we'll use IsAuthenticated or IsAdminUser as a placeholder
    # or a custom permission if 'device key' logic existed.
    permission_classes = [permissions.IsAuthenticated] 

    def post(self, request):
        serializer = CrowdIngestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PublicCrowdAggregateView(generics.ListAPIView):
    serializer_class = CrowdAggregateSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        # Latest aggregate per district/hotspot? 
        # Or just list recent ones?
        # Requirement: "Return { density_state, timestamp, source='AGGREGATE' }"
        # Usually we want the *current* state.
        # This view returns a list. The Kiosk might want just the latest.
        district_id = self.request.query_params.get('district_id')
        hotspot_id = self.request.query_params.get('hotspot_id')
        
        qs = CrowdAggregate.objects.all().order_by('-timestamp')
        
        if hotspot_id:
            qs = qs.filter(hotspot_id=hotspot_id)
        elif district_id:
            qs = qs.filter(district_id=district_id)
        
        # If we only want the LATEST status, we might need a different logic.
        # But returning a list of recent updates is also fine.
        # Let's limit to recent 10 to avoid dumping history.
        return qs[:10]

class PublicDistrictRestrictionView(generics.ListAPIView):
    serializer_class = DistrictRestrictionSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        district_id = self.request.query_params.get('district_id')
        now = timezone.now()
        qs = DistrictRestriction.objects.filter(start_at__lte=now, end_at__gte=now)
        
        if district_id:
            qs = qs.filter(district_id=district_id)
            
        return qs

class PublicEmergencyContactView(generics.ListAPIView):
    serializer_class = EmergencyContactSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        district_id = self.request.query_params.get('district_id')
        qs = EmergencyContact.objects.filter(active=True)
        
        if district_id:
            # Include global (null) and specific district
            qs = qs.filter(district_id__in=[None, '', district_id])
            
        return qs
