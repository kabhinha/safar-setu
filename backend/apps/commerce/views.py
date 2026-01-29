from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Product, Deal, DealToken
import uuid
from datetime import timedelta

class CommerceInitiateView(APIView):
    """
    Kiosk: Initiate a deal for a product.
    Returns QR-1 (Traveler Intent) URL/Token.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        product_id = request.data.get('product_id')
        kiosk_id = request.data.get('kiosk_id', 'UNKNOWN_KIOSK')
        district_id = request.data.get('district_id', 'UNKNOWN_DISTRICT')
        
        product = get_object_or_404(Product, pk=product_id, active=True)
        
        # Create Deal
        deal_expiry = timezone.now() + timedelta(minutes=30)
        deal = Deal.objects.create(
            product=product,
            vendor_id=product.vendor_id,
            amount_snapshot=product.price_amount,
            expires_at=deal_expiry,
            kiosk_id=kiosk_id,
            district_id=district_id
        )
        
        # Create Token (Traveler Intent)
        token_expiry = timezone.now() + timedelta(minutes=10)
        token = DealToken.objects.create(
            deal=deal,
            token_type=DealToken.TokenType.TRAVELER_INTENT,
            expires_at=token_expiry
        )
        
        return Response({
            "deal_id": deal.id,
            "token_value": f"/m/deal/{token.token_value}", # This is formatted as a deep link now
            "expires_at": token.expires_at,
            "status": deal.status
        })

class CommerceScanView(APIView):
    """
    Vendor/System Scanner.
    Input: token_value
    Logic:
      - Intent Token -> Move to VENDOR_CONFIRMED
      - Confirm Token -> Move to CLOSED
    """
    permission_classes = [AllowAny]

    def post(self, request):
        token_value = request.data.get('token_value')
        if not token_value:
            return Response({"error": "Token value required"}, status=400)
            
        # Strip potential URL prefix if scanned from QR
        # Formats: /m/deal/<uuid>, http://.../m/deal/<uuid>, or just <uuid>
        clean_token = token_value.split('/')[-1]
            
        try:
             token = DealToken.objects.get(token_value=clean_token)
        except DealToken.DoesNotExist:
             return Response({"error": "Invalid token"}, status=404)
             
        if not token.is_valid():
            return Response({"error": "Token expired or used"}, status=400)
            
        deal = token.deal
        
        # Logic Flow
        if token.token_type == DealToken.TokenType.TRAVELER_INTENT:
            if deal.status != Deal.Status.INITIATED:
                 return Response({"error": "Invalid deal state for this token"}, status=400)
            
            deal.status = Deal.Status.VENDOR_CONFIRMED
            deal.save()
            token.used_at = timezone.now()
            token.save()
            return Response({"deal_id": deal.id, "status": deal.status, "message": "Deal Confirmed by Vendor. Awaiting Final Close."})
            
        elif token.token_type == DealToken.TokenType.VENDOR_CONFIRM:
            if deal.status != Deal.Status.VENDOR_CONFIRMED:
                 return Response({"error": "Deal not ready for closing"}, status=400)
                 
            deal.status = Deal.Status.CLOSED
            deal.save()
            token.used_at = timezone.now()
            token.save()
            return Response({"deal_id": deal.id, "status": deal.status, "message": "Deal Closed Successfully!"})
            
        return Response({"error": "Unknown token type"}, status=400)

class CommerceVendorTokenView(APIView):
    """
    Vendor requests QR-2 (Confirmation Token) to finalize the deal.
    """
    # Keep this protected or mocked for pilot? 
    # Pilot requirement: "Vendor token endpoint (protected)"
    # But for pilot simplicity without auth, we might need AllowAny if we use it.
    # However, Kiosk Mart flow doesn't use this explicitly in the requirement "Vendor scan endpoint to complete a transaction".
    # Only QR-1 -> Scan is required.
    pass 

    def post(self, request, deal_id):
        # In real life, check auth (Vendor).
        deal = get_object_or_404(Deal, pk=deal_id)
        
        if deal.status != Deal.Status.VENDOR_CONFIRMED:
            return Response({"error": "Deal must be in CONFIRMED state to generate closing token"}, status=400)
            
        # Create Token (Vendor Confirm)
        token_expiry = timezone.now() + timedelta(minutes=5)
        token = DealToken.objects.create(
            deal=deal,
            token_type=DealToken.TokenType.VENDOR_CONFIRM,
            expires_at=token_expiry
        )
        
        return Response({
            "deal_id": deal.id,
            "token_value": token.token_value, # This is QR-2 payload
            "expires_at": token.expires_at
        })

class CommerceStatusView(APIView):
    """
    Poll status for UI
    """
    permission_classes = [AllowAny]

    def get(self, request, deal_id):
        deal = get_object_or_404(Deal, pk=deal_id)
        return Response({
            "id": deal.id,
            "status": deal.status,
            "product": deal.product.title,
            "amount": deal.amount_snapshot
        })

class CommerceProductListView(APIView):
    """
    List seed products for demo
    """
    permission_classes = [AllowAny]

    def get(self, request):
        products = Product.objects.filter(active=True)
        data = [{"id": p.id, "title": p.title, "price": p.price_amount, "description": p.description} for p in products]
        return Response(data)
