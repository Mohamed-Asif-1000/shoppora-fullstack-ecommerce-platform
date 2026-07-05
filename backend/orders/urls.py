from django.urls import path
from .views import (
    create_order,
    order_list,
    seller_orders,
    delivery_orders,
    assign_delivery_agent,
    update_order_status,
)

urlpatterns = [
    path('', order_list),
    path('create/', create_order),
    path('seller/', seller_orders),
    path('delivery/', delivery_orders),
    path('assign-delivery/<int:order_id>/', assign_delivery_agent),
    path('update-status/<int:order_id>/', update_order_status),
]
