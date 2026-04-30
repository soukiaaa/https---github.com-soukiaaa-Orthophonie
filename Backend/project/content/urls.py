from django.urls import path
from .views import (RegisterView, LoginView, CreateSubcategoryView, create_theme, SubcategoryDetailView, themes_list,
                   CreateCustomSubcategoryView, CustomSubcategoryDetailView)

urlpatterns = [
    path('signup/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('themes/', themes_list),
    path('themes/<str:theme_slug>/subcategories/', CreateSubcategoryView.as_view()),
    path('themes/<str:theme_slug>/custom-subcategories/', CreateCustomSubcategoryView.as_view()),
    path('addthemes/', create_theme),
    path('subcategories/<slug:slug>/', SubcategoryDetailView.as_view()),
    path('custom-subcategories/<int:pk>/', CustomSubcategoryDetailView.as_view()),
]