from pathlib import Path
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from content import views

BASE_DIR = Path(__file__).resolve().parent.parent

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

FRONTEND_DIR = BASE_DIR.parent / "Frontend" / "dist"

urlpatterns += static('/assets/', document_root=FRONTEND_DIR / 'assets')
urlpatterns += static('/vite.svg', document_root=FRONTEND_DIR)

urlpatterns += [
    re_path(r'^(?!api/|admin/|static/|media/|assets/).*$', TemplateView.as_view(template_name='index.html')),
]


