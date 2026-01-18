from django.urls import path
from .views import KioskHomeView

urlpatterns = [
    path('feed/', KioskHomeView.as_view(), name='kiosk_feed'),
]
