import random
from accounts.models import CustomUser
from faker import Faker
from django.core.management.base import BaseCommand
from recipes.constants import NameMealType
from recipes.models import MealTime, Nutrition, Product, Unit, Category, Ingredient, Recipe, Instruction

users = list(CustomUser.objects.all())

class Command(BaseCommand):
    help = 'Populate the database with random data'

    def handle(self, *args, **kwargs):
        fake = Faker()

        # Создание данных для модели Unit
        units = []
        for _ in range(5):  # Создание 5 единиц измерения
            unit = Unit.objects.create(
                name=fake.word(),
                # default_value=random.randint(1, 1000)
                # description=fake.sentence(),
            )
            units.append(unit)

        # Создание данных для модели Category
        categories = []
        for _ in range(5):  # Создание 5 категорий
            category = Category.objects.create(
                name=fake.word(),
                # description=fake.sentence(),
            )
            categories.append(category)

        # Создание данных для модели Nutrition и Ingredient
        ingredients = []
        for _ in range(20):  # Создание 20 ингредиентов
            nutrition = Nutrition.objects.create(
                protein=random.uniform(0, 100),
                fat=random.uniform(0, 100),
                carbohydrates=random.uniform(0, 100),
            )

            ingredient = Product.objects.create(
                name=fake.word(),
                category=random.choice(categories),
                nutrition=nutrition,
                unit=random.choice(units),
            )
            ingredients.append(ingredient)

        # Создание данных для модели Recipe
        recipes = []
        for _ in range(10):  # Создание 10 рецептов
            nutrition = Nutrition.objects.create(
                protein=random.uniform(0, 100),
                fat=random.uniform(0, 100),
                carbohydrates=random.uniform(0, 100),
            )

            recipe = Recipe.objects.create(
                name=fake.word(),
                category=random.choice(categories),
                nutrition=nutrition,
                unit=random.choice(units),
                cooking_time_seconds=random.randint(0, 60*10)
            )
            recipe.ingredients.set(random.sample(ingredients, k=random.randint(1, 5)))
            recipes.append(recipe)

        # Создание данных для модели Instruction
        for recipe in recipes:
            for i in range(1, random.randint(2, 5)):  # Создание 2-5 инструкций для каждого рецепта
                Instruction.objects.create(
                    name=fake.word(),
                    recipe=recipe,
                    order=i,
                    description=fake.text(),
                )

        self.stdout.write(self.style.SUCCESS('Database populated with random data!'))
