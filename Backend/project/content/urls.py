from django.urls import path
from .views import RegisterView, LoginView, CreateSubcategoryView

urlpatterns = [
    path('signup/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('themes/<str:theme_slug>/subcategories/', CreateSubcategoryView.as_view()),
]