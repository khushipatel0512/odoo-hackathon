from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Driver
from .serializers import DriverSerializer

class DriverViewSet(viewsets.ModelViewSet):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    permission_classes = [AllowAny]