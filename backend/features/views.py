from rest_framework import viewsets, permissions, serializers
from .models import FeatureFlag
from rbac.permissions import IsAdmin

class FeatureFlagSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeatureFlag
        fields = '__all__'

class FeatureFlagViewSet(viewsets.ModelViewSet):
    """
    Control System Features (Admin Only).
    """
    queryset = FeatureFlag.objects.all()
    serializer_class = FeatureFlagSerializer
    permission_classes = [IsAdmin]
