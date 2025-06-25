from django.contrib import admin
from django.contrib.admin.widgets import AdminFileWidget
from django.utils.safestring import mark_safe
from django.db import models

from recipes.models import Category, Product, Instruction, MealTime, Nutrition, Recipe, Unit, UserMessage, ProductImage, ProjectSettings

admin.site.register(Recipe)
admin.site.register(Unit)
admin.site.register(Nutrition)
admin.site.register(Instruction)
admin.site.register(MealTime)
admin.site.register(ProductImage)

class CategoryrAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'synonyms', 'priority', 'parent_category')
    search_fields = ('name', 'synonyms')
    list_filter  = ['priority', 'name']
    formfield_overrides= {
        models.ForeignKey: { 'required': False },
        models.CharField: { 'required': False }
    }
    ordering = ('-priority', 'name')

admin.site.register(Category, CategoryrAdmin)
class AdminImageWidget(AdminFileWidget):

    def render(self, name, value, attrs=None, renderer=None):
        output = []

        if value and getattr(value, "url", None):
            image_url = value.url
            file_name = str(value)

            output.append(
                f' <a href="{image_url}" target="_blank">'
                f'  <img src="{image_url}" alt="{file_name}" width="300" height="300" '
                f'style="object-fit: contain;"/> </a>')

        output.append(super(AdminFileWidget, self).render(name, value, attrs, renderer))
        return mark_safe(u''.join(output))


class CollectionImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    formfield_overrides = {models.ImageField: {'widget': AdminImageWidget}}

class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'brand', 'barcode', 'data_accepted')
    search_fields = ('name', 'brand', 'barcode')
    list_filter  = ['data_accepted']
    inlines = [CollectionImageInline] 

admin.site.register(Product, ProductAdmin)

class UserMessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'product', 'message', 'reviewed')
    search_fields = ('id', 'user', 'product', 'message')
    list_filter  = ['reviewed']

admin.site.register(UserMessage, UserMessageAdmin)

admin.site.register(ProjectSettings)
