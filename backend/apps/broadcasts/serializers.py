from rest_framework import serializers
from .models import BroadcastMessage

class BroadcastMessageSerializer(serializers.ModelSerializer):
    is_active = serializers.BooleanField(read_only=True)

    class Meta:
        model = BroadcastMessage
        fields = [
            'id', 'district_id', 'category', 'title', 'message', 
            'severity', 'start_at', 'end_at', 'is_active', 
            'created_at'
        ]
