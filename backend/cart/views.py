from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Cart
from .serializers import CartSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def cart_list(request):
    user_id = request.GET.get('user')

    if not user_id or str(request.user.id) != str(user_id):
        return Response({'error': 'Unauthorized'}, status=403)

    cart = Cart.objects.filter(user_id=user_id)
    serializer = CartSerializer(cart, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_cart(request):
    user_id = request.data.get('user')
    product_id = request.data.get('product')

    if not user_id or str(request.user.id) != str(user_id):
        return Response({'error': 'Unauthorized'}, status=403)

    item, created = Cart.objects.get_or_create(
        user_id=user_id,
        product_id=product_id,
        defaults={'quantity': 1},
    )

    if not created:
        item.quantity += 1
        item.save()

    return Response({
        'message': 'Added to cart',
        'quantity': item.quantity,
    })


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_cart(request, id):
    try:
        item = Cart.objects.get(id=id)
    except Cart.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)

    if item.user_id != request.user.id:
        return Response({'error': 'Unauthorized'}, status=403)

    item.delete()
    return Response({'message': 'deleted'})
