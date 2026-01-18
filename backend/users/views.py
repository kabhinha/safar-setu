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

class MeView(generics.RetrieveUpdateAPIView):
    """
    Protected: Get Current User
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
