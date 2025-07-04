# Generated by Django 5.0.7 on 2025-02-06 13:38

from django.db import migrations, models

def update_product_counts(apps, schema_editor):
    Product = apps.get_model("recipes", "Product")
    MealTime = apps.get_model("recipes", "MealTime")

    # Агрегация данных по продуктам
    from django.db.models import Count

    product_data = (
        MealTime.objects.values("product_id")
        .annotate(
            total_mealtimes=Count("id"),
            total_mealtimes_by_breakfast=Count(
                "id", filter=models.Q(name="breakfast")
            ),
            total_mealtimes_by_lunch=Count("id", filter=models.Q(name="lunch")),
            total_mealtimes_by_dinner=Count("id", filter=models.Q(name="dinner")),
            total_mealtimes_by_snack=Count("id", filter=models.Q(name="snack")),
        )
        .values("product_id", "total_mealtimes", "total_mealtimes_by_breakfast", "total_mealtimes_by_lunch", "total_mealtimes_by_dinner", "total_mealtimes_by_snack")
    )

    # Обновление полей продуктов
    for data in product_data:
        product_id = data["product_id"]
        total_mealtimes = data["total_mealtimes"]
        total_mealtimes_by_breakfast = data["total_mealtimes_by_breakfast"]
        total_mealtimes_by_lunch = data["total_mealtimes_by_lunch"]
        total_mealtimes_by_dinner = data["total_mealtimes_by_dinner"]
        total_mealtimes_by_snack = data["total_mealtimes_by_snack"]
        

        Product.objects.filter(id=product_id).update(
            total_mealtimes=total_mealtimes,
            total_mealtimes_by_breakfast=total_mealtimes_by_breakfast,
            total_mealtimes_by_lunch=total_mealtimes_by_lunch,
            total_mealtimes_by_dinner=total_mealtimes_by_dinner,
            total_mealtimes_by_snack=total_mealtimes_by_snack
        )

class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0017_category_categories_name_98d7d5_idx_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='total_mealtimes',
            field=models.IntegerField(default=0, verbose_name='Количество приёмов пищи. Вычисляется при добавлении/уменьшении MealTime'),
        ),
        migrations.AddField(
            model_name='product',
            name='total_mealtimes_by_breakfast',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='product',
            name='total_mealtimes_by_dinner',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='product',
            name='total_mealtimes_by_lunch',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='product',
            name='total_mealtimes_by_snack',
            field=models.IntegerField(default=0),
        ),
        migrations.RunPython(update_product_counts, migrations.RunPython.noop)
    ]
