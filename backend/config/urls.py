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
    path('api/', include('reco.urls')), # Recommendation Engine (Exposed at /api/public/...)
    path('api/v1/', include('broadcasts.urls')), # Includes public/broadcasts and admin/broadcasts
    path('api/v1/bookings/', include('bookings.urls')),
]

# Admin Branding
admin.site.site_header = "SafarSetu Administration"
admin.site.site_title = "SafarSetu Admin"
admin.site.index_title = "System Management"

from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
