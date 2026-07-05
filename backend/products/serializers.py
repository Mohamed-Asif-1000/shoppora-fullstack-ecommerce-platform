from rest_framework import serializers
from .models import Product
from accounts.models import CustomUser


class ProductSerializer(serializers.ModelSerializer):

    seller = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.filter(role='seller')
    )

    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Product
        fields = '__all__'
        extra_kwargs = {
            'image': {'required': False, 'allow_null': True},
        }
