from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    HotspotPublicViewSet, HotspotHostViewSet, 
    HotspotModeratorViewSet, ModerationTicketViewSet
)

router = DefaultRouter()
# Public Route (Discovery)
router.register(r'hotspots', HotspotPublicViewSet, basename='public-hotspot')

# Host Routes
router.register(r'host/hotspots', HotspotHostViewSet, basename='host-hotspot')

# Moderator Routes
router.register(r'mod/hotspots', HotspotModeratorViewSet, basename='mod-hotspot')
router.register(r'mod/tickets', ModerationTicketViewSet, basename='mod-ticket')

urlpatterns = [
    path('', include(router.urls)),
]
