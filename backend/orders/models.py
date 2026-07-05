from django.db import models
from accounts.models import CustomUser
from products.models import Product


class Order(models.Model):

    PAYMENT = [
        ('COD', 'Cash On Delivery'),
        ('UPI', 'UPI')
    ]

    STATUS = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled')
    ]
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE
    )

    delivery_agent = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='delivery_orders'
    )

    total = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    address = models.TextField()

    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS,
        default='pending'
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f'Order {self.id}'


class OrderItem(models.Model):

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items'
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )

    quantity = models.IntegerField(
        default=1
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    def __str__(self):
        return self.product.title
