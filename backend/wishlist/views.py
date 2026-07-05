from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Wishlist
from .serializers import WishlistSerializer


class WishlistView(
    generics.ListCreateAPIView
):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(
            user=self.request.user
        )

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user
        )


class WishlistDeleteView(
    generics.DestroyAPIView
):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(
            user=self.request.user
        )
