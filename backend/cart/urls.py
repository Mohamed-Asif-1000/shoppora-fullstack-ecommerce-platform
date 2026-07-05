from django.urls import path

from .views import (
    cart_list,
    add_cart,
    remove_cart
)

urlpatterns = [

    path(
        '',
        cart_list
    ),

    path(
        'add/',
        add_cart
    ),

    path(
        'remove/<int:id>/',
        remove_cart
    ),

]
