from django.db import models
from accounts.models import CustomUser


class Product(models.Model):

    seller = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='products',
    )

    title = models.CharField(max_length=200)

    image = models.ImageField(upload_to='products/')

    price = models.IntegerField()

    oldprice = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    badge = models.CharField(max_length=100)

    BADGE_COLORS = [
        ('bg-red-500', 'Red'),
        ('bg-pink-500', 'Pink'),
        ('bg-cyan-500', 'Cyan'),
        ('bg-purple-500', 'Purple'),
    ]

    badgeColor = models.CharField(
        max_length=100,
        choices=BADGE_COLORS,
        default='bg-red-500'
    )

    rating = models.FloatField(default=0)

    buyers = models.IntegerField(default=0)

    category = models.CharField(max_length=100)

    stock = models.IntegerField(default=0)

    description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
