from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.contenttypes.models import ContentType
from .models import AuditLog
from users.models import User, InviteCode
# Import other critical models as needed

@receiver(post_save, sender=User)
def log_user_change(sender, instance, created, **kwargs):
    action = "CREATE" if created else "UPDATE"
    # In a real signal, getting the 'actor' (request.user) is hard without thread-locals or middleware context.
    # For now, we log the system event. 
    # To get proper actor, we usually use the AuditMiddleware or explicit service calls in Views.
    # This signal is a fallback for system-level changes.
    pass 
    
    # Note: Implementing strict Actor logging via signals requires middleware thread locals
    # which is complex. For this MVP, we will rely on Middleware for API actions 
    # and explicit logging in Views/Services for business logic.

# We will implement a utility to be called from Views/Services
def log_action(request, obj, action, changes=None):
    if not request: return
    
    ct = ContentType.objects.get_for_model(obj)
    AuditLog.objects.create(
        actor=request.user if request.user.is_authenticated else None,
        action=action,
        content_type=ct,
        object_id=str(obj.pk),
        changes=changes,
        ip_address=request.META.get('REMOTE_ADDR'),
        user_agent=request.META.get('HTTP_USER_AGENT', '')[:200]
    )
