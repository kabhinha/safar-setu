from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Inquiry
from .serializers import InquiryPublicSerializer, InquiryListSerializer

class PublicInquiryCreateView(generics.CreateAPIView):
    queryset = Inquiry.objects.all()
    serializer_class = InquiryPublicSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # Link user if authenticated
        if request.user.is_authenticated:
            serializer.save(user=request.user)
        else:
            self.perform_create(serializer)
            
        headers = self.get_success_headers(serializer.data)
        
        # Custom response format for Pilot
        return Response({
            'status': 'success',
            'message': 'Inquiry received',
            'reference_token': serializer.data['reference_token'],
            'data': serializer.data
        }, status=status.HTTP_201_CREATED, headers=headers)

class UserInquiryListView(generics.ListAPIView):
    serializer_class = InquiryListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Inquiry.objects.filter(user=self.request.user).order_by('-created_at')
