import typing
from django.db import models
from django.db.models import Q
from django.utils.translation import gettext as _

from backend.base.models import DictionaryModel, BaseAppModel
from recipes.constants import NAME_MEAL_TYPE_CHOICES, NameMealType
from accounts.models import CustomUser

from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFit


class Nutrition(BaseAppModel):
    protein = models.FloatField(default=0)
    fat = models.FloatField(default=0)
    carbohydrates = models.FloatField(default=0)
    calories = models.FloatField(default=0, editable=False)

    def save(self, *args, **kwargs):
        # Пересчёт калорий
        self.calories = (self.protein * 4) + (self.fat * 9) + (self.carbohydrates * 4)
        super().save(*args, **kwargs)

    # @property
    # def calories(self):
    #     return (self.protein * 4) + (self.fat * 9) + (self.carbohydrates * 4)

    class Meta(BaseAppModel.Meta):
        db_table = "nutritions"


class Unit(DictionaryModel):

    class Meta(DictionaryModel.Meta):
        db_table = "units"

class CategoryQuerySet(models.QuerySet):
    def default_ordering(self):
        return self.order_by('-priority', 'name')

class Category(DictionaryModel):
    parent_category = models.ForeignKey(
        "Category", null=True, on_delete=models.CASCADE, related_name="child_category"
    )
    priority = models.PositiveIntegerField(_("Приоритет порядка выдачи"), default=0)
    
    objects = CategoryQuerySet.as_manager()

    class Meta(DictionaryModel.Meta):
        db_table = "categories"
        indexes = [
            models.Index(fields=['name']),
        ]

    def __str__(self):
        return self.name


def image_path(instance, filename):
    prefix = "other"
    if isinstance(instance, Recipe):
        prefix = "recipes"
    if isinstance(instance, ProductImage):
        prefix = "products"
    if isinstance(instance, Product):
        prefix = "products"
    return f"{prefix}/{instance.id}/{filename}"


class ProductQuerySet(models.QuerySet):
    def top_products_for_user(
        self,
        user: typing.Union[str, CustomUser, None] = None,
        mealtime_type: typing.Optional[str] = None,
    ):
        """
        Возвращает queryset продуктов, отсортированных по популярности. Приоритет сортировки следующий:
        1. Продукты, популярные среди указанного пользователя (если пользователь передан).
        2. Продукты, популярные среди всех пользователей.
        3. Продукты, популярные для указанного типа приёма пищи (если параметр передан).

        Аргументы:
            user (Union[str, CustomUser, None], optional):
                Пользователь, для которого подбираются продукты.
                Может быть строкой (ID пользователя) или экземпляром CustomUser. Если не указан,
                учитывается только популярность продуктов среди всех пользователей.
            mealtime_type (Optional[str], optional):
                Тип приёма пищи для сортировки продуктов (например, "breakfast", "lunch", "dinner").
                Если не указан, этот параметр игнорируется.

        Возвращает:
            models.QuerySet: QuerySet продуктов, отсортированных по следующим критериям:
                1. Популярность среди указанного пользователя (если пользователь передан).
                2. Популярность среди всех пользователей (occur_mealtime).
                3. Популярность для указанного типа приёма пищи (occur_mealtime_by_type, если передан mealtime_type).
                4. Общее количество использований продукта (count_for_one_product).

        Примеры:
            Получение популярных продуктов для конкретного пользователя:
            >>> user = CustomUser.objects.get(user_id="12345")
            >>> popular_products = Product.objects.top_products_for_user(user=user)

            Получение популярных продуктов для конкретного пользователя с учётом завтрака:
            >>> user = CustomUser.objects.get(user_id="12345")
            >>> breakfast_products = Product.objects.top_products_for_user(user=user, mealtime_type="breakfast")

            Получение популярных продуктов среди всех пользователей:
            >>> all_popular_products = Product.objects.top_products_for_user()

            Получение популярных продуктов среди всех пользователей с учётом ужина:
            >>> dinner_products = Product.objects.top_products_for_user(mealtime_type="dinner")

        Заметки:
            - Аргумент `mealtime_type` должен соответствовать одному из значений в `NAME_MEAL_TYPE_CHOICES`,
            чтобы сортировка по типу приёма пищи работала корректно.
            - Если `user` не указан, результаты не будут различаться между пользовательской и глобальной популярностью.
        """

        user_id = user.user_id if isinstance(user, CustomUser) else user

        # Продукты конкретного пользователя
        # user_products = (
        #     # self.filter(mealtimes__diary__user__user_id=user_id) if user_id else self
        # )
        products = self

        # Счётчик использования продукта
        # count_uses_subquery = (
        #     MealTime.objects.filter(
        #         product__id=models.OuterRef("pk"),
        #     )
        #     .values("product")
        #     .annotate(count_count=models.Count("count"))
        #     .values("count_count")
        #     .order_by("-count_count")
        # )

        # Аннотация популярности для конкретного типа приёма пищи
        # if mealtime_type:
        #     occur_mealtime_by_type = models.Count(
        #         "mealtimes__product", filter=Q(mealtimes__name=mealtime_type)
        #     )
        #     products = products.annotate(occur_mealtime_by_type=occur_mealtime_by_type)
        
        user_products_ids = list(MealTime.objects.filter(diary__user__user_id=user_id).values_list('product_id', flat=True))
        # Аннотации для подсчёта
        products = products.annotate(
            # occur_mealtime=models.Count("mealtimes__product"),
            # count_for_one_product=models.Subquery(count_uses_subquery[:1]),
            is_user_product=models.Case(
                models.When(id__in=user_products_ids, then=models.Value(True)),  # Если id в списке, то True
                default=models.Value(False),  # Иначе False
                output_field=models.BooleanField()  # Тип поля — boolean
            )
            #  is_user_product=(
            #     models.Exists(
            #         MealTime.objects.filter(
            #             product__id=models.OuterRef("pk"),
            #             diary__user__user_id=user_id,
            #         )
            #     )
            #     if user_id
            #     else models.Value(False, output_field=models.BooleanField())
            # ),
        )

        # Сортировка
        ordering_fields = [
            "-is_user_product",  # Сначала продукты конкретного пользователя
            "-total_mealtimes",  # Затем по общему количеству приёмов пищи
            # "-count_for_one_product",  # Далее по количеству использований среди всех
            "id", # Добавил для корректной пагинации
        ]

        if mealtime_type:
            ordering_fields.insert(
                1, f"-total_mealtimes_by_{mealtime_type}"
            )  # Сортировка по типу приёма пищи

        sorted_products = products.order_by(*ordering_fields)

        return sorted_products


class Product(BaseAppModel):
    name = models.CharField(max_length=900)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    # Нутриентов на количество в одной единице продуктов. Например, на одну пачку печеньев
    nutrition = models.OneToOneField(Nutrition, on_delete=models.CASCADE)
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE)
    brand = models.CharField(default="", max_length=128, null=True)
    barcode = models.CharField(default=None, max_length=20, null=True)
    quantity = models.FloatField(default=100)
    data_accepted = models.BooleanField(default=False)
    user = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, related_name="products", verbose_name=_("author of product")
    )
    product_info_owner = models.CharField(max_length=128, default=None, null=True, verbose_name=_("Владелец информации о продукте"))

    objects = ProductQuerySet.as_manager()
    
    
    total_mealtimes = models.IntegerField(_("Количество приёмов пищи. Вычисляется при добавлении/уменьшении MealTime"), default=0)
    total_mealtimes_by_breakfast = models.IntegerField(default=0)
    total_mealtimes_by_lunch = models.IntegerField(default=0)
    total_mealtimes_by_dinner = models.IntegerField(default=0)
    total_mealtimes_by_snack = models.IntegerField(default=0)

    class Meta:
        db_table = "products"
        constraints = [
            models.UniqueConstraint(
                fields=["barcode"],
                name="unique_barcode",
                condition=Q(barcode__isnull=False),
            )
        ]
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['category']),
            models.Index(fields=['brand']),
        ]

    def __str__(self):
        return self.name
    
class UserMessage(BaseAppModel):
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="user_messages"
    )
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, null=True, related_name="user_messages"
    )
    reviewed = models.BooleanField(default=False)
    message = models.CharField(verbose_name="Text of message", max_length=512)

    class Meta:
        db_table = "user_messages"


class ProductImage(BaseAppModel):
    image = ProcessedImageField(
        upload_to=image_path,
        blank=True,
        processors=[ResizeToFit(800, 800)],  # Максимальные размеры
        format='JPEG',
        options={'quality': 70}
    )
    image_link = models.URLField(max_length=512, blank=True)
    # f.e. photo_back, photo_front
    tag = models.CharField(max_length=128, blank=True)
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="images"
    )

    class Meta:
        db_table = "product_images"


class Recipe(Product):
    ingredients = models.ManyToManyField(
        "Product", blank=True, related_name="recipe_products"
    )
    cooking_time_seconds = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "recipes"


class Instruction(BaseAppModel):
    name = models.CharField(max_length=900)
    image = models.ImageField(upload_to="instructions/", null=True, blank=True)
    order = models.PositiveIntegerField()
    description = models.TextField(default="", blank=True)
    recipe = models.ForeignKey(
        "Recipe", on_delete=models.CASCADE, related_name="instructions"
    )

    class Meta:
        db_table = "instructions"


class DiaryQuerySet(models.QuerySet):
    def create_empty_template_diary(self, *args, **kwargs):
        target_nutrition = Nutrition.objects.create()
        template_diary = Diary.objects.create(
            *args, date=None, nutrition_target=target_nutrition, **kwargs
        )

        return template_diary


class Diary(BaseAppModel):
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="diaries"
    )
    # null разрешён только для дефолтного дневника (который берётся за основу на остальные дни)
    date = models.DateField(null=True)
    nutrition_target = models.OneToOneField(
        Nutrition, on_delete=models.CASCADE, related_name="diary"
    )

    class Meta:
        db_table = "diaries"
        constraints = [
            models.UniqueConstraint(
                fields=["user", "date"],
                name="only_one_null_date_constraint",  # только один профиль на одну дату
            )
        ]

    objects = DiaryQuerySet.as_manager()


class MealTime(BaseAppModel):
    name = models.CharField(
        choices=NAME_MEAL_TYPE_CHOICES,
        default=NameMealType.BREAKFAST,
        verbose_name="name",
        max_length=20,
    )
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="mealtimes"
    )
    count = models.FloatField(default=1)
    count_fractions_in_product = models.PositiveIntegerField(null=True)
    diary = models.ForeignKey(Diary, on_delete=models.CASCADE, related_name="mealtimes")

    class Meta(BaseAppModel.Meta):
        db_table = "mealtimes"


class ProjectSettings(BaseAppModel):
    default_unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name="project_settings", null=True, verbose_name=_("Единица измерения по умолчанию"))
    text_of_the_agreement = models.TextField(verbose_name=_("Текст соглашения"), null=True)
    
    class Meta(BaseAppModel.Meta):
        db_table = "project_settings"