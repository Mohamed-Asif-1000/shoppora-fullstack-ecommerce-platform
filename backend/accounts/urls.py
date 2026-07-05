from django.urls import path
from .views import (
    signup,
    login,
    profile,
    update_profile,
    delivery_agents,
    delivery_agent_profile,
    users,
    add_user,
    update_user,
    delete_user,
    addresses,
    add_address,
    delete_address,
)
from rest_framework_simplejwt.views import (TokenRefreshView)

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('login/', login, name='login'),
    path('profile/', profile, name='profile'),
    path('profile/update/', update_profile, name='update_profile'),
    path('delivery-agents/', delivery_agents, name='delivery_agents'),
    path('delivery-agent-profile/', delivery_agent_profile,
         name='delivery_agent_profile'),
    path('users/', users, name='users'),
    path('users/add/', add_user, name='add_user'),
    path('users/<int:id>/', update_user, name='update_user'),
    path('users/delete/<int:id>/', delete_user, name='delete_user'),
    path('addresses/', addresses, name='addresses'),
    path('addresses/add/', add_address, name='add_address'),
    path('addresses/delete/<int:id>/', delete_address, name='delete_address'),
    path('token/refresh/', TokenRefreshView.as_view()),
]
