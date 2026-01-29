from django.http import JsonResponse
from rest_framework import status

class RbacEnforcementMiddleware:
    """
    Global Safety Net.
    - blocks /admin/ path for non-admins.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        path = request.path_info
        
        # Protect Django Admin
        if path.startswith('/admin/'):
            if not request.user.is_authenticated:
                 # Let standard login handle it
                 pass
            elif request.user.is_superuser:
                 # Superusers always allowed
                 pass
            elif request.user.role not in ['ADMIN', 'SUPER_ADMIN']:
                 return JsonResponse(
                     {'detail': 'Access forbidden to Admin Area.'}, 
                     status=status.HTTP_403_FORBIDDEN
                 )

        response = self.get_response(request)
        return response
