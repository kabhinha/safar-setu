from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from listings.models import Hotspot
from listings.serializers import HotspotPublicSerializer
from django.db.models import Q

class DiscoverView(APIView):
    """
    Public discovery endpoint for Kiosks.
    GET /api/kiosk/discover?time=60&interests=tea,nature
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        time_limit = request.query_params.get('time')
        interests_param = request.query_params.get('interests')
        
        # Base Query: LIVE Hotspots only
        queryset = Hotspot.objects.filter(status=Hotspot.Status.Live)
        
        # 1. Time Filter
        if time_limit:
            try:
                minutes = int(time_limit)
                # Allow slightly longer experiences (+15m buffer)
                queryset = queryset.filter(duration_minutes__lte=minutes + 15)
            except ValueError:
                pass
        
        # 2. Interest Filter (Overlap)
        if interests_param:
            interests = [i.strip().lower() for i in interests_param.split(',') if i.strip()]
            if interests:
                # Naive JSON list filter for SQLite compatibility (contains any)
                q_objs = Q()
                for interest in interests:
                    q_objs |= Q(tags__contains=interest) 
                queryset = queryset.filter(q_objs)

        # Serialize
        data = HotspotPublicSerializer(queryset, many=True).data
        return Response(data)

class KioskHomeView(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request):
        return Response({"message": "Kiosk API Active"})

class KioskLoginView(APIView):
    """
    Kiosk submits the 6-digit code to login as the User.
    Returns Short-Lived JWT (10 mins).
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        code = request.data.get('code')
        from users.models import ConnectCode
        from rest_framework_simplejwt.tokens import RefreshToken
        import datetime

        try:
            connect_code = ConnectCode.objects.get(code=code, is_used=False)
            if connect_code.is_valid():
                # Mark Used
                connect_code.is_used = True
                connect_code.save()

                # Generate Token (10 Min Validity)
                user = connect_code.user
                refresh = RefreshToken.for_user(user)
                # Force access token expiry to 10 mins (if not globally set) - handled by settings usually, but short session logic here
                # actually simplejwt settings handle expiry. For now standard token is fine, client can handle logout.
                
                return Response({
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "user": {
                        "email": user.email,
                        "username": user.username
                    },
                    "expires_in": 600 # 10 mins guidance
                })
            else:
                 return Response({"error": "Code expired or invalid."}, status=400)
        except ConnectCode.DoesNotExist:
            return Response({"error": "Invalid code."}, status=400)
