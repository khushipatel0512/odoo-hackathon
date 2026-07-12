from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import FuelLog
from .serializers import FuelLogSerializer

class FuelLogViewSet(viewsets.ModelViewSet):
    queryset = FuelLog.objects.all()
    serializer_class = FuelLogSerializer
    permission_classes = [IsAuthenticated]