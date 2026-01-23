from django.urls import path
from .views import (
    CommerceInitiateView, CommerceScanView, 
    CommerceVendorTokenView, CommerceStatusView, CommerceProductListView
)

urlpatterns = [
    path('products/', CommerceProductListView.as_view(), name='product-list'),
    path('deals/initiate/', CommerceInitiateView.as_view(), name='deal-initiate'),
    path('deals/<uuid:deal_id>/status/', CommerceStatusView.as_view(), name='deal-status'),
    path('deals/<uuid:deal_id>/vendor-token/', CommerceVendorTokenView.as_view(), name='vendor-token'),
    path('scan/', CommerceScanView.as_view(), name='scan-token'),
]
