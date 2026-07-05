from django.urls import path

from .views import (
    seller_products,
    add_product,
    update_product,
    delete_product
)

urlpatterns = [

    path(
        '',
        seller_products
    ),

    path(
        'add/',
        add_product
    ),

    path(
        'update/<int:id>/',
        update_product
    ),

    path(
        'delete/<int:id>/',
        delete_product
    ),

]
