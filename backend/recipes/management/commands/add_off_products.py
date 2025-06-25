from django.core.management.base import BaseCommand

import csv
import os
import sys

from recipes.serializers import OFFProductDetailSerializer
from recipes.views import save_off_products


def append_json_to_csv(json_data, csv_filename):
    """
    Добавляет данные из JSON в CSV файл построчно. Если файл не существует, он будет создан.
    Набор столбцов фиксирован.

    :param json_data: Данные в формате JSON для записи в CSV.
    :param csv_filename: Имя CSV файла для записи.
    """
    # Задаем статичный набор полей
    fieldnames = [
        "code",
        "product_name",
        "product_name_en",
        "product_name_ru",
        "product_quantity",
        "image_url",
        "brands",
        "categories",
        "proteins_100g",
        "fat_100g",
        "carbohydrates_100g",
    ]

    # Открываем CSV файл в режиме добавления
    with open(csv_filename, mode="a", newline="", encoding="utf-8-sig") as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)

        # Если файл пустой, записываем заголовки
        file.seek(0, 2)  # Перемещаем курсор в конец файла
        if file.tell() == 0:
            writer.writeheader()  # Записываем заголовки

        # Преобразуем данные JSON в словарь, соответствующий фиксированным столбцам
        flat_data = {
            "code": json_data.get("code", ""),
            "product_name": json_data.get("product_name", ""),
            "product_name_en": json_data.get("product_name_en", ""),
            "product_name_ru": json_data.get("product_name_ru", ""),
            "product_quantity": json_data.get("product_quantity", ""),
            "image_url": json_data.get("image_url", ""),
            "brands": json_data.get("brands", ""),
            "categories": json_data.get("categories", ""),
            "proteins_100g": json_data.get("nutriments", {}).get("proteins_100g", ""),
            "fat_100g": json_data.get("nutriments", {}).get("fat_100g", ""),
            "carbohydrates_100g": json_data.get("nutriments", {}).get(
                "carbohydrates_100g", ""
            ),
        }

        # Записываем строку данных в CSV
        writer.writerow(flat_data)

    print(f"Данные успешно добавлены в файл {csv_filename}")


def safe_increase_field_size_limit():
    """
    Увеличивает лимит длины поля до максимально возможного значения для текущей платформы.
    """
    try:
        # Получаем текущий лимит
        current_limit = csv.field_size_limit()
        # Устанавливаем максимально возможное значение (ограничим, чтобы избежать OverflowError)
        csv.field_size_limit(
            min(sys.maxsize, 10**9)
        )  # Устанавливаем безопасное значение
        print(f"Лимит длины поля увеличен: {current_limit} -> {csv.field_size_limit()}")
    except OverflowError as e:
        print(f"Ошибка: {e}. Лимит длины поля остался {csv.field_size_limit()}.")


def parse_off_products_csv(file_path, delimiter="\t", start_row=1, process_row=None):
    last_row_index = -1
    safe_increase_field_size_limit()
    with open(file_path, mode="r", encoding="utf-8-sig") as file:
        try:
            rows = csv.DictReader(file, delimiter=delimiter)
            # print(next(reader))
            # print(reader.fieldnames) # вывод колонок
            for row_index, row in enumerate(rows, start=start_row):
                last_row_index = row_index
                process_row(row, row_index)
        except Exception as exc:
            print(f"Ошибка в строке {last_row_index}: {exc}")


def retrieve_our_fields_from_row(row, row_index):
    # if 'ru' in row.get('lang', ''):
    # if "russia" in row.get("countries"):
    serializer = OFFProductDetailSerializer(data={**row, "nutriments": row})
    if serializer.is_valid(raise_exception=False):
        print(f"Добавление строки {row_index}")
        append_json_to_csv(
            serializer.data,
            os.path.join(os.getcwd(), "backend", "recipes", "scripts", "data.csv"),
        )


class Command(BaseCommand):
    # Command example
    # django-admin add_off_products C:/Users/RyDVi/Documents/dev/foodstat/parsed.11.01.2025.fr.openfoodfacts.org.products.csv
    help = "Populate the database with off products data"

    def add_arguments(self, parser):
        parser.add_argument("csv_path", type=str)

    def handle(self, *args, **kwargs):
        csv_path = kwargs.get("csv_path")
        bulk_size = kwargs.get("bulk_size", 1)
        start_row = kwargs.get("start_row", 0)
        if not os.path.isfile(csv_path):
            self.stdout.write(self.style.ERROR(f"Файл по пути '{csv_path}' не найден"))
            return
        csv_path = os.path.abspath(csv_path)

        products = []

        def add_product(row, row_index):
            products.append({"product": {**row, "nutriments": {**row}}})

        parse_off_products_csv(
            csv_path,
            delimiter=",",
            start_row=start_row,
            process_row=add_product,
        )

        for slice_index in range(0, int(len(products) / bulk_size)):
            self.stdout.write(
                self.style.HTTP_INFO(f"Adding from {start_row + slice_index * bulk_size} to {start_row + slice_index * bulk_size + bulk_size}")
            )
            try:
                save_off_products(
                    products[slice_index * bulk_size : slice_index * bulk_size + bulk_size]
                )
            except Exception as exc:
                self.stdout.write(
                    self.style.ERROR(f"Error in row {start_row + slice_index * bulk_size}: {exc}")
                )

        self.stdout.write(
            self.style.SUCCESS("Database populated with off products data!")
        )
