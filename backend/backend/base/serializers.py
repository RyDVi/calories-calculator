from drf_writable_nested.serializers import WritableNestedModelSerializer

class AppModelSerializer(WritableNestedModelSerializer):
    class Meta:
        fields = "__all__"

        
        
class DictionarySerializer(AppModelSerializer):
    class Meta(AppModelSerializer.Meta):
        pass