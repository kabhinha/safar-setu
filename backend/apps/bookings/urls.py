from django.urls import path
from .views import PublicInquiryCreateView, UserInquiryListView

urlpatterns = [
    path('public/inquire', PublicInquiryCreateView.as_view(), name='public-inquiry-create'),
    path('my-inquiries', UserInquiryListView.as_view(), name='user-inquiry-list'),
]
