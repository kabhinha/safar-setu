from rest_framework import serializers
from .models import ModerationTicket

class ModerationTicketSerializer(serializers.ModelSerializer):
    reported_by = serializers.StringRelatedField()
    assigned_to = serializers.StringRelatedField()
    
    class Meta:
        model = ModerationTicket
        fields = '__all__'
        read_only_fields = ('reported_by', 'status', 'created_at')

class ModerationActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModerationTicket
        fields = ('status', 'assigned_to')
