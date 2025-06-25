import base64
import copy
import re
import uuid
from django.db import transaction, models
from rest_framework import serializers, fields
from io import BytesIO
from backend.base.serializers import DictionarySerializer, AppModelSerializer

from backend.utils import is_uuidv4
from .models import (
    Category,
    Diary,
    MealTime,
    Product,
    Nutrition,
    ProductImage,
    ProjectSettings,
    Recipe,
    Unit,
    Instruction,
    UserMessage,
)
from django.core.files import File
from PIL import Image
from django.core.files.uploadedfile import InMemoryUploadedFile


class NutritionSerializer(AppModelSerializer):
    calories = serializers.FloatField(read_only=True)

    class Meta(AppModelSerializer.Meta):
        model = Nutrition


class NutrifiedModelSerializer(AppModelSerializer):
    nutrition = NutritionSerializer(read_only=True)


class CategorySerializer(DictionarySerializer):
    class Meta(DictionarySerializer.Meta):
        model = Category


class UnitSerializer(DictionarySerializer):
    is_default_value = serializers.BooleanField(default=False)
    class Meta(DictionarySerializer.Meta):
        model = Unit

class UrlImageSlugRelatedField(serializers.SlugRelatedField):
    def to_representation(self, value):

        def get_image(instance):
            url = instance.image.url
            request = self.context.get("request", None)
            if request is not None:
                return request.build_absolute_uri(url)
            return url

        # Предполагается, что value - это объект ProductImage или QuerySet
        if isinstance(value, list):
            # Если value - список, возвращаем список URL-адресов
            return [
                get_image(item)
                for item in value
                if item.image and hasattr(item.image, "url")
            ]
        # Если value - один объект, возвращаем его URL
        return get_image(value) if value.image and hasattr(value.image, "url") else None


class ImageFieldFromURL(serializers.ImageField):
    def to_internal_value(self, data):

        if isinstance(data, str) and data.startswith("data:image"):
            return self._process_base64_image(data)
        # Проверяем, является ли входное значение URL
        if isinstance(data, str) and data.startswith("http"):
            return self._process_url_image(data)
            # try:
            #     response = requests.get(data)
            #     response.raise_for_status()  # Проверяем, был ли запрос успешным

            #     # Создаем файл из контента ответа
            #     image_file = BytesIO(response.content)
            #     file_name = data.split("/")[-1]  # Имя файла берём из URL

            #     return File(image_file, name=file_name)
            # except requests.exceptions.RequestException:
            #     raise serializers.ValidationError("Invalid image URL")

        # Если это не URL, возвращаем стандартное значение для ImageField
        return super().to_internal_value(data)

    def _process_base64_image(self, base64_data):
        try:
            # Отделяем тип изображения от данных
            format, imgstr = base64_data.split(";base64,")
            img_data = base64.b64decode(imgstr)
            image = Image.open(BytesIO(img_data))

            # Создаём временный файл для изображения
            img_io = BytesIO()
            image.save(img_io, format=image.format)
            img_io.seek(0)
            image_file = InMemoryUploadedFile(
                img_io, None, "image.jpg", "image/jpeg", img_io.tell(), None
            )

            return image_file

        except Exception as e:
            raise serializers.ValidationError(f"Invalid base64 image data: {e}")

    def _process_url_image(self, url):
        # TODO: Необходимо реализовать асинхронную загрузку изображений с использованием redis и celery.
        # 1. URL запоминается в image_link
        # 2. Создаётся задача на скачивание изображения
        raise ("Need implement async loading of image from url")
        # try:
        #     response = requests.get(url)
        #     response.raise_for_status()  # Проверяем, был ли запрос успешным

        #     # Создаем файл из контента ответа
        #     image_file = BytesIO(response.content)
        #     file_name = url.split("/")[-1]  # Имя файла берём из URL

        #     return File(image_file, name=file_name)
        # except requests.exceptions.RequestException:
        #     raise serializers.ValidationError("Invalid image URL")


class ProductImageSerializer(AppModelSerializer):
    image = ImageFieldFromURL(required=False)

    class Meta(AppModelSerializer.Meta):
        model = ProductImage
        fields = ["image", "image_link", "tag"]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['image'] = representation.get(
            "image_link"
        ) or getattr(getattr(instance,'image', None),'url', None)
        return representation


class ProductSerializer(NutrifiedModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    unit = UnitSerializer(default=ProjectSettings.objects.first().default_unit)
    # unit = UnitSerializer(default=None)

    class Meta(NutrifiedModelSerializer.Meta):
        model = Product
        extra_kwargs = {"user": {"write_only": True}}


class InstructionsSerializer(AppModelSerializer):
    class Meta(AppModelSerializer.Meta):
        model = Instruction


class RecipeSerializer(NutrifiedModelSerializer):
    class Meta(NutrifiedModelSerializer.Meta):
        model = Recipe


class MealTimeSerializer(AppModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta(AppModelSerializer.Meta):
        model = MealTime


class WritableMealTimeSerializer(MealTimeSerializer):
    diary_date = serializers.DateField(write_only=True, required=False)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), write_only=True, source="product"
    )
    product = ProductSerializer(read_only=True)

    class Meta(MealTimeSerializer.Meta):
        model = MealTime
        extra_kwargs = {
            "diary": {"read_only": True},
        }

    def create(self, validated_data):
        # Получаем текущего пользователя из контекста
        user = self.context["request"].user
        print(validated_data)
        # Проверяем наличие diary_date в данных
        diary_date = validated_data.pop("diary_date", None)
        if diary_date:
            # Ищем дневник пользователя по дате
            diary = Diary.objects.filter(user=user, date=diary_date).first()

            # Если дневник не найден, пытаемся найти шаблон с датой null
            if diary is None:
                template_diary = Diary.objects.filter(
                    user=user, date__isnull=True
                ).first()

                if template_diary is None:
                    raise serializers.ValidationError(
                        "No template diary found for this user."
                    )
                nutrition_target = template_diary.nutrition_target
                with transaction.atomic():
                    nutrition_target_copy = Nutrition.objects.create(
                        protein=nutrition_target.protein,
                        fat=nutrition_target.fat,
                        carbohydrates=nutrition_target.carbohydrates,
                    )
                    # Создаем новый дневник, копируя данные из шаблона и присваивая новую дату
                    diary = Diary.objects.create(
                        user=user,
                        date=diary_date,
                        nutrition_target=nutrition_target_copy,
                    )

            # Подставляем найденный или созданный дневник в validated_data
            validated_data["diary"] = diary

        # Вызываем стандартный метод создания
        return super().create(validated_data)


class DiarySerializer(AppModelSerializer):
    mealtimes = WritableMealTimeSerializer(many=True)
    nutrition_target = NutritionSerializer()

    class Meta(AppModelSerializer.Meta):
        model = Diary
        extra_kwargs = {"user": {"write_only": True}}

    def __init__(self, *args, data=fields.empty, **kwargs):
        super().__init__(*args, data=data, **kwargs)
        if self.context.get("request") and data is not fields.empty:
            self.initial_data["user"] = self.context["request"].user.user_id


class NutritionStatisticsSerializer(serializers.Serializer):
    date_from = serializers.DateField(required=True)
    date_to = serializers.DateField(required=True)
    data_slice = serializers.ChoiceField(
        choices=["daily", "weekly", "monthly"], default="daily"
    )

    def validate(self, data):
        # Проверяем, чтобы дата начала была не позже даты окончания
        if data["date_from"] > data["date_to"]:
            raise serializers.ValidationError("date_from cannot be later than date_to")
        return data


class OFFProductDetailNutrientSerializer(serializers.Serializer):
    # TODO: сделать оповещение в случае пустых полей БЖУ
    proteins_100g = serializers.FloatField(required=False, default=0)
    fat_100g = serializers.FloatField(required=False, default=0)
    carbohydrates_100g = serializers.FloatField(required=False, default=0)


class OFFProductDetailSerializer(serializers.Serializer):
    # TODO: сделать оповещение в случае пустого поля product_quantity
    nutriments = OFFProductDetailNutrientSerializer()

    product_name = serializers.CharField(allow_blank=True, required=False)
    product_name_en = serializers.CharField(allow_blank=True, required=False)
    product_name_ru = serializers.CharField(allow_blank=True, required=False)
    product_quantity = serializers.FloatField(required=False, default=100)
    product_quantity_unit = serializers.CharField(
        allow_blank=True, required=False, default="gramm"
    )
    image_url = serializers.URLField(required=False)
    code = serializers.CharField(required=True)
    brands = serializers.CharField(allow_blank=True, required=False, default="unknown")
    categories = serializers.CharField(
        required=False, allow_blank=True, default="unknown"
    )


class OFFProductListSerializer(serializers.ListSerializer):
    def convert_to_our_product(self):
        # Применяем convert_to_our_product к каждому элементу validated_data
        return [
            self.child.convert_to_our_product(validated_data)
            for validated_data in self.validated_data
        ]


class OFFProductSerializer(serializers.Serializer):
    product = OFFProductDetailSerializer()

    class Meta:
        list_serializer_class = OFFProductListSerializer

    # Метод для преобразования
    def convert_to_our_product(self, product_data=None):
        if product_data != None:
            data = product_data
        else:
            data = self.validated_data
        image_url = data["product"].get("image_url")

        unit_name = data["product"].get("product_quantity_unit", "gramm")
        category_name = data["product"].get("categories", "unknown").split(",")[0]
        category_name = re.sub("\w{2}:", "", category_name)

        product_data = {
            "name": data["product"].get("product_name_ru")
            or data["product"].get("product_name_en")
            or data["product"].get("product_name")
            or "unknown",
            "barcode": data["product"]["code"],
            "brand": data["product"].get("brands") or "unknown",
            "quantity": data["product"]["product_quantity"],
            "unit": unit_name,
            "category": category_name,
            "images": [{"image_link": image_url}] if image_url else [],
            "nutrition": {
                "protein": data["product"]["nutriments"]["proteins_100g"]
                * data["product"]["product_quantity"]
                / 100,
                "fat": data["product"]["nutriments"]["fat_100g"]
                * data["product"]["product_quantity"]
                / 100,
                "carbohydrates": data["product"]["nutriments"]["carbohydrates_100g"]
                * data["product"]["product_quantity"]
                / 100,
            },
            "product_info_owner": "Open Food Facts"
        }

        return product_data


class FullyWritableProductListSerializer(serializers.ListSerializer):
    @transaction.atomic
    def create(self, validated_data):
        products = []
        for product_data in validated_data:
            child = copy.deepcopy(self.child)
            child.initial_data = product_data
            child.is_valid(raise_exception=True)
            product = child.save()
            products.append(product)

        return products


class DynamicModelField(serializers.Field):
    def __init__(self, model, serializer_class, *args, **kwargs):
        self.model = model
        self.serializer_class = serializer_class
        super().__init__(*args, **kwargs)

    def to_internal_value(self, data):
        if isinstance(data, self.model):
            return data
        if isinstance(data, str) or isinstance(data, uuid.UUID):
            # Если передан ID, ищем соответствующую модель
            try:
                return self.model.objects.get(id=data)
            except self.model.DoesNotExist:
                raise serializers.ValidationError(
                    f"{self.model.__name__} with this ID does not exist."
                )
        elif isinstance(data, dict):
            # Если передан объект, создаём новую сущность через сериализатор
            instance_serializer = self.serializer_class(data=data)
            instance_serializer.is_valid(raise_exception=True)
            return instance_serializer.save()
        raise serializers.ValidationError(
            f"Invalid data type for {self.model.__name__} field."
        )

    def to_representation(self, value):
        # Используем сериализатор для представления данных
        return self.serializer_class(value).data


class DictionaryDynamicModelField(DynamicModelField):
    def to_internal_value(self, data):
        # Если передано наименование, то ищем соответствующую модель, либо создаём новую при отсутствии
        if isinstance(data, str) and not is_uuidv4(data):
            instance = self.model.objects.filter(
                models.Q(name__icontains=data) | models.Q(synonyms__icontains=data)
            ).first()
            if instance is None:
                return self.model.objects.create(name=data)
            return instance
        return super().to_internal_value(data)


class FullyWritableProductSerializer(ProductSerializer):
    nutrition = NutritionSerializer()
    # unit = DictionaryDynamicModelField(model=Unit, serializer_class=UnitSerializer, default=None)
    unit = DictionaryDynamicModelField(model=Unit, serializer_class=UnitSerializer, default=ProjectSettings.objects.first().default_unit)
    category = DictionaryDynamicModelField(
        model=Category, serializer_class=CategorySerializer
    )
    images = ProductImageSerializer(many=True)

    class Meta(ProductSerializer.Meta):
        list_serializer_class = FullyWritableProductListSerializer

    def __init__(self, *args, data=fields.empty, **kwargs):
        super().__init__(*args, data=data, **kwargs)
        if self.context.get("request") and data is not fields.empty:
            self.initial_data["user"] = self.context["request"].user.user_id


class MessageSerializer(AppModelSerializer):
    class Meta(AppModelSerializer.Meta):
        model = UserMessage


class ProjectSettingsSerializer(AppModelSerializer):
    class Meta(AppModelSerializer.Meta):
        model = ProjectSettings
        
class ProductRecognizeSerializer(serializers.Serializer):
    image = ImageFieldFromURL(required=True)
    
    class Meta:
        pass