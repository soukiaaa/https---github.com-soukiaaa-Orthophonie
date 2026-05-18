from django.urls import path
from .views import (RegisterView, LoginView, CreateSubcategoryView, create_theme, SubcategoryDetailView, themes_list)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('signup/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('themes/', themes_list),
    path('themes/<str:theme_slug>/subcategories/', CreateSubcategoryView.as_view()),
    path('addthemes/', create_theme),
    path('subcategories/<slug:slug>/', SubcategoryDetailView.as_view()),
]