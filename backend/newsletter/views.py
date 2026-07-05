from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from .models import NewsletterSubscriber
from .serializers import NewsletterSubscriberSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def subscribe_newsletter(request):
    email = (request.data.get('email') or '').strip().lower()

    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        validate_email(email)
    except ValidationError:
        return Response({'error': 'Enter a valid email address'}, status=status.HTTP_400_BAD_REQUEST)

    subscriber, created = NewsletterSubscriber.objects.get_or_create(
        email=email)

    if not created:
        return Response({'message': 'You are already subscribed'}, status=status.HTTP_200_OK)

    serializer = NewsletterSubscriberSerializer(subscriber)
    return Response(serializer.data, status=status.HTTP_201_CREATED)
