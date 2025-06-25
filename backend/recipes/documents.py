from django_opensearch_dsl import Document, fields
from django_opensearch_dsl.registries import registry
from .models import Product, Category

@registry.register_document
class ProductDocument(Document):
    category = fields.ObjectField(properties={
        'name': fields.TextField(),
    })
    brand = fields.TextField()
    name = fields.TextField()

    class Index:
        name = 'products'  # Название индекса в OpenSearch
        settings = {
            'number_of_shards': 1,  # Количество шардов
            'number_of_replicas': 0  # Количество реплик
        }

    class Django:
        model = Product  # Модель Django
        fields = [
            'id',
            'barcode',
        ]
        related_models = [Category]  # Связанные модели

    def get_queryset(
        self,
        filter_ = None,
        exclude = None,
        count: int = None,
    ):
        return super().get_queryset(filter_, exclude, count).select_related('category')

    def get_instances_from_related(self, related_instance):
        if isinstance(related_instance, Category):
            return related_instance.product_set.all()
        
    def delete(self, instance, **kwargs):
        super().delete(instance, **kwargs)