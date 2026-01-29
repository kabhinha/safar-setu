from django.urls import path
from .views import (
    PublicBroadcastListView,
    AdminBroadcastListCreateView,
    AdminBroadcastDetailView,
    AdminBroadcastDeactivateView
)

urlpatterns = [
    path('public/broadcasts', PublicBroadcastListView.as_view(), name='public-broadcasts'),
    path('admin/broadcasts', AdminBroadcastListCreateView.as_view(), name='admin-broadcasts'),
    path('admin/broadcasts/<uuid:pk>', AdminBroadcastDetailView.as_view(), name='admin-broadcast-detail'),
    path('admin/broadcasts/<uuid:pk>/deactivate', AdminBroadcastDeactivateView.as_view(), name='admin-broadcast-deactivate'),
]
