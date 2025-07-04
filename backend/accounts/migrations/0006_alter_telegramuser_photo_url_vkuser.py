# Generated by Django 5.0.7 on 2024-12-28 10:13

import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_telegramuser_photo_url_telegramuser_tg_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='telegramuser',
            name='photo_url',
            field=models.CharField(blank=True, max_length=512),
        ),
        migrations.CreateModel(
            name='VKUser',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('username', models.CharField(max_length=128)),
                ('last_name', models.CharField(blank=True, max_length=128)),
                ('first_name', models.CharField(blank=True, max_length=128)),
                ('avatar', models.CharField(blank=True, max_length=1024)),
                ('sex', models.IntegerField()),
                ('refresh_token', models.CharField(max_length=1024)),
                ('access_token', models.CharField(max_length=1024)),
                ('id_token', models.CharField(max_length=1024)),
                ('token_type', models.CharField(max_length=128)),
                ('expires_in', models.IntegerField()),
                ('vk_id', models.IntegerField()),
                ('state', models.CharField(max_length=128)),
                ('scope', models.CharField(max_length=128)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='vk_user', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
