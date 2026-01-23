from rest_framework import serializers
from .models import Hotspot, Media, Review, ModerationTicket

class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ('id', 'file', 'type', 'is_cover', 'compliance_checked', 'compliance_notes')
        read_only_fields = ('compliance_checked', 'compliance_notes')

class ReviewSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField()
    class Meta:
        model = Review
        fields = '__all__'

# --- Public / Kiosk Serializers ---
class HotspotPublicSerializer(serializers.ModelSerializer):
    """Safe for public API consumption"""
    media = MediaSerializer(many=True, read_only=True)
    host_name = serializers.CharField(source='host.username', read_only=True)

    class Meta:
        model = Hotspot
        fields = (
            'id', 'name', 'short_description', 'description', 
            'district', 'village_cluster_label', 'sensitivity_level',
            'duration_minutes', 'operating_hours', 'seasons', 'tags',
            'media', 'host_name', 'safety_notes', 'created_at'
        )
        # Excludes: moderation_notes, internal status (always LIVE), approved_by

# --- Host Serializers ---
class HotspotHostSerializer(serializers.ModelSerializer):
    media = MediaSerializer(many=True, read_only=True)
    
    class Meta:
        model = Hotspot
        fields = '__all__'
        read_only_fields = ('host', 'status', 'moderation_notes', 'approved_by', 'pk')

class HotspotCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotspot
        fields = (
            'id', 'name', 'short_description', 'description', 
            'district', 'village_cluster_label', 
            'sensitivity_level', 'duration_minutes', 'operating_hours', 
            'seasons', 'tags', 'safety_notes', 'accessibility_notes'
        )
        extra_kwargs = {
            'description': {'required': False, 'allow_blank': True},
            'district': {'required': False, 'allow_blank': True},
            'village_cluster_label': {'required': False, 'allow_blank': True},
            'short_description': {'required': False, 'allow_blank': True},
            'operating_hours': {'required': False, 'allow_blank': True},
            'tags': {'required': False},
            'safety_notes': {'required': False, 'allow_blank': True},
        }

# --- Moderator Serializers ---
class HotspotModeratorSerializer(serializers.ModelSerializer):
    media = MediaSerializer(many=True, read_only=True)
    host_info = serializers.SerializerMethodField()

    class Meta:
        model = Hotspot
        fields = '__all__'

    def get_host_info(self, obj):
        return {
            'username': obj.host.username,
            'email': obj.host.email,
            'kyc': obj.host.kyc_status
        }

class ModerationTicketSerializer(serializers.ModelSerializer):
    hotspot_name = serializers.CharField(source='hotspot.name', read_only=True)
    assigned_name = serializers.CharField(source='assigned_to.username', read_only=True)

    class Meta:
        model = ModerationTicket
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

