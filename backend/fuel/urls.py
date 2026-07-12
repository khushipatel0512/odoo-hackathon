from rest_framework.routers import DefaultRouter
from .views import FuelLogViewSet

router = DefaultRouter()
router.register('', FuelLogViewSet)

urlpatterns = router.urls