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

# --- Kiosk Specific API ---
from django.core.signing import TimestampSigner
import json
import uuid

class PublicSightsViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Kiosk Sights Module API.
    - Filters: district_id, category
    - Returns: Coarse location only.
    """
    from .serializers import PublicSightSerializer
    serializer_class = PublicSightSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = Hotspot.objects.filter(
            status=Hotspot.Status.Live,
            hotspot_type=Hotspot.HotspotType.Sight,
        ).exclude(sensitivity_level=Hotspot.Sensitivity.Restricted)

        district = self.request.query_params.get('district_id') # Assuming internal use, or name
        # Often district might be passed as name if ID not enforced, but let's assume filtering by name for now per model
        district_name = self.request.query_params.get('district') # Flexible
        category = self.request.query_params.get('category')

        if district:
             # Logic if district was ID, but model has 'district' charfield. 
             # Assuming 'district' param matches model 'district' field.
             pass
        if district_name:
            qs = qs.filter(district__iexact=district_name)
        if category:
            qs = qs.filter(sights_category__iexact=category)
            
        return qs

from rest_framework.views import APIView
class QRTokenView(APIView):
    """
    Generates a short-lived signed token for QR Code deep-links.
    Stateless: Uses Django TimestampSigner.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        resource_type = request.data.get('resource_type', 'HOTSPOT')
        resource_id = request.data.get('resource_id')
        
        if not resource_id:
            return Response({'error': 'resource_id is required'}, status=400)

        # Context (optional logging)
        context = request.data.get('context', {})
        
        # Payload to sign
        payload = {
            't': resource_type,
            'id': resource_id,
            'ctx': context
        }
        
        signer = TimestampSigner()
        # Sign the payload (as JSON string)
        token = signer.sign_object(payload)
        
        # Deep link format (Mobile Web)
        # /m/sight/<id>?t=<token> OR /m/hotspot/<id>?t=<token>
        path_segment = 'sight' if resource_type == 'SIGHT' else 'hotspot'
        deep_link = f"/m/{path_segment}/{resource_id}?t={token}"

        return Response({
            'token': token,
            'expires_in_sec': 600, # Client should know, verification defaults to max_age
            'deep_link': deep_link
        })

