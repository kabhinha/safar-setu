from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Hotspot, ModerationTicket
from .serializers import (
    HotspotPublicSerializer, HotspotHostSerializer, HotspotCreateSerializer,
    HotspotModeratorSerializer, ModerationTicketSerializer
)
from .services import HotspotService
from rbac.permissions import IsHost, IsModerator, IsTraveler

# --- Public API (Kiosk/Traveler) ---
class HotspotPublicViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public discovery API.
    - SHOWS: Status = LIVE only.
    - HIDES: Restricted sensitive sites.
    """
    serializer_class = HotspotPublicSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'district', 'description', 'tags']

    def get_queryset(self):
        # Only Live hotspots
        qs = Hotspot.objects.filter(status=Hotspot.Status.Live)
        # Exclude Restricted sensitivity
        qs = qs.exclude(sensitivity_level=Hotspot.Sensitivity.Restricted)
        return qs

# --- Host API ---
class HotspotHostViewSet(viewsets.ModelViewSet):
    """
    Host Management API.
    - CREATE: Drafts.
    - EDIT: Drafts only.
    - SUBMIT: Action.
    """
    permission_classes = [permissions.IsAuthenticated, IsHost]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

    def get_queryset(self):
        return Hotspot.objects.filter(host=self.request.user)

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return HotspotCreateSerializer
        return HotspotHostSerializer

    def perform_create(self, serializer):
        HotspotService.create_draft(self.request.user, serializer.validated_data)

    def perform_update(self, serializer):
        # We override perform_update to use our service check
        # But DRF calls save(), so we might just call service in distinct action?
        # For simplicity, we adapt update to use service checks or do checking in Update
        # Using Service to update:
        instance = serializer.instance
        updated_instance = HotspotService.update_draft(instance, serializer.validated_data, self.request.user)
        # update serializer instance for response
        serializer.instance = updated_instance

    @action(detail=True, methods=['post'])
    def upload_media(self, request, pk=None):
        hotspot = self.get_object()
        file = request.FILES.get('file')
        
        if not file:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Check permissions/status (DRAFT or CHANGES_REQUESTED)
        if hotspot.status not in [Hotspot.Status.Draft, Hotspot.Status.ChangesRequested]:
             return Response({'error': 'Cannot add media to finalized listing'}, status=status.HTTP_400_BAD_REQUEST)
             
        from .models import Media # Local import to avoid circular if any
        media = Media.objects.create(
            hotspot=hotspot,
            file=file,
            type='IMAGE', # Default/Infer
            uploaded_by=request.user
        )
        return Response({'status': 'uploaded', 'id': media.id})

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        hotspot = self.get_object()
        try:
            HotspotService.submit_for_review(hotspot, request.user)
            return Response({'status': 'submitted', 'current_status': hotspot.status})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# --- Moderator API ---
class HotspotModeratorViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Moderator Dashboard API.
    - VIEW: Under Review, Reported, etc.
    - ACTIONS: Approve, Reject, RequestChanges, Publish.
    """
    permission_classes = [permissions.IsAuthenticated, IsModerator]
    serializer_class = HotspotModeratorSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'host__username']

    def get_queryset(self):
        # Mods see everything
        return Hotspot.objects.all().order_by('-updated_at')

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        hotspot = self.get_object()
        try:
            HotspotService.approve(hotspot, request.user)
            return Response({'status': 'approved'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def request_changes(self, request, pk=None):
        hotspot = self.get_object()
        notes = request.data.get('notes', 'Changes requested')
        try:
            HotspotService.request_changes(hotspot, request.user, notes)
            return Response({'status': 'changes_requested'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            
    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        hotspot = self.get_object()
        try:
            HotspotService.publish(hotspot, request.user)
            return Response({'status': 'live'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ModerationTicketViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsModerator]
    serializer_class = ModerationTicketSerializer
    
    def get_queryset(self):
        return ModerationTicket.objects.all().order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(assigned_to=self.request.user)

