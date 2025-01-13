
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from app.views import CustomTokenObtainPairView



admin.site.site_header = "Dibiye Admin"
admin.site.index_title = 'Admin'
urlpatterns = [
    path('admin/', admin.site.urls),
    path('app/', include('app.urls')),
    path('auth/jwt/create/',CustomTokenObtainPairView.as_view(),name='custom_jwt_create'),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('concours/', include('concours.urls'))
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
