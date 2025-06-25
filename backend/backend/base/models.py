from django.db import models
import uuid


class BaseAppModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True


class DictionaryModel(BaseAppModel):
    name = models.CharField(max_length=900, db_index=True, unique=True)
    synonyms = models.CharField(max_length=900, default="")

    class Meta:
        abstract = True
