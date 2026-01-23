from django.urls import path
from .views import RecommendationPublicView

urlpatterns = [
    path('public/recommendations/', RecommendationPublicView.as_view(), name='public-recommendations'),
]
