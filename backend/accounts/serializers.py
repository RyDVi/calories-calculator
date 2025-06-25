import random
import string
from rest_framework import serializers
from accounts.models import CustomUser, TelegramUser, UserSettings, VKUser
from django.db import transaction

from backend.base.serializers import AppModelSerializer
from recipes.models import Diary


def generate_simple_password(length=8):
    """
    Генерирует простой пароль из букв и цифр.

    :param length: Длина пароля (по умолчанию 8 символов)
    :return: Сгенерированный пароль
    """
    characters = string.ascii_letters + string.digits
    password = "".join(random.choice(characters) for i in range(length))
    return password


class TelegramUserSerialzier(serializers.ModelSerializer):
    class Meta:
        model = TelegramUser
        fields = "__all__"
        extra_kwargs = {
            "user": {"read_only": True},
            "username": {"required": False, "allow_null": True, "allow_blank": True},
        }


class VKUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = VKUser
        fields = "__all__"
        extra_kwargs = {
            "user": {"read_only": True},
            "username": {"required": False, "allow_null": True},
            "refresh_token": {"write_only": True},
            "access_token": {"write_only": True},
            "id_token": {"write_only": True},
            "vk_id": {"write_only": True},
            "token_type": {"write_only": True},
            "expires_in": {"write_only": True},
            "state": {"write_only": True},
            "scope": {"write_only": True},
        }


class UserAuthSerializer(serializers.ModelSerializer):
    tg_user = TelegramUserSerialzier(read_only=True)
    vk_user = VKUserSerializer(read_only=True)

    class Meta:
        model = CustomUser
        fields = (
            "username",
            "password",
            "first_name",
            "last_name",
            "auth_token",
            "tg_user",
            "vk_user",
            "user_id"
        )
        extra_kwargs = {
            "password": {"write_only": True, "required": False},
            "username": {"read_only": False},
            "auth_token": {"read_only": True},
            "tg_user": {"read_only": True},
            "vk_user": {"read_only": True},
        }


class RegisterSerializer(UserAuthSerializer):
    class Meta(UserAuthSerializer.Meta):
        extra_kwargs = {
            "password": {"required": False},
            "username": {
                "read_only": False,
                "required": False,
                "allow_null": True,
                "allow_blank": True,
            },
            "auth_token": {"read_only": True},
        }

    def validate(self, attrs):
        if not attrs.get("password"):
            attrs["password"] = generate_simple_password(4)
        if not attrs.get("username"):
            attrs["username"] = CustomUser.objects.next_username()
        if not attrs.get("first_name"):
            attrs["first_name"] = attrs["username"]
        if not attrs.get("last_name"):
            attrs["last_name"] = attrs["username"]
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        user = CustomUser.objects.create(
            username=validated_data["username"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
        )

        user.set_password(validated_data["password"])
        user.save()
        self.created_password = validated_data["password"]
        Diary.objects.create_empty_template_diary(user=user)
        return user

    def to_representation(self, instance):
        return {
            **super().to_representation(instance),
            "created_password": self.created_password,
        }


class RegisterTelegramUserSerializer(RegisterSerializer):
    tg_user = TelegramUserSerialzier()

    def validate(self, attrs):
        validated_attrs = super().validate(attrs)
        tg_user = attrs.get("tg_user")

        if not tg_user.get("username"):
            tg_user["username"] = (
                validated_attrs["username"] or CustomUser.objects.next_username()
            )
        if not tg_user.get("first_name"):
            tg_user["first_name"] = attrs["username"]
        if not tg_user.get("last_name"):
            tg_user["last_name"] = attrs["username"]
        if not tg_user.get("tg_id"):
            tg_user["tg_id"] = self.initial_data.get("id")

        validated_attrs["tg_user"] = tg_user
        return validated_attrs

    @transaction.atomic
    def create(self, validated_data):
        user = super().create(validated_data)
        tg_user = TelegramUser.objects.create(**validated_data["tg_user"], user=user)
        return user


class RegisterVKUserSerializer(RegisterSerializer):
    vk_user = VKUserSerializer()

    def validate(self, attrs):
        validated_attrs = super().validate(attrs)
        vk_user = attrs.get("vk_user")

        if not vk_user.get("username"):
            vk_user["username"] = (
                validated_attrs["username"] or CustomUser.objects.next_username()
            )
        if not vk_user.get("first_name"):
            vk_user["first_name"] = attrs["username"]
        if not vk_user.get("last_name"):
            vk_user["last_name"] = attrs["username"]

        validated_attrs["vk_user"] = vk_user
        return validated_attrs

    @transaction.atomic
    def create(self, validated_data):
        user = super().create(validated_data)
        vk_user = VKUser.objects.create(**validated_data["vk_user"], user=user)
        return user


class UserSettingsSerializer(AppModelSerializer):
    class Meta(AppModelSerializer.Meta):
        model = UserSettings
        extra_kwargs = {
            "user": {"read_only": True},
        }
