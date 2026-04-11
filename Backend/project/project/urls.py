from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from content import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('content.urls')),
    path('api/themes/', views.themes_list),
    path('api/themes/<slug:slug>/', views.theme_detail),
    path('api/tts/', views.tts),
    path('api/tts/edge/', views.tts_edge),
    path('api/actions/generate/', views.generate_action_image),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
