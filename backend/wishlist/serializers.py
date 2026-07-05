from rest_framework import serializers
from .models import Wishlist
from products.models import Product
from products.serializers import ProductSerializer


class WishlistSerializer(
    serializers.ModelSerializer
):

    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all()
    )

    class Meta:
        model = Wishlist

        fields = [
            "id",
            "product",
            "created_at",
            "user"
        ]

        extra_kwargs = {
            "user": {
                "read_only": True
            }
        }

    def to_representation(
        self,
        instance
    ):

        data = super().to_representation(
            instance
        )

        data["product"] = (
            ProductSerializer(
                instance.product
            ).data
        )

        return data
