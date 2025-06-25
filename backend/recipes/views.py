import json
import uuid
from backend.base.views import AppPagination, DictionaryViewSet, AppModelViewSet
from backend.openai.utils import ask_product_info, encode_image, in_memory_uploaded_file_to_base64
from recipes.documents import ProductDocument
from recipes.utils import get_mealtime_by_time
from .serializers import (
    DiarySerializer,
    InstructionsSerializer,
    MessageSerializer,
    ProductRecognizeSerializer,
    ProjectSettingsSerializer,
    RecipeSerializer,
    CategorySerializer,
    ProductSerializer,
    NutritionSerializer,
    UnitSerializer,
    WritableMealTimeSerializer,
    NutritionStatisticsSerializer,
    OFFProductSerializer,
    FullyWritableProductSerializer,
)
from .models import (
    Category,
    Diary,
    MealTime,
    Product,
    Nutrition,
    ProjectSettings,
    Recipe,
    Unit,
    Instruction,
)
from rest_framework import permissions, generics, status
from rest_framework.filters import OrderingFilter
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from .filters import CategoriesFilters, ProductFilters, RecipesFilters
from .api import OpenFoodFactsApi
from django_filters import rest_framework as filters
from django.db.models import Sum, F, Value, FloatField
from django.http import Http404

from django.db.models.functions import Coalesce
from calendar import monthrange
from datetime import datetime, timedelta
from opensearchpy import Q as ESQ


def save_off_products(products):
    many = isinstance(products, list)
    serializer = OFFProductSerializer(data=products, many=many)
    serializer.is_valid(raise_exception=True)

    # Избавляемся от продуктов, которые уже существуют
    products_data = serializer.convert_to_our_product()
    products_data = products_data if many else [products_data]
    barcodes = [product_data.get("barcode") for product_data in products_data]
    existing_barcodes = Product.objects.filter(barcode__in=barcodes).values_list(
        "barcode", flat=True
    )
    not_existing_products = [
        product
        for product in products_data
        if product.get("barcode") not in existing_barcodes
    ]
    if not len(not_existing_products):
        return []
    not_existing_products = not_existing_products if many else not_existing_products[0]

    writable_product_serializer = FullyWritableProductSerializer(
        data=not_existing_products, many=many
    )
    writable_product_serializer.is_valid(raise_exception=True)
    products = writable_product_serializer.save()

    return products


def retrieve_and_save_product_from_off_by_barcode(barcode):
    data = OpenFoodFactsApi().get_product_by_barcode(barcode)

    # Проверяем, нашли ли мы продукт в OFF
    if data.get("status") == 1:
        product = save_off_products(data)

    return product


def retrieve_and_save_products_from_off_by_text(text: str):
    try:
        off_products = OpenFoodFactsApi().search_products(text)
    except Exception as exc:
        return None
    if not len(off_products.get("products", [])):
        return None

    products = [{"product": product} for product in off_products.get("products")]
    return save_off_products(products)


class NutritionStatisticsView(APIView):
    queryset = Diary.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Валидация данных через сериализатор
        serializer = NutritionStatisticsSerializer(data=request.query_params)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Извлекаем данные после валидации
        date_from = serializer.validated_data["date_from"]
        date_to = serializer.validated_data["date_to"]
        data_slice = serializer.validated_data["data_slice"]

        # Фильтрация по датам
        diaries = Diary.objects.filter(
            date__gte=date_from,
            date__lte=date_to,
            user=request.user,
            date__isnull=False,
        )
        base_mealtimes = MealTime.objects.filter(
            diary__user=request.user, diary__date__isnull=False
        )

        # Аннотируем данные для цели (target) и суммарные данные (summary)
        total_target_nutrition = diaries.aggregate(
            total_protein=Coalesce(
                Sum(F("nutrition_target__protein")), Value(0), output_field=FloatField()
            ),
            total_fat=Coalesce(
                Sum(F("nutrition_target__fat")), Value(0), output_field=FloatField()
            ),
            total_carbohydrates=Coalesce(
                Sum(F("nutrition_target__carbohydrates")),
                Value(0),
                output_field=FloatField(),
            ),
            total_calories=Coalesce(
                Sum(F("nutrition_target__calories")),
                Value(0),
                output_field=FloatField(),
            ),
        )

        mealtimes = base_mealtimes.filter(
            diary__date__gte=date_from, diary__date__lte=date_to
        ).aggregate(
            total_protein=Coalesce(
                Sum(F("product__nutrition__protein") * F("count")),
                Value(0),
                output_field=FloatField(),
            ),
            total_fat=Coalesce(
                Sum(F("product__nutrition__fat") * F("count")),
                Value(0),
                output_field=FloatField(),
            ),
            total_carbohydrates=Coalesce(
                Sum(F("product__nutrition__carbohydrates") * F("count")),
                Value(0),
                output_field=FloatField(),
            ),
            total_calories=Coalesce(
                Sum(F("product__nutrition__calories") * F("count")),
                Value(0),
                output_field=FloatField(),
            ),
        )

        # Определяем срез данных
        sliced_data = []
        current_date = date_from

        while current_date <= date_to:
            if data_slice == "daily":
                # Разбивка по дням
                end_date = current_date
            elif data_slice == "weekly":
                # Разбивка по неделям
                end_date = current_date + timedelta(weeks=1) - timedelta(days=1)
            elif data_slice == "monthly":
                # Разбивка по месяцам
                days_in_month = monthrange(current_date.year, current_date.month)[1]
                end_date = current_date.replace(day=days_in_month)

            # Ограничиваем дату завершения в пределах диапазона
            if end_date > date_to:
                end_date = date_to

            # Целевые нутриенты за период
            period_target_nutrition = diaries.filter(
                date__gte=current_date, date__lte=end_date
            ).aggregate(
                total_protein=Coalesce(
                    Sum(F("nutrition_target__protein")),
                    Value(0),
                    output_field=FloatField(),
                ),
                total_fat=Coalesce(
                    Sum(F("nutrition_target__fat")), Value(0), output_field=FloatField()
                ),
                total_carbohydrates=Coalesce(
                    Sum(F("nutrition_target__carbohydrates")),
                    Value(0),
                    output_field=FloatField(),
                ),
                total_calories=Coalesce(
                    Sum(F("nutrition_target__calories")),
                    Value(0),
                    output_field=FloatField(),
                ),
            )

            # Суммарные нутриенты за период
            period_summary_nutrition = base_mealtimes.filter(
                diary__date__gte=current_date, diary__date__lte=end_date
            ).aggregate(
                total_protein=Coalesce(
                    Sum(F("product__nutrition__protein") * F("count")),
                    Value(0),
                    output_field=FloatField(),
                ),
                total_fat=Coalesce(
                    Sum(F("product__nutrition__fat") * F("count")),
                    Value(0),
                    output_field=FloatField(),
                ),
                total_carbohydrates=Coalesce(
                    Sum(F("product__nutrition__carbohydrates") * F("count")),
                    Value(0),
                    output_field=FloatField(),
                ),
                total_calories=Coalesce(
                    Sum(F("product__nutrition__calories") * F("count")),
                    Value(0),
                    output_field=FloatField(),
                ),
            )

            # Добавляем данные в список с указанием дат
            sliced_data.append(
                {
                    "target_nutrition": {
                        "protein": period_target_nutrition["total_protein"],
                        "fat": period_target_nutrition["total_fat"],
                        "carbohydrates": period_target_nutrition["total_carbohydrates"],
                        "calories": period_target_nutrition["total_calories"],
                    },
                    "summary_nutrition": {
                        "protein": period_summary_nutrition["total_protein"],
                        "fat": period_summary_nutrition["total_fat"],
                        "carbohydrates": period_summary_nutrition[
                            "total_carbohydrates"
                        ],
                        "calories": period_summary_nutrition["total_calories"],
                    },
                    "dates": {"start": current_date, "end": end_date},
                }
            )

            # Переход к следующему периоду
            current_date = end_date + timedelta(days=1)

        return Response(
            {
                "target_nutrition": {
                    "protein": total_target_nutrition["total_protein"],
                    "fat": total_target_nutrition["total_fat"],
                    "carbohydrates": total_target_nutrition["total_carbohydrates"],
                    "calories": total_target_nutrition["total_calories"],
                },
                "summary_nutrition": {
                    "protein": mealtimes["total_protein"],
                    "fat": mealtimes["total_fat"],
                    "carbohydrates": mealtimes["total_carbohydrates"],
                    "calories": mealtimes["total_calories"],
                },
                "data_slices": sliced_data,
            },
            status=status.HTTP_200_OK,
        )


class CategoriesViewSet(DictionaryViewSet):
    model = Category
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = AppPagination
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = (
        OrderingFilter,
        filters.DjangoFilterBackend,
    )
    filterset_class = CategoriesFilters
    ordering_fields = "__all__"
    ordering = ["-priority", "name"]


class ProductViewSet(AppModelViewSet):
    model = Product
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    pagination_class = AppPagination
    filterset_class = ProductFilters
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # TODO: добавить сортировку по времени приёма пищи
        return super().get_queryset().top_products_for_user(self.request.user)

    def get_serializer_class(self):
        if self.request.method in ["POST", "PUT"]:
            return FullyWritableProductSerializer
        return super().get_serializer_class()

    @action(detail=False, methods=["GET"])
    def get_product_by_barcode(self, request):
        barcode = request.GET.get("barcode", "")
        if not barcode:
            return Response({"error": "A barcode number is required"}, status=400)

        try:
            product = self.get_queryset().get(barcode=barcode)
        except Product.DoesNotExist:
            product = retrieve_and_save_product_from_off_by_barcode(barcode)

        if not product:
            raise Http404(f"Не найден продукт со штрих-кодом {barcode}")

        product_serializer = ProductSerializer(product)
        return Response(product_serializer.data)

    @action(detail=True, methods=["POST"])
    def report_bug(self, request, pk=None):
        message_serializer = MessageSerializer(
            data={**request.data, "product": pk, "user": request.user.user_id}
        )
        message_serializer.is_valid(raise_exception=True)
        message_serializer.save()
        return Response(message_serializer.data)


class UnitsViewSet(DictionaryViewSet):
    model = Unit
    queryset = Unit.objects.all()
    serializer_class = UnitSerializer


class NutritionViewSet(AppModelViewSet):
    # TODO: добавить отображение нутриентов только для текущего пользователя
    model = Nutrition
    queryset = Nutrition.objects.all()
    serializer_class = NutritionSerializer
    permission_classes = [permissions.IsAuthenticated]


class RecipiesViewSet(DictionaryViewSet):
    model = Recipe
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    pagination_class = AppPagination

    filterset_class = RecipesFilters
    filter_backends = (filters.DjangoFilterBackend,)


class InstrucstionsViewSet(DictionaryViewSet):
    model = Instruction
    queryset = Instruction.objects.all()
    serializer_class = InstructionsSerializer
    filterset_fields = ["recipe"]


class DictionariesViewSet(APIView):
    queryset = Category.objects.all()

    def get(self, request, format=None):
        project_settings = ProjectSettings.objects.first()
        data = {
            "units": UnitSerializer(Unit.objects.all(), many=True).data,
            "default_unit": (
                project_settings.default_unit.id
                if project_settings.default_unit
                else None
            ),
        }
        return Response(data)


class MealtimeViewSet(AppModelViewSet):
    model = MealTime
    queryset = MealTime.objects.all()
    serializer_class = WritableMealTimeSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=["POST"])
    def recognize_product(self, request):
        product_recognizer = ProductRecognizeSerializer(data=request.data)
        product_recognizer.is_valid(raise_exception=True)
        # product_recognizer.data['image']
        openai_answer = ask_product_info(in_memory_uploaded_file_to_base64(product_recognizer.validated_data['image']))
        # openai_answer = {'nutrition': {'protein': 4.67, 'fat': 15.08, 'carbohydrates': 43.77}, 'name': 'Зраза куриная с грибами и картофелем жареным', 'brand': 'не указано', 'barcode': 'не указано', 'category': 'мясные продукты', 'quantity': 120}
        # openai_answer = {'nutrition': {'protein': 6, 'fat': 15, 'carbohydrates': 40}, 'name': 'asdasda sd adsaadaпастойssss', 'brand': 'Неизвестный', 'barcode': 'Неизвестен', 'category': 'Кондитерские изделия', 'quantity': 100}
        product = None
        if openai_answer.get("barcode"):
            try:
                product: Product = Product.object.get(barcode=openai_answer["barcode"])
            except:
                pass
        if not product and openai_answer.get("name"):
            try:
                response = (
                    ProductDocument.search()
                    .query(
                        ESQ(
                            "multi_match",
                            query=openai_answer["name"],
                            fields=["name^3", "category.name", "brand^2"],
                        )
                    )
                    .source(["id"])
                    .extra(size=1)
                    .execute()
                )
            except:
                pass
            else:
                try:
                    product: Product = Product.objects.get(id=response[0].id)
                except:
                    pass

        if product:
            # TODO: может быть проблема с различием часового пояса пользователя и сервера
            mealtime_serializer = WritableMealTimeSerializer(
                data={
                    "product_id": product.id,
                    "diary_date": datetime.date(datetime.now()),
                    "name": get_mealtime_by_time(datetime.now()),
                    "count": openai_answer.get("quantity", 1) / product.quantity,
                },
                context={"request": request},
            )
            mealtime_serializer.is_valid(raise_exception=True)
            mealtime_serializer.save()
            return Response(data={'mealtime': mealtime_serializer.data}, status=201)

        openai_answer['images'] = []
        serializer = FullyWritableProductSerializer(data=openai_answer)
        serializer.is_valid(raise_exception=True)
        return Response(data={'product': serializer.data}, status=200)


class RetrieveNullObjectMixin:
    """
    Mixin для поиска объектов, где значение lookup_field может быть 'null'.

    Если значение параметра, указанного в `lookup_field`, отличается от 'null',
    миксин выполняет стандартное поведение получения объекта через вызов родительского
    метода `get_object()`.

    В случае, если значение `lookup_field` равно 'null', происходит поиск объекта,
    у которого соответствующее поле в базе данных имеет значение `NULL` (isnull=True).

    Методы:
    - get_object(): Возвращает объект в зависимости от значения lookup_field. Если
      значение 'null', выполняется поиск объекта с `NULL` значением в указанном поле.
    """

    def get_object(self):
        if self.kwargs[self.lookup_field] != "null":
            return super().get_object()

        queryset = self.filter_queryset(self.get_queryset())

        filter_kwargs = {f"{self.lookup_field}__isnull": True}
        obj = generics.get_object_or_404(queryset, **filter_kwargs)

        self.check_object_permissions(self.request, obj)
        return obj


class DiaryViewSet(RetrieveNullObjectMixin, AppModelViewSet):
    model = Diary
    queryset = Diary.objects.all()
    serializer_class = DiarySerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "date"

    def get_queryset(self):
        return super().get_queryset().filter(user=self.request.user)


class ProjectSettingsView(APIView):
    model = ProjectSettings
    queryset = ProjectSettings.objects.all()
    serializer_class = ProjectSettingsSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_serializer(self):
        return ProjectSettingsSerializer(ProjectSettings.objects.first())

    def get(self, request, *args, **kwargs):
        return Response(self.get_serializer().data)


class PrivacyPolicy(ProjectSettingsView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        serializer = self.get_serializer()
        return Response(
            {"privacy_policy": serializer.data.get("text_of_the_agreement")}
        )
