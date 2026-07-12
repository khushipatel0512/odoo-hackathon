from rest_framework.routers import DefaultRouter
from .views import FuelLogViewSet

router = DefaultRouter()
router.register('fuel', FuelLogViewSet)

urlpatterns = router.urls