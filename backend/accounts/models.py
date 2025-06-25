import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.db.models.functions import Cast, Substr

from backend.base.models import BaseAppModel


class UserQuerySet(UserManager):
    def next_username(self, prefix="user"):
        # Длина префикса для корректного извлечения числовой части
        # +1 для учёта символа после префикса (например, 'user' -> 'user1')
        prefix_length = len(prefix) + 1

        # Регулярное выражение для фильтрации имён, соответствующих шаблону "prefix" + число
        regex_pattern = rf"^{prefix}\d+$"

        # Фильтруем пользователей с именами, соответствующими шаблону "prefix" + число
        user_profiles = self.filter(username__regex=regex_pattern)

        if not user_profiles.exists():
            # Если пользователей с таким шаблоном нет, возвращаем "prefix1"
            return f"{prefix}1"

        # Извлекаем числовую часть из username (начиная с позиции после префикса)
        user_profiles = user_profiles.annotate(
            number_part=Cast(Substr("username", prefix_length), models.IntegerField())
        )

        # Находим максимальное значение числовой части
        max_number = (
            user_profiles.order_by("-number_part")
            .values_list("number_part", flat=True)
            .first()
        )

        # Возвращаем новое имя: "prefix" + (максимальное число + 1)
        return f"{prefix}{max_number + 1}"


# Если вы хотите, чтобы у каждого пользователя был автоматически сгенерированный токен, вы можете просто перехватить сигнал пользователя
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)


class CustomUser(AbstractUser):
    user_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta(AbstractUser.Meta):
        pass

    objects = UserQuerySet()
    
class TelegramUser(BaseAppModel):
    user = models.OneToOneField(CustomUser, related_name="tg_user", on_delete=models.CASCADE)
    tg_id = models.BigIntegerField(null=True)
    username = models.CharField(max_length=128)
    last_name = models.CharField(max_length=128, blank=True)
    first_name = models.CharField(max_length=128, blank=True)
    photo_url = models.CharField(max_length=512, blank=True)
    
class VKUser(BaseAppModel):
    user = models.OneToOneField(CustomUser, related_name="vk_user", on_delete=models.CASCADE)
    username = models.CharField(max_length=128)
    last_name = models.CharField(max_length=128, blank=True)
    first_name = models.CharField(max_length=128, blank=True)
    avatar = models.CharField(max_length=1024, blank=True)
    sex = models.IntegerField()
    
    refresh_token = models.CharField(max_length=1024)
    access_token = models.CharField(max_length=1024)
    id_token = models.CharField(max_length=1024)
    token_type = models.CharField(max_length=128)
    expires_in = models.IntegerField()
    vk_id = models.IntegerField()
    state = models.CharField(max_length=128)
    scope = models.CharField(max_length=128)
    
class UserSettings(BaseAppModel):
    user = models.OneToOneField(CustomUser, related_name="user_settings", on_delete=models.CASCADE)
    language_code = models.CharField(max_length=5, null=True)
    
    class Meta(BaseAppModel.Meta):
        db_table = "user_settings"