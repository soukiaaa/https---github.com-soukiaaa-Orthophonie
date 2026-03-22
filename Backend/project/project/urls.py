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
]
