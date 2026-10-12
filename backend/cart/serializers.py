from rest_framework import serializers
from .models import Cart


class CartSerializer(
    serializers.ModelSerializer
):

    title = serializers.CharField(
        source='product.title',
        read_only=True,
    )

    image = serializers.ImageField(
        source='product.image',
        read_only=True,
    )

    price = serializers.IntegerField(
        source='product.price',
        read_only=True,
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
