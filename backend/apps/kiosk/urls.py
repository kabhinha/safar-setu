from django.urls import path
from .views import KioskHomeView, DiscoverView, KioskLoginView

urlpatterns = [
    path('feed/', KioskHomeView.as_view(), name='kiosk_feed'),
    path('discover/', DiscoverView.as_view(), name='kiosk_discover'),
    path('login/', KioskLoginView.as_view(), name='kiosk_login'),
]
