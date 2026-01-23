import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

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
