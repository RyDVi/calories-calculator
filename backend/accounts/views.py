import json
import requests
from rest_framework.authtoken.views import ObtainAuthToken, APIView
from rest_framework.response import Response
from rest_framework import generics, permissions, serializers


from accounts.models import CustomUser, TelegramUser, UserSettings, VKUser
from accounts.serializers import (
    RegisterSerializer,
    RegisterTelegramUserSerializer,
    RegisterVKUserSerializer,
    UserAuthSerializer,
    UserSettingsSerializer,
)
from backend.settings import VK_TOKEN
from backend.telegram.utils import (
    retrieve_tg_init_data,
    verify_telegram_auth_for_website,
)

from rest_framework.authentication import TokenAuthentication

class CustomAuthToken(ObtainAuthToken):
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=request.data, context=self.get_serializer_context()
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        # token, created = Token.objects.get_or_create(user=user)
        return Response(UserAuthSerializer(instance=user).data)


class ExternalServiceOAuthToken(ObtainAuthToken):
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.AllowAny]

    def tg_mini_app_auth(self, tg_init_data_raw):
        init_data = retrieve_tg_init_data(tg_init_data_raw)
        if not init_data:
            raise serializers.ValidationError(
                {"tg_init_data_raw": "tg_init_data_raw is not correct"}
            )

        try:
            tg_user = TelegramUser.objects.get(tg_id=init_data["user"]["id"])
            user = tg_user.user
        except TelegramUser.DoesNotExist:
            serializer = RegisterTelegramUserSerializer(
                data={**init_data["user"], "tg_user": init_data["user"]}
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            user = serializer.instance

        return user

    def tg_website_auth(self, tg_website_user):
        if not verify_telegram_auth_for_website(tg_website_user):
            raise serializers.ValidationError(
                {"tg_website_user": "tg_website_user is not correct"}
            )

        try:
            tg_user = TelegramUser.objects.get(tg_id=tg_website_user.get("id"))
            user = tg_user.user
        except TelegramUser.DoesNotExist:
            serializer = RegisterTelegramUserSerializer(
                data={**tg_website_user, "tg_user": tg_website_user}
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            user = serializer.instance

        return user

    def vk_website_auth(self, vk_website_user):
        try:
            vk_user = VKUser.objects.get(vk_id=vk_website_user.get("user_id"))
            user = vk_user.user
        except VKUser.DoesNotExist:
            # TODO: передалать на API класс
            result = requests.post(
                "https://id.vk.com/oauth2/user_info",
                data={
                    "client_id": VK_TOKEN,  # идентификатор приложения
                    "access_token": vk_website_user.get("access_token"),
                },
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            )
            vk_user_response = json.loads(result.text).get("user")
            serializer = RegisterVKUserSerializer(
                data={
                    **vk_website_user,
                    **vk_user_response,
                    "vk_user": {
                        **vk_website_user,
                        **vk_user_response,
                        "vk_id": vk_website_user.get("user_id", vk_user_response.get('user_id')),
                    },
                }
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            user = serializer.instance

        return user

    def post(self, request, *args, **kwargs):
        tg_init_data_raw = request.data.get("tg_init_data_raw")
        tg_website_user = request.data.get("tg_website_user")
        vk_website_user = request.data.get("vk_website_user")
        try:
            if not tg_init_data_raw and not tg_website_user and not vk_website_user:
                raise serializers.ValidationError(
                    {
                        "tg_init_data_raw": "tg_init_data_raw, tg_website_user, vk_website_user is required"
                    }
                )
            if tg_init_data_raw:
                user = self.tg_mini_app_auth(tg_init_data_raw)
            elif tg_website_user:
                user = self.tg_website_auth(tg_website_user)
            elif vk_website_user:
                user = self.vk_website_auth(vk_website_user)
        except serializers.ValidationError as exc:
            return Response(exc.detail, status=403)

        # token, created = Token.objects.get_or_create(user=user)
        return Response(UserAuthSerializer(instance=user).data)


class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer


class UserSettingsView(APIView):
    queryset = UserSettings.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        user_settings = UserSettings.objects.get_or_create(user=request.user)[0]
        serializer = UserSettingsSerializer(instance=user_settings)
        return Response(serializer.data)
        
    def put(self, request, *args, **kwargs):
        user_settings = UserSettings.objects.get_or_create(user=request.user)[0]
        serializer = UserSettingsSerializer(instance=user_settings, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)