from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import SignupView, MeView, VerifyOTPView

urlpatterns = [
    path('auth/signup/', SignupView.as_view(), name='signup'),
    path('auth/verify/', VerifyOTPView.as_view(), name='verify_otp'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/me/', MeView.as_view(), name='users_me'),
]
