import gzip
import re
import json
import typing
from django.core.management.base import BaseCommand, CommandError
from recipes.models import (
    Nutrition,
    Product,
    ProductImage,
    Unit,
    Category,
)
from django.db import transaction


def get_image_url(product_data, image_name, resolution="full"):
    if "images" not in product_data or image_name not in product_data["images"]:
        return None
    base_url = "https://images.openfoodfacts.org/images/products"
    # get product folder name
    folder_name = product_data["code"]
    if len(folder_name) > 8:
        folder_name = re.sub(r"(...)(...)(...)(.*)", r"\1/\2/\3/\4", folder_name)
    # get filename
    if re.match("^\d+$", image_name):  # only digits
        # raw image
        resolution_suffix = "" if resolution == "full" else f".{resolution}"
        filename = f"{image_name}{resolution_suffix}.jpg"
    elif "rev" in product_data["images"][image_name]:
        # selected image
        rev = product_data["images"][image_name]["rev"]
        filename = f"{image_name}.{rev}.{resolution}.jpg"
    else:
        return None
    # join things together
    return f"{base_url}/{folder_name}/{filename}"


def parse_products_from_json_of_openfoodfacts(
    file: gzip.GzipFile, on_update: typing.Callable, *, start = 0
):
    product_data = []
    for i, line in enumerate(file, start):
        try:
            product = json.loads(line.decode("utf-8"))
        except json.decoder.JSONDecodeError:
            print("Error on line", i + 1, ":\n", repr(line))
        else:
            product_data = {
                "name": product.get("product_name"),
                "brand": product.get("brands"),
                "fat": product.get("nutriments", {}).get("fat"),
                "protein": product.get("nutriments", {}).get("proteins"),
                "carbohydrate": product.get("nutriments", {}).get("carbohydrates"),
                "calories": product.get("nutriments", {}).get("energy-kcal"),
                "energy": product.get("nutriments", {}).get("energy"),
                "images": (
                    [
                        get_image_url(product, image_name)
                        for image_name in product.get("images", {})
                    ]
                    if "images" in product
                    else []
                ),
                "unit": product.get("nutriments", {}).get(
                    "carbohydrates_unit",
                    product.get("nutriments", {}).get(
                        "fat_unit", product.get("nutriments", {}).get("proteins_unit")
                    ),
                ),
                "category": product.get("categories"),
                "barcode": product.get("code"),
            }
            on_update(product_data, i, product)


class Command(BaseCommand):
    help = "Parse Open Food Facts Database from JSON file"

    def add_arguments(self, parser):
        parser.add_argument("filename", type=str, help="Path to the gzip file")
        parser.add_argument("start_from", type=int, default=0)

    def handle(self, *args, **kwargs):
        filename = kwargs.get("filename")
        start_from = kwargs.get("start_from", 0)
        if not filename:
            raise CommandError("Filename is required")

        products_by_barcode = {
            product.barcode: product for product in Product.objects.all().filter(barcode__isnull=False)
        }

        failed_updates = []
        
        product_for_add = []
        nutritions_for_add = []
        images_for_add = []
        
        def save_products(start_from = 0, count = 1000):
            try:
                Nutrition.objects.bulk_create(nutritions_for_add[start_from:count], batch_size=count)
                Product.objects.bulk_create(product_for_add[start_from:count], batch_size=count)
                ProductImage.objects.bulk_create(images_for_add[start_from:count], batch_size=count)
                # del nutritions_for_add[iteration_index:count]
                # del product_for_add[iteration_index:count]
                # del images_for_add[iteration_index:count]
            except Exception as exc:
                print(f"Не удалось добавить продкуты в количестве {count}. Причина: {exc}")
            else:
                print(f"Продукты {start_from + 1} - {start_from + 1 + count} добавлены в базу")

        def on_parse_entry(entry):
            barcode = entry.get("barcode")
            if barcode and barcode in products_by_barcode or not entry.get("name"):
                print(f'not added {entry.get("name")}  {entry.get("barcode")}')
                return
            
            unit_name = entry.get("unit") or "unknown"
            unit, _ = Unit.objects.get_or_create(name=unit_name)

            # category_name = entry.get("category") or "unknown"
            category_name = "unknown"
            category, _ = Category.objects.get_or_create(name=category_name)

            nutrition = Nutrition(
                protein=entry.get("protein", 0) or 0,
                fat=entry.get("fat", 0) or 0,
                carbohydrates=entry.get("carbohydrates", 0) or 0,
            )
            # nutrition.save()
            nutritions_for_add.append(nutrition)

            product = Product(
                barcode=barcode,
                brand=entry.get("brand") or "",
                name=entry.get("name"),
                category=category,
                nutrition=nutrition,
                unit=unit,
            )
            product_for_add.append(product)
            # product.save()

            for image_url in entry.get("images", []):
                product_image = ProductImage(product=product, image_link=image_url)
                images_for_add.append(product_image)
            #     try:
            #         response = requests.get(image_url)
            #         response.raise_for_status()  # Вызывает исключение при ошибке HTTP
            #         image = Image.open(BytesIO(response.content))

            #         # Преобразуем изображение в байты
            #         image_io = BytesIO()
            #         image.save(image_io, format=image.format)

            #         # Преобразуем байты в Django File и сохраняем
            #         image_file = ContentFile(
            #             image_io.getvalue(),
            #             name=f"{barcode}_{random.randint(1, 100000)}.jpg",
            #         )
            #         product_image = ProductImage(image=image_file, product=product)
            #         product_image.save()
            #     except (requests.RequestException, IOError) as e:
            #         print(f"Failed to download image from {image_url}: {e}")

        def on_update_product(entry, iteration_index, initial_entry):
            try:
                on_parse_entry(entry)
            except Exception as exc:
                failed_updates.append(initial_entry)
                print(
                    f"{iteration_index + 1}. Не удалось добавить продукт в список {entry.get('name')}. Причина: {exc}"
                )
            else:
                print(f"{iteration_index + 1}. Продукт дообавлен в список {entry.get('name')}")
                count_elements = len(product_for_add)
                if count_elements % 1000 == 0:
                    save_products(count_elements - 1000, 1000)

        with gzip.open(filename, "rb") as f_in:
            print("Processing file...")
            parse_products_from_json_of_openfoodfacts(f_in, on_update_product, start=start_from)
            
        with gzip.GzipFile("failed_updates.json.gzip", "w") as f_out:
            f_out.write(
                "\n".join(
                    [json.dumps(failed_update) for failed_update in failed_updates]
                ).encode("utf-8")
            )
        # with open('failed_updates.json', 'w') as f_out:
