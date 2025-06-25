import re
import typing
import django_filters
from django_filters.rest_framework import FilterSet

from backend import settings
from .models import Category, Product, Recipe
from django.db.models import Q, QuerySet, Value, Func, TextField, CharField
from django.db.models.functions import Lower, Replace
from django.db.models import IntegerField, Case, When

from opensearchpy import Q as ESQ
from .documents import ProductDocument

from django.core.cache import cache

def build_remove_characters(text, characters: typing.List[str]):
    result = text
    for character in characters:
        result = Replace(result, Value(character), Value(""))
    return result


def build_regexp_replace(name, regexp, replacement, flags="g"):
    return Func(
        name,
        Value(regexp),
        Value(replacement),
        Value(flags),
        function="REGEXP_REPLACE",
        output_field=TextField(),
    )

class RemoveNonWord(Func):
    function = 'REGEXP_REPLACE'
    template = "%(function)s(%(expressions)s, '[^\\w]', '')"
    output_field = CharField()

class ProductFilters(FilterSet):
    name = django_filters.CharFilter(
        field_name="name", lookup_expr="icontains", label="Название продукта"
    )
    category = django_filters.CharFilter(
        field_name="category__name", lookup_expr="icontains", label="Название категории"
    )
    
    search = django_filters.CharFilter(label="Поиск", method="search_product")

    class Meta:
        model = Product
        fields = ("name", "category", "search")

    def search_product(self, queryset: QuerySet[Product], field_name: str, value: str):

        lower_value = value.lower()

        # Поиск в OpenSearch
        search = ProductDocument.search().query(
            ESQ('multi_match', query=lower_value, fields=['name^3', 'category.name', 'brand^2'])
        ).source(['id']).extra(size=100)
        response = search.execute()

        # Получение ID найденных продуктов
        # TODO: вместо этого execute должен возвращать идентификаторы
        product_ids = [hit.meta.id for hit in response]

        annotated_queryset = queryset.filter(id__in=product_ids).annotate(
            search_type_ordering=Case(
                When(name__istartswith=lower_value, then=Value(1)),
                default=Value(0),
                output_field=IntegerField(),
            )
        ).order_by('-is_user_product', '-search_type_ordering', 'name')

        return annotated_queryset


class RecipesFilters(FilterSet):
    name = django_filters.CharFilter(
        field_name="name", lookup_expr="icontains", label="Название рецепта"
    )
    category = django_filters.CharFilter(
        field_name="category__name", lookup_expr="icontains", label="Название категории"
    )
    ingredients = django_filters.CharFilter(
        field_name="ingredients__name",
        lookup_expr="icontains",
        label="Название ингредиента",
    )
    time = django_filters.RangeFilter(
        field_name="cooking_time_seconds", label="Время готовки"
    )

    class Meta:
        model = Recipe
        # fields = '__all__'
        fields = ("name", "category", "ingredients", "time")


class CategoriesFilters(FilterSet):
    search = django_filters.CharFilter(label="Поиск", method="search_category")

    class Meta:
        model = Category
        fields = ("search",)

    def search_category(self, queryset: QuerySet[Product], field_name: str, value: str):
        return queryset.filter(Q(name__icontains=value) | Q(synonyms__icontains=value))
