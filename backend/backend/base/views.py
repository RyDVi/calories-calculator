from rest_framework import viewsets
import django_filters.rest_framework

# from rest_framework.response import Response
# from rest_framework.parsers import FormParser, MultiPartParser
# from rest_framework.decorators import parser_classes, action
# from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_201_CREATED

# from rest_framework.permissions import AllowAny

from rest_framework.pagination import PageNumberPagination


class AppPagination(PageNumberPagination):
    page_size = 25  # Количество элементов на одной странице
    page_size_query_param = (
        "count"  # Позволяет клиенту передавать параметр размера страницы в запросе
    )
    max_page_size = 100  # Максимальный размер страницы


class AppModelViewSet(viewsets.ModelViewSet):
    filter_backends = [django_filters.rest_framework.DjangoFilterBackend]
    pass


class DictionaryViewSet(AppModelViewSet):
    pass
