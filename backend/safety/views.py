from rest_framework import viewsets, permissions
from .models import ModerationTicket
from .serializers import ModerationTicketSerializer, ModerationActionSerializer
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
