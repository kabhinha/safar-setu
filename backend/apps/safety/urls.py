from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ModerationTicketViewSet,
    CrowdAggregateIngestView,
    PublicCrowdAggregateView,
    PublicDistrictRestrictionView,
    PublicEmergencyContactView
)

router = DefaultRouter()
router.register(r'tickets', ModerationTicketViewSet, basename='ticket')

urlpatterns = [
    path('', include(router.urls)),
    
    # Telemetry Ingest
    path('telemetry/crowd-aggregate', CrowdAggregateIngestView.as_view(), name='crowd-ingest'),
    
    # Public Kiosk APIs
    path('public/crowd', PublicCrowdAggregateView.as_view(), name='public-crowd'),
    path('public/restrictions', PublicDistrictRestrictionView.as_view(), name='public-restrictions'),
    path('public/emergency', PublicEmergencyContactView.as_view(), name='public-emergency'),
]
