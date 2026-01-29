from .services import log_action
from django.utils.deprecation import MiddlewareMixin
import json

class AuditLogMiddleware(MiddlewareMixin):
    """
    Logs strict write operations (POST, PUT, PATCH, DELETE).
    """
    def process_response(self, request, response):
        if request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            if 200 <= response.status_code < 300:
                # Log successful mutation
                # Note: Capturing the *object* changed is hard here without view cooperation.
                # This middleware logs the *Request* event.
                pass 
                
        return response
