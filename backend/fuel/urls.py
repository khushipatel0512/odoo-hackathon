from rest_framework.routers import DefaultRouter
from .views import FuelLogViewSet

router = DefaultRouter()
router.register('', FuelLogViewSet, basename='fuel')

urlpatterns = router.urls