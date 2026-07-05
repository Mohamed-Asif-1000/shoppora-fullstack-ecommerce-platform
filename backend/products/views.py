from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Product
from .serializers import ProductSerializer
from accounts.permissions import IsApprovedSeller


# ---------------- GET SELLER PRODUCTS ----------------
@api_view(['GET'])
def seller_products(request):
    seller_id = request.GET.get('seller')

    if seller_id:
        products = Product.objects.filter(seller_id=seller_id)
    else:
        products = Product.objects.all()

    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


# ---------------- ADD PRODUCT ----------------
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsApprovedSeller])
def add_product(request):
    seller_id = request.data.get('seller')

    if not seller_id:
        return Response(
            {'error': 'Seller is required'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if str(request.user.id) != str(seller_id):
        return Response(
            {'error': 'You can only add products for your own seller account.'},
            status=status.HTTP_403_FORBIDDEN,
        )

    serializer = ProductSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ---------------- UPDATE PRODUCT ----------------
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_product(request, id):
    try:
        product = Product.objects.get(id=id)
    except Product.DoesNotExist:
        return Response(
            {'error': 'Product not found'},
            status=404,
        )

    if request.user.role == 'seller':
        if not request.user.is_authenticated or request.user.approval_status != 'approved' or not request.user.is_active:
            return Response(
                {'error': 'Seller account not approved or inactive.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        if product.seller_id != request.user.id:
            return Response(
                {'error': 'You can only update your own products.'},
                status=status.HTTP_403_FORBIDDEN,
            )
    elif request.user.role != 'admin':
        return Response(
            {'error': 'Only approved sellers or admins can update products.'},
            status=status.HTTP_403_FORBIDDEN,
        )

    serializer = ProductSerializer(product, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ---------------- DELETE PRODUCT ----------------
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_product(request, id):
    try:
        product = Product.objects.get(id=id)
    except Product.DoesNotExist:
        return Response(
            {'error': 'Product not found'},
            status=404,
        )

    if request.user.role == 'seller':
        if not request.user.is_authenticated or request.user.approval_status != 'approved' or not request.user.is_active:
            return Response(
                {'error': 'Seller account not approved or inactive.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        if product.seller_id != request.user.id:
            return Response(
                {'error': 'You can only delete your own products.'},
                status=status.HTTP_403_FORBIDDEN,
            )
    elif request.user.role != 'admin':
        return Response(
            {'error': 'Only approved sellers or admins can delete products.'},
            status=status.HTTP_403_FORBIDDEN,
        )

    product.delete()
    return Response({'message': 'Product deleted'})
