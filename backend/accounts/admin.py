from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):

    fieldsets = UserAdmin.fieldsets + (
        (
            "Additional Fields",
            {
                "fields": (
                    "role",
                    "phone",
                    "approval_status",
                )
            },
        ),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        (
            None,
            {
                "fields": (
                    "role",
                    "phone",
                    "approval_status",
                )
            },
        ),
    )

    list_display = (
        "username",
        "email",
        "role",
        "approval_status",
        "is_staff",
        "is_active",
    )
