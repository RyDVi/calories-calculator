"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, re_path
from django.conf.urls import include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers

from accounts.views import (
    CustomAuthToken,
    RegisterView,
    ExternalServiceOAuthToken,
    UserSettingsView,
)
from recipes.views import (
    CategoriesViewSet,
    PrivacyPolicy,
    ProductViewSet,
    InstrucstionsViewSet,
    NutritionViewSet,
    RecipiesViewSet,
    UnitsViewSet,
    DictionariesViewSet,
    MealtimeViewSet,
    DiaryViewSet,
    NutritionStatisticsView,
    ProjectSettingsView,
)

router = routers.DefaultRouter()
router.register(r"products", ProductViewSet)
router.register(r"categories", CategoriesViewSet)
router.register(r"units", UnitsViewSet)
router.register(r"recipies", RecipiesViewSet)
router.register(r"instructions", InstrucstionsViewSet)
router.register(r"nutritions", NutritionViewSet)
router.register(r"mealtimes", MealtimeViewSet)
router.register(r"diaries", DiaryViewSet)

api_urlpatterns = [
    path("", include("rest_framework.urls")),
    path("", include(router.urls)),
    path("login_user/", CustomAuthToken.as_view()),
    path("login_with_external_service/", ExternalServiceOAuthToken.as_view()),
    path("register/", RegisterView.as_view()),
    path("dictionaries/", DictionariesViewSet.as_view(), name="dictionaries"),
    path("project_settings/", ProjectSettingsView.as_view(), name="project_settings"),
    path("project_settings/privacy_policy/", PrivacyPolicy.as_view(), name="privacy_policy"),
    path(
        "nutrition_statistics/",
        NutritionStatisticsView.as_view(),
        name="nutrition_statistics",
    ),
    path("user_settings/", UserSettingsView.as_view(), name="user_settings"),
]


urlpatterns = [
    path("admin/", admin.site.urls),
    path(settings.BASE_API_URL.lstrip("/"), include(api_urlpatterns)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
