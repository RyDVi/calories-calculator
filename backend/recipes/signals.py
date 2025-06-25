from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db import models

from backend.settings import opensearch_client
from .models import MealTime, Product

from opensearchpy import NotFoundError


@receiver(post_save, sender=Product)
def update_document(sender, instance=None, created=False, **kwargs):
    document = {
        'id': instance.id,
        'name': instance.name,
        'brand': instance.brand,
        'category': {'name': instance.category.name},
    }
    opensearch_client.index(index='products', id=instance.id, body=document)

@receiver(post_delete, sender=Product)
def delete_document(sender, instance=None, **kwargs):
    try:
        opensearch_client.delete(index='products', id=instance.id)
    except NotFoundError:
        print(f"Документ с id={instance.id} не найден в OpenSearch")

@receiver(post_save, sender=MealTime)
def update_total_mealtimes_on_create(sender, instance, created, **kwargs):
    if created:
        updates = {
            "total_mealtimes": models.F("total_mealtimes") + 1,
            f"total_mealtimes_by_{instance.name}": models.F(f"total_mealtimes_by_{instance.name}") + 1
        }
        Product.objects.filter(id=instance.product_id).update(**updates)

@receiver(post_delete, sender=MealTime)
def update_total_mealtimes_on_delete(sender, instance, **kwargs):
    updates = {
        "total_mealtimes": models.F("total_mealtimes") - 1,
        f"total_mealtimes_by_{instance.name}": models.F(f"total_mealtimes_by_{instance.name}") - 1
    }
    Product.objects.filter(id=instance.product_id).update(**updates)