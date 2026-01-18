from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('users.urls')),
    path('api/v1/listings/', include('listings.urls')),
    path('api/v1/safety/', include('safety.urls')),
    path('api/v1/commerce/', include('commerce.urls')),
    path('api/v1/features/', include('features.urls')),
    path('api/v1/kiosk/', include('kiosk.urls')),
]
