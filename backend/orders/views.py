from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from products.models import Product
from .models import Order, OrderItem
from cart.models import Cart
from django.shortcuts import get_object_or_404
from django.db.models import F, Sum, Count
from collections import defaultdict


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    user_id = request.data['user']

    if str(request.user.id) != str(user_id):
        return Response({'error': 'Unauthorized'}, status=403)

    cart_items = Cart.objects.filter(user_id=user_id)

    if not cart_items.exists():
        return Response({'error': 'Cart is empty'}, status=400)

    total = request.data.get('total')

    order = Order.objects.create(
        user_id=user_id,
        address=request.data['address'],
        payment_method=request.data['payment_method'],
        total=total,
    )

    for item in cart_items:

        OrderItem.objects.create(
            order=order,
            product=item.product,
            quantity=item.quantity,
            price=item.product.price
        )

    cart_items.delete()

    return Response({
        'message': 'Order created',
        'order_id': order.id
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_list(request):
    user_id = request.GET.get('user')

    if request.user.role == 'admin':
        orders_query = Order.objects.all()
        if user_id:
            orders_query = orders_query.filter(user_id=user_id)
    elif user_id and str(request.user.id) == str(user_id):
        orders_query = Order.objects.filter(user_id=user_id)
    else:
        return Response({'error': 'Unauthorized'}, status=403)

    orders_query = orders_query.select_related('user', 'delivery_agent').prefetch_related(
        'items__product',
    )

    orders = []

    for order in orders_query:
        items = []

        for item in order.items.all():

            items.append({

                'title':
                item.product.title,

                'image':
                item.product.image.url,

                'quantity':
                item.quantity,

                'price':
                item.price

            })

        orders.append({

            'id':
            order.id,

            'total':
            order.total,

            'payment_method':
            order.payment_method,

            'status':
            order.status,

            'customer':
            order.user.username,

            'customer_email':
            order.user.email,

            'created_at':
            order.created_at.isoformat() if hasattr(
                order, 'created_at') else str(order.created_at),
            'delivery_agent_id': order.delivery_agent_id,
            'delivery_agent_name': order.delivery_agent.username if order.delivery_agent else None,

            'items':
            items

        })

    return Response(
        orders
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def seller_orders(request):

    seller_id = request.GET.get('seller')

    if request.user.role != 'seller' or str(request.user.id) != str(seller_id):
        return Response({'error': 'Unauthorized'}, status=403)

    seller_products = Product.objects.filter(seller_id=seller_id)

    order_items = OrderItem.objects.filter(
        product__in=seller_products
    ).select_related('order', 'product', 'order__user')

    orders_dict = {}
    COMMISSION_PERCENTAGE = 5

    for item in order_items:
        order_key = item.order.id

        if order_key not in orders_dict:

            order_total = float(item.order.total)
            commission_amount = (order_total * COMMISSION_PERCENTAGE) / 100

            orders_dict[order_key] = {
                'order_id': item.order.id,
                'customer': item.order.user.username,
                'customer_phone': item.order.user.phone,
                'address': item.order.address,
                'status': item.order.status,
                'payment_method': item.order.payment_method,
                'created_at': item.order.created_at,
                'items': [],
                'order_total': item.order.total,
                'delivery_agent_id': item.order.delivery_agent_id,
                'delivery_agent_name': item.order.delivery_agent.username if item.order.delivery_agent else None,
                'commission_percentage': COMMISSION_PERCENTAGE,
                'commission_amount': round(commission_amount, 2),
            }

        orders_dict[order_key]['items'].append({
            'product_title': item.product.title,
            'product_image': item.product.image.url,
            'quantity': item.quantity,
            'price': item.price,
            'item_total': item.quantity * item.price
        })

    seller_orders = []
    for order_data in orders_dict.values():
        order_data['items_count'] = len(order_data['items'])
        order_data['seller_items_total'] = sum(
            item['item_total'] for item in order_data['items']
        )
        seller_orders.append(order_data)

    return Response(seller_orders)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def delivery_orders(request):
    delivery_agent_id = request.GET.get('delivery_agent')

    if not delivery_agent_id:
        return Response(
            {'error': 'Missing delivery_agent parameter'},
            status=400,
        )

    if request.user.role != 'delivery' or str(request.user.id) != str(delivery_agent_id):
        return Response({'error': 'Unauthorized'}, status=403)

    order_items = OrderItem.objects.filter(
        order__delivery_agent_id=delivery_agent_id
    ).select_related('order', 'product', 'order__user')

    orders_dict = {}
    COMMISSION_PERCENTAGE = 5

    for item in order_items:
        order_key = item.order.id

        if order_key not in orders_dict:
            order_total = float(item.order.total)
            commission_amount = (order_total * COMMISSION_PERCENTAGE) / 100

            orders_dict[order_key] = {
                'order_id': item.order.id,
                'customer': item.order.user.username,
                'customer_phone': item.order.user.phone,
                'address': item.order.address,
                'status': item.order.status,
                'payment_method': item.order.payment_method,
                'created_at': item.order.created_at,
                'items': [],
                'order_total': item.order.total,
                'delivery_agent_id': item.order.delivery_agent_id,
                'delivery_agent_name': item.order.delivery_agent.username if item.order.delivery_agent else None,
                'commission_percentage': COMMISSION_PERCENTAGE,
                'commission_amount': round(commission_amount, 2),
            }

        orders_dict[order_key]['items'].append({
            'product_title': item.product.title,
            'product_image': item.product.image.url,
            'quantity': item.quantity,
            'price': item.price,
            'item_total': item.quantity * item.price
        })

    delivery_orders = []
    for order_data in orders_dict.values():
        order_data['items_count'] = len(order_data['items'])
        order_data['seller_items_total'] = sum(
            item['item_total'] for item in order_data['items']
        )
        delivery_orders.append(order_data)

    return Response(delivery_orders)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def assign_delivery_agent(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response(
            {'error': 'Order not found'},
            status=404,
        )

    if request.user.role not in ['seller', 'admin']:
        return Response({'error': 'Unauthorized'}, status=403)

    if request.user.role == 'seller':
        seller_order_items = OrderItem.objects.filter(
            order=order,
            product__seller_id=request.user.id,
        )
        if not seller_order_items.exists():
            return Response({'error': 'Unauthorized'}, status=403)

    delivery_agent_id = request.data.get('delivery_agent_id')
    new_status = request.data.get('status')

    if delivery_agent_id is not None:
        order.delivery_agent_id = delivery_agent_id

    if new_status:
        order.status = new_status

    order.save()

    return Response({
        'message': 'Delivery agent assigned',
        'delivery_agent_id': order.delivery_agent_id,
        'status': order.status
    })


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_order_status(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response(
            {'error': 'Order not found'},
            status=404,
        )

    if request.user.role == 'customer' and order.user_id != request.user.id:
        return Response({'error': 'Unauthorized'}, status=403)

    if request.user.role == 'delivery' and order.delivery_agent_id != request.user.id:
        return Response({'error': 'Unauthorized'}, status=403)

    if request.user.role == 'seller':
        seller_order_items = OrderItem.objects.filter(
            order=order,
            product__seller_id=request.user.id,
        )
        if not seller_order_items.exists():
            return Response({'error': 'Unauthorized'}, status=403)

    if request.user.role not in ['customer', 'seller', 'delivery', 'admin']:
        return Response({'error': 'Unauthorized'}, status=403)

    new_status = request.data.get('status')

    valid_statuses = [
        'pending',
        'accepted',
        'shipped',
        'delivered',
        'cancelled'
    ]

    if new_status not in valid_statuses:

        return Response(
            {'error': 'Invalid status'},
            status=400
        )

    order.status = new_status

    order.save()

    return Response({
        'message': 'Status updated',
        'status': order.status
    })
