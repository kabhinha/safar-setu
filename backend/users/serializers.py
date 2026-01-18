from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import InviteCode

User = get_user_model()

class InviteCodeSerializer(serializers.Serializer):
    invite_code = serializers.CharField(required=True)

class UserSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

    def create(self, validated_data):
        password = validated_data.pop('password')
        
        # Create User (Inactive)
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            role=User.Role.TRAVELER, # Default to Traveler, verified/upgraded later
            is_active=False
        )
        user.set_password(password)
        user.save()
        
        return user

class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    code = serializers.CharField(max_length=6, required=True)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role', 'kyc_status')
        read_only_fields = ('username', 'email', 'role', 'kyc_status')
