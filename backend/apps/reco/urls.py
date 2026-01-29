from django.urls import path
from .views import RecommendationPublicView, KioskRecommendationView, DistrictListView

urlpatterns = [
    path('public/recommendations/', RecommendationPublicView.as_view(), name='public-recommendations'),
    path('public/kiosk/discover/', KioskRecommendationView.as_view(), name='kiosk-discover'),
    path('public/districts/', DistrictListView.as_view(), name='public-districts'),
]
