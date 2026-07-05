from rest_framework import serializers
from .models import Cart


class CartSerializer(
    serializers.ModelSerializer
):

    title = serializers.CharField(
        source='product.title'
    )

    image = serializers.ImageField(
        source='product.image'
    )

    price = serializers.IntegerField(
        source='product.price'
    )

    class Meta:
        model = Cart

        fields = [
            'id',
            'quantity',
            'title',
            'image',
            'price',
            'created_at'
        ]
