from rest_framework import serializers
from .models import CustomUser, Address


class SignupSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser

        fields = [
            'username',
            'email',
            'password',
            'role',
            'phone',
            'approval_status',
        ]

        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }

    def create(self, validated_data):
        role = validated_data.get('role', 'customer')
        approval_status = validated_data.pop('approval_status', None)

        if role == 'admin' and not self.context.get('admin_create'):
            raise serializers.ValidationError({
                'role': 'Admin accounts can only be created by an administrator.'
            })

        if not self.context.get('admin_create'):
            approval_status = None

        if role in ['seller', 'delivery']:
            approval_status = 'pending'
        elif role == 'customer':
            approval_status = 'approved'
        elif role == 'admin':
            approval_status = approval_status or 'approved'

        is_active = approval_status == 'approved'

        return CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=role,
            phone=validated_data.get('phone', ''),
            approval_status=approval_status,
            is_active=is_active,
        )


class AddressSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Address

        fields = '__all__'
