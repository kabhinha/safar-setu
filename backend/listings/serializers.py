from rest_framework import serializers
from .models import Hotspot, Media, Review

class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField()
    class Meta:
        model = Review
        fields = '__all__'

class HotspotSerializer(serializers.ModelSerializer):
    media = MediaSerializer(many=True, read_only=True)
    host = serializers.StringRelatedField() # Or nested profile
    
    class Meta:
        model = Hotspot
        fields = '__all__'
        read_only_fields = ('host', 'status', 'moderation_notes', 'created_at')

class HotspotCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotspot
        fields = ('name', 'description', 'district')
        # Explicitly excluding GPS logic as per constraints
