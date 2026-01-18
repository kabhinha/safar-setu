from rest_framework import viewsets, permissions
from .models import QRCode, Transaction
from rest_framework import serializers

class QRCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = QRCode
        fields = '__all__'

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'

class CommerceViewSet(viewsets.ModelViewSet):
    """
    QR Code Management for Hosts.
    """
    queryset = QRCode.objects.all()
    serializer_class = QRCodeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Hosts see their own
        return QRCode.objects.filter(host=self.request.user)

    def perform_create(self, serializer):
        serializer.save(host=self.request.user)
