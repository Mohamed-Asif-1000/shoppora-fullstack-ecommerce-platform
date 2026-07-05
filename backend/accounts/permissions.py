from rest_framework.permissions import BasePermission


class IsApprovedSeller(BasePermission):
    """Allow access only to approved sellers."""

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and user.role == 'seller'
            and user.approval_status == 'approved'
            and user.is_active
        )


class IsApprovedDelivery(BasePermission):
    """Allow access only to approved delivery users."""

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and user.role == 'delivery'
            and user.approval_status == 'approved'
            and user.is_active
        )
