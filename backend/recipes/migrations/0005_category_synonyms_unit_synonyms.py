# Generated by Django 5.0.7 on 2024-11-23 20:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0004_product_data_accepted'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='synonyms',
            field=models.CharField(default='', max_length=900),
        ),
        migrations.AddField(
            model_name='unit',
            name='synonyms',
            field=models.CharField(default='', max_length=900),
        ),
    ]
