from rest_framework import serializers
from .models import Inquiry



class InquiryPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = [
            'id', 'phone', 'name', 'group_size', 'preferred_date', 'note',
            'resource_type', 'resource_id', 'reference_token', 'status'
        ]
        read_only_fields = ['id', 'reference_token', 'status']

    def create(self, validated_data):
        return super().create(validated_data)

class InquiryListSerializer(serializers.ModelSerializer):
    spot = serializers.SerializerMethodField()
    start_date = serializers.DateField(source='preferred_date')

    class Meta:
        model = Inquiry
        fields = ['id', 'status', 'start_date', 'spot', 'created_at']

    def get_spot(self, obj):
        from listings.models import Hotspot
        if obj.resource_id:
            try:
                # Assuming resource_id is the Hotspot ID
                spot = Hotspot.objects.get(id=obj.resource_id)
                return {
                    'title': spot.name,
                    'district': spot.district
                }
            except (Hotspot.DoesNotExist, ValueError):
                pass
        
        return {
            'title': 'General Inquiry',
            'district': 'Sikkim'
        }
