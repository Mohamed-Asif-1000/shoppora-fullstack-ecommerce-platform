from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):

    email = models.EmailField(unique=True)

    ROLE_CHOICES = (
        ('customer', 'Customer'),
        ('seller', 'Seller'),
        ('delivery', 'Delivery'),
        ('admin', 'Admin'),
    )

    role = models.CharField(
        max_length=30,
        choices=ROLE_CHOICES,
        default='customer'
    )

    phone = models.CharField(
        max_length=20,
        blank=True,
        default=''
    )

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('disabled', 'Disabled'),
    )

    approval_status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='approved'
    )

    def save(self, *args, **kwargs):
        self.is_active = self.approval_status == 'approved'
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username


class Address(models.Model):

    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='addresses'
    )

    type = models.CharField(
        max_length=50
    )

    address = models.TextField()

    default = models.BooleanField(
        default=False
    )

    def __str__(self):
        return f'{self.user.username} - {self.type}'
