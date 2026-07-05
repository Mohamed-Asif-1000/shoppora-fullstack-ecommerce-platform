from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from .models import CustomUser, Address
from .serializers import SignupSerializer, AddressSerializer
from rest_framework_simplejwt.tokens import RefreshToken


@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    role = request.data.get('role', 'customer')

    if role == 'admin':
        return Response(
            {'error': 'Admin accounts cannot be created from this signup form.'},
            status=status.HTTP_403_FORBIDDEN,
        )

    serializer = SignupSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()

        return Response(
            {
                'message': 'Account created'
            },
            status=status.HTTP_201_CREATED,
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email', '').strip().lower()
    password = request.data.get('password')

    try:
        user = CustomUser.objects.get(email=email)

    except CustomUser.DoesNotExist:
        return Response(
            {'error': 'User not found'},
            status=404
        )

    except CustomUser.MultipleObjectsReturned:
        return Response(
            {'error': 'Duplicate accounts found. Contact administrator.'},
            status=400
        )

    if user.approval_status != 'approved' or not user.is_active:
        return Response(
            {'error': 'Account pending approval or disabled. Contact support.'},
            status=status.HTTP_403_FORBIDDEN,
        )

    auth_user = authenticate(
        username=user.username,
        password=password
    )

    if auth_user:
        refresh = RefreshToken.for_user(auth_user)

        return Response({
            'message': 'Login success',
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': auth_user.id,
                'username': auth_user.username,
                'email': auth_user.email,
                'role': auth_user.role,
                'approval_status': auth_user.approval_status,
            }
        })

    return Response(
        {'error': 'Wrong password'},
        status=400
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    user_id = request.GET.get('user')
    user = request.user

    if user.role == 'admin' and user_id:
        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=404
            )
    elif user_id and str(user.id) != str(user_id):
        return Response(
            {'error': 'Unauthorized'},
            status=status.HTTP_403_FORBIDDEN,
        )

    return Response({
        'username': user.username,
        'email': user.email,
        'phone': user.phone,
        'role': user.role,
        'approval_status': user.approval_status,
    })


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user

    user.username = request.data.get('username', user.username)
    user.email = request.data.get('email', user.email)
    user.phone = request.data.get('phone', user.phone)
    user.save()

    return Response({
        'message': 'Profile updated'
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def delivery_agents(request):
    agents = CustomUser.objects.filter(
        role='delivery', approval_status='approved', is_active=True)
    data = [
        {
            'id': agent.id,
            'username': agent.username,
            'email': agent.email,
            'phone': agent.phone,
        }
        for agent in agents
    ]
    return Response(data)


@api_view(['GET'])
def delivery_agent_profile(request):
    agent_id = request.GET.get('delivery_agent')

    if not agent_id:
        return Response(
            {'error': 'Missing delivery_agent parameter'},
            status=400
        )

    try:
        agent = CustomUser.objects.get(id=agent_id, role='delivery')
        return Response({
            'id': agent.id,
            'username': agent.username,
            'email': agent.email,
            'phone': agent.phone,
            'first_name': agent.first_name,
            'last_name': agent.last_name,
        })
    except CustomUser.DoesNotExist:
        return Response(
            {'error': 'Delivery agent not found'},
            status=404
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def users(request):
    if not (
        request.user.role == 'admin'
        and request.user.is_active
        and request.user.approval_status == 'approved'
    ):
        return Response(
            {'error': 'Admin access required'},
            status=status.HTTP_403_FORBIDDEN,
        )

    role = request.GET.get('role')
    users_qs = CustomUser.objects.all()

    if role:
        users_qs = users_qs.filter(role=role)

    data = [
        {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'phone': user.phone,
            'joined': user.date_joined.strftime('%b %d, %Y'),
            'status': 'active' if user.approval_status == 'approved' and user.is_active else 'disabled',
            'approval_status': user.approval_status,
        }
        for user in users_qs
    ]

    return Response(data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def addresses(request):
    user_id = request.GET.get('user')

    if user_id and str(request.user.id) != str(user_id) and request.user.role != 'admin':
        return Response(
            {'error': 'Unauthorized'},
            status=status.HTTP_403_FORBIDDEN,
        )

    target_user_id = user_id if request.user.role == 'admin' and user_id else request.user.id

    data = Address.objects.filter(user_id=target_user_id)
    serializer = AddressSerializer(data, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_address(request):
    serializer = AddressSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_address(request, id):
    try:
        address = Address.objects.get(id=id)
        if address.user != request.user and request.user.role != 'admin':
            return Response(
                {'error': 'Unauthorized'},
                status=status.HTTP_403_FORBIDDEN,
            )
        address.delete()
        return Response({'message': 'Address removed'})

    except Address.DoesNotExist:
        return Response(
            {'error': 'Not found'},
            status=404
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_user(request):
    """Create a new user (admin-facing). Accepts username, email, password, role, phone, approval_status."""
    if not (
        request.user.role == 'admin'
        and request.user.is_active
        and request.user.approval_status == 'approved'
    ):
        return Response(
            {'error': 'Admin access required'},
            status=status.HTTP_403_FORBIDDEN,
        )

    serializer = SignupSerializer(
        data=request.data, context={'admin_create': True})

    if serializer.is_valid():
        user = serializer.save()

        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'phone': user.phone,
            'approval_status': user.approval_status,
        }, status=201)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user(request, id):
    """Update user fields (admin-facing)."""
    if not (
        request.user.role == 'admin'
        and request.user.is_active
        and request.user.approval_status == 'approved'
    ):
        return Response(
            {'error': 'Admin access required'},
            status=status.HTTP_403_FORBIDDEN,
        )

    try:
        user = CustomUser.objects.get(id=id)
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

    user.username = request.data.get('username', user.username)
    user.email = request.data.get('email', user.email)
    user.phone = request.data.get('phone', user.phone)
    user.role = request.data.get('role', user.role)
    approval_status = request.data.get('approval_status')
    if approval_status in ['pending', 'approved', 'disabled']:
        user.approval_status = approval_status
        user.is_active = approval_status == 'approved'

    password = request.data.get('password')
    if password:
        user.set_password(password)

    user.save()

    return Response({'message': 'User updated'})


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request, id):
    """Delete a user (admin-facing)."""
    if not (
        request.user.role == 'admin'
        and request.user.is_active
        and request.user.approval_status == 'approved'
    ):
        return Response(
            {'error': 'Admin access required'},
            status=status.HTTP_403_FORBIDDEN,
        )

    try:
        user = CustomUser.objects.get(id=id)
        user.delete()

        return Response({'message': 'User deleted'})

    except CustomUser.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)
