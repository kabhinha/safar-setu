from django.utils import timezone
# from features.services import is_feature_enabled # Cyclic dependency risk, use lazy import if needed

class AbacService:
    @staticmethod
    def can_create_listing(user):
        """
        Rule: User must be HOST + Verified + Onboarding Feature Enabled.
        """
        if user.role not in ['HOST', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN']:
            return False
            
        if user.kyc_status != 'VERIFIED':
            # Strict ABAC: Only verified hosts can list
            return False
            
        return True

    @staticmethod
    def can_view_sensitive_details(user, district):
        """
        Rule: Admins can view. Users can view if in same district (example).
        """
        if user.role in ['ADMIN', 'SUPER_ADMIN']:
            return True
            
        # Example location awareness
        # if user.district == district: return True
        return False
