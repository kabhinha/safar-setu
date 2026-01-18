from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CommerceViewSet

router = DefaultRouter()
router.register(r'qrcodes', CommerceViewSet, basename='qrcode')

urlpatterns = [
    path('', include(router.urls)),
]
