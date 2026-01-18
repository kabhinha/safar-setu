from django.http import JsonResponse
from rest_framework import status

class KioskIsolationMiddleware:
    """
    Middleware to handle Kiosk-specific traffic.
    - If 'X-Kiosk-ID' is present, enforce Kiosk constraints.
    - Block access to personalized endpoints (users/me, wallet, etc.)
    """
    def __init__(self, get_response):
        self.get_response = get_response
        self.kiosk_restricted_paths = [
            '/api/v1/users/me/',
            '/api/v1/auth/signup/', # Kiosks don't sign up
            '/api/v1/bookings/',
        ]

    def __call__(self, request):
        kiosk_id = request.headers.get('X-Kiosk-ID')
        
        if kiosk_id:
            # Enforce restrictions
            path = request.path_info
            
            # 1. Block restricted paths
            for restricted in self.kiosk_restricted_paths:
                if path.startswith(restricted):
                     return JsonResponse(
                         {'detail': 'Action forbidden for Kiosk clients.'}, 
                         status=status.HTTP_403_FORBIDDEN
                     )
            
            # 2. Tag request (optional, for views to know)
            request.is_kiosk = True
        else:
            request.is_kiosk = False

        response = self.get_response(request)
        return response
