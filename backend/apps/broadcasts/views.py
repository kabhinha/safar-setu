from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import BroadcastMessage
from .serializers import BroadcastMessageSerializer

class PublicBroadcastListView(generics.ListAPIView):
    serializer_class = BroadcastMessageSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        district_id = self.request.query_params.get('district_id')
        now = timezone.now()
        qs = BroadcastMessage.objects.filter(
            is_active_override=True,
            start_at__lte=now,
            end_at__gte=now
        )
        
        if district_id:
            # Include global (null) and specific district
            qs = qs.filter(district_id__in=[None, '', district_id])
        else:
            # If no district specified, maybe just global? 
            # Or currently active global broadcasts.
            # Let's show global + all districts (or maybe just global?)
            # Project constraint: "district_id (nullable = global message)"
            # Let's return global if no district provided
            qs = qs.filter(district_id__isnull=True)
            
        return qs.order_by('-severity', '-created_at')

class AdminBroadcastListCreateView(generics.ListCreateAPIView):
    queryset = BroadcastMessage.objects.all()
    serializer_class = BroadcastMessageSerializer
    permission_classes = [permissions.IsAdminUser]

class AdminBroadcastDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BroadcastMessage.objects.all()
    serializer_class = BroadcastMessageSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_destroy(self, instance):
        # Soft delete or deactivate? Requirement says "deactivate" endpoint exists.
        # But destroy is standard.
        instance.delete()

class AdminBroadcastDeactivateView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        try:
            msg = BroadcastMessage.objects.get(pk=pk)
            msg.is_active_override = False
            msg.save()
            return Response({'status': 'deactivated'})
        except BroadcastMessage.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
