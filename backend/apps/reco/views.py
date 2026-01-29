import logging
import dataclasses
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from shared.contracts.kiosk_discovery import DiscoveryRequest
from .service import get_kiosk_recommendations
from listings.models import Hotspot

from .domain import RecoInput
from .service import RecommendationService

logger = logging.getLogger(__name__)

class RecommendationPublicView(APIView):
    authentication_classes = [] # Public Access
    permission_classes = []
    
    def get(self, request):
        try:
            # 1. Parse Input
            input_data = RecoInput.from_request(request.query_params)
            
            logger.info(f"Reco Request: {input_data}")
            
            # 2. Call Service
            service = RecommendationService()
            recommendations = service.get_recommendations(input_data)
            
            # 3. Serialize Response
            data = [r.to_dict() for r in recommendations]
            
            return Response({
                "meta": {
                    "count": len(data),
                    "district": input_data.district,
                    "policy_version": "v1"
                },
                "data": data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Reco Engine Error: {str(e)}", exc_info=True)
            # Fallback to empty list or basic error, but don't crash the client
            return Response({
                "error": "Recommendation engine unavailable",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class KioskRecommendationView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        try:
            # 1. Parse Input
            req_data = request.data
            discovery_req = DiscoveryRequest(
                available_time=req_data.get('available_time'),
                interest_tags=req_data.get('interest_tags', []),
                district_id=req_data.get('district_id')
            )
            
            # 2. Call Service
            results = get_kiosk_recommendations(discovery_req)
            
            # 3. Serialize
            data = [dataclasses.asdict(r) for r in results]
            
            return Response({
                "results": data,
                "meta": {
                    "explainable": True,
                    "no_personalization": True
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Kiosk Discovery Error: {str(e)}", exc_info=True)
            return Response({
                "error": "Discovery engine error",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DistrictListView(APIView):
    authentication_classes = [] # Public
    permission_classes = []

    @method_decorator(cache_page(60*60)) # Cache for 1 hour
    def get(self, request):
        # Return distinct districts from Live Hotspots
        # For pilot, we might just want all districts or specific ones. 
        # Using correct query to get distinct districts.
        districts = Hotspot.objects.filter(
            status=Hotspot.Status.Live
        ).values_list('district', flat=True).distinct()
        
        # Format as [{district_id, name}]
        response_data = [{"district_id": d, "name": d} for d in districts if d]
        
        return Response(response_data, status=status.HTTP_200_OK)
