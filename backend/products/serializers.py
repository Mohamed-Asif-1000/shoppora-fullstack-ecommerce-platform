from rest_framework import serializers
from .models import Product
from accounts.models import CustomUser


class ProductSerializer(serializers.ModelSerializer):

    seller = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.filter(role='seller')
    )

    class Meta:
        model = Product
        fields = '__all__'
