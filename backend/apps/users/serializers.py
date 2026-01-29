from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import InviteCode

User = get_user_model()

class InviteCodeSerializer(serializers.Serializer):
    invite_code = serializers.CharField(required=True)

class UserSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    nationality = serializers.ChoiceField(choices=User.NATIONALITY_CHOICES, required=True)
    country = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    phone_number = serializers.CharField(required=True, min_length=10, max_length=15)
    identity_type = serializers.CharField(required=True)
    identity_value = serializers.CharField(required=True)
    address = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    invite_code = serializers.CharField(write_only=True, required=False, allow_blank=True)
    full_name = serializers.CharField(required=True, allow_blank=False)
    
    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'password',
            'nationality',
            'country',
            'phone_number',
            'identity_type',
            'identity_value',
            'address',
            'invite_code',
            'full_name',
        )

    def validate(self, attrs):
        nationality = attrs.get('nationality')
        country = attrs.get('country')
        phone = attrs.get('phone_number', '')
        invite_code = attrs.get('invite_code')
        full_name = (attrs.get('full_name') or '').strip()

        if nationality == 'FOREIGN' and not country:
            raise serializers.ValidationError({"country": "Country is required for foreign nationals."})

        if phone and not phone.isdigit():
            raise serializers.ValidationError({"phone_number": "Phone number must contain digits only."})

        if not full_name:
            raise serializers.ValidationError({"full_name": "Full name is required."})

        if invite_code:
            try:
                invite = InviteCode.objects.get(code=invite_code)
                if not invite.is_valid():
                    raise serializers.ValidationError({"invite_code": "Invite code is not valid or has expired."})
                attrs['invite_obj'] = invite
            except InviteCode.DoesNotExist:
                raise serializers.ValidationError({"invite_code": "Invalid invite code."})

        return attrs

    def create(self, validated_data):
        password = validated_data.pop('password')
        nationality = validated_data.pop('nationality', 'INDIAN')
        country = validated_data.pop('country', None)
        phone_number = validated_data.pop('phone_number', None)
        identity_type = validated_data.pop('identity_type', None)
        identity_value = validated_data.pop('identity_value', None)
        address = validated_data.pop('address', None)
        invite_obj = validated_data.pop('invite_obj', None)
        full_name = validated_data.pop('full_name', '').strip()
        validated_data.pop('invite_code', None)
        
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            role=invite_obj.assigned_role if invite_obj else User.Role.TRAVELER, # Default to Traveler, verified/upgraded later
            is_active=False,
            nationality=nationality,
            country=country,
            phone_number=phone_number,
            identity_type=identity_type,
            identity_value=identity_value,
            address=address
        )
        if full_name:
            parts = full_name.split(' ', 1)
            user.first_name = parts[0]
            if len(parts) > 1:
                user.last_name = parts[1]
        user.set_password(password)
        user.save()

        if invite_obj:
            invite_obj.current_usage += 1
            invite_obj.save()
        
        return user

class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    code = serializers.CharField(max_length=6, required=True)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role', 'kyc_status')
        read_only_fields = ('username', 'email', 'role', 'kyc_status')
