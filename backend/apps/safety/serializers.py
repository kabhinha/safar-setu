from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    ModerationTicket, 
    CrowdAggregate, 
    DistrictRestriction, 
    EmergencyContact
)

User = get_user_model()

class ModerationTicketSerializer(serializers.ModelSerializer):
    reported_by_name = serializers.ReadOnlyField(source='reported_by.username')
    assigned_to_name = serializers.ReadOnlyField(source='assigned_to.username')
    
    class Meta:
        model = ModerationTicket
        fields = [
            'id', 'content_type', 'object_id', 
            'reported_by', 'reported_by_name',
            'assigned_to', 'assigned_to_name',
            'reason', 'description', 'status', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'reported_by', 'created_at', 'updated_at']

class ModerationActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModerationTicket
        fields = ['status', 'assigned_to']

class CrowdAggregateSerializer(serializers.ModelSerializer):
    source = serializers.SerializerMethodField()
    
    class Meta:
        model = CrowdAggregate
        fields = ['density_state', 'timestamp', 'source']
        
    def get_source(self, obj):
        return "AGGREGATE"

class CrowdIngestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CrowdAggregate
        fields = ['district_id', 'hotspot_id', 'density_state', 'count_15min', 'timestamp', 'source_type']

    def validate(self, attrs):
        return attrs

class DistrictRestrictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DistrictRestriction
        fields = ['id', 'district_id', 'restriction_type', 'message', 'severity', 'start_at', 'end_at']

class EmergencyContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyContact
        fields = ['id', 'district_id', 'label', 'phone', 'alternate_phone', 'notes']
