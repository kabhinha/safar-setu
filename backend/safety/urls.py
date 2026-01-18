from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ModerationTicketViewSet

router = DefaultRouter()
router.register(r'tickets', ModerationTicketViewSet, basename='ticket')

urlpatterns = [
    path('', include(router.urls)),
]
