from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    HotspotPublicViewSet, HotspotHostViewSet, 
    HotspotModeratorViewSet, ModerationTicketViewSet,
    PublicSightsViewSet, QRTokenView
)

router = DefaultRouter()
# Public Route (Discovery)
router.register(r'hotspots', HotspotPublicViewSet, basename='public-hotspot')
router.register(r'public/sights', PublicSightsViewSet, basename='public-sights')

# Host Routes
router.register(r'host/hotspots', HotspotHostViewSet, basename='host-hotspot')

# Moderator Routes
router.register(r'mod/hotspots', HotspotModeratorViewSet, basename='mod-hotspot')
router.register(r'mod/tickets', ModerationTicketViewSet, basename='mod-ticket')

urlpatterns = [
    path('public/qr-token', QRTokenView.as_view(), name='public-qr-token'),
    path('', include(router.urls)),
]
