from django.contrib import admin

from accounts.models import CustomUser
from django.contrib.auth.admin import UserAdmin
from rest_framework.authtoken.admin import TokenAdmin

admin.site.register(CustomUser, UserAdmin)

TokenAdmin.raw_id_fields = ['user']