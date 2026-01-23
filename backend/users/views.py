from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
import random
from .serializers import UserSignupSerializer, UserSerializer, VerifyOTPSerializer

User = get_user_model()

class SignupView(generics.CreateAPIView):
    """
    Public Endpoint: Create User and Send OTP (Mock Email).
    """
    queryset = User.objects.all()
    serializer_class = UserSignupSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        # Generate 6-digit OTP
        otp = str(random.randint(100000, 999999))
        user.verification_code = otp
        user.save()
        
        # MOCK EMAIL SERVICE
        print(f"============================================")
        print(f" [EMAIL SERVICE] OTP for {user.email}: {otp}")
        print(f"============================================")

class VerifyOTPView(APIView):
    """
    Public Endpoint: Verify OTP and Activate User.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            code = serializer.validated_data['code']
            
            try:
                user = User.objects.get(email=email)
                if user.verification_code == code:
                    user.is_active = True
                    user.verification_code = None # Clear after use
                    user.save()
                    return Response({"message": "Account verified successfully. You may now login."}, status=status.HTTP_200_OK)
                else:
                    return Response({"error": "Invalid verification code."}, status=status.HTTP_400_BAD_REQUEST)
            except User.DoesNotExist:
                return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyInviteView(APIView):
    """
    Public Endpoint: Create/Activate User via Valid Invite Code.
    Enforces E04: Engagement Invite event.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        invite_code = request.data.get('invite_code')
        email = request.data.get('email')
        password = request.data.get('password')

        # 1. Validate Invite Code (Hardcoded for Pilot)
        # In a real system, this would check an InviteCode model
        VALID_CODES = ['SAFE-PILOT-2026', 'ADMIN-OVERRIDE', 'GOVT-TEST']
        
        if invite_code not in VALID_CODES:
             return Response({"message": "Invalid Government Invite Code."}, status=status.HTTP_403_FORBIDDEN)

        # 2. Check if user already exists
        if User.objects.filter(email=email).exists():
             return Response({"message": "Identity already registered. Please login."}, status=status.HTTP_400_BAD_REQUEST)

        # 3. Create User (Engaged ID)
        user = User.objects.create(
            username=email.split('@')[0], # Generate username handles
            email=email,
            is_active=True # Auto-active since invite is trusted
        )
        user.set_password(password)
        user.save()

        return Response({"message": "Identity initialized. Welcome to the pilot."}, status=status.HTTP_201_CREATED)

class MeView(generics.RetrieveUpdateAPIView):
    """
    Protected: Get Current User
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class GenerateConnectCodeView(APIView):
    """
    Authenticated Mobile User requests a 6-digit code for Kiosk.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        from .models import ConnectCode
        from django.utils import timezone
        import datetime

        # Generate unique 6-digit code
        while True:
            code = str(random.randint(100000, 999999))
            if not ConnectCode.objects.filter(code=code, is_used=False, expires_at__gt=timezone.now()).exists():
                break
        
        # Save Code (Valid for 2 Minutes)
        ConnectCode.objects.create(
            user=request.user,
            code=code,
            expires_at=timezone.now() + datetime.timedelta(minutes=2)
        )

        return Response({
            "code": code,
            "expires_in_seconds": 120,
            "formatted_code": f"{code[:3]}-{code[3:]}"
        }, status=status.HTTP_201_CREATED)
