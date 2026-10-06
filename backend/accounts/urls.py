from django.urls import path

from .views import UserView, RegisterView, LoginView, LogoutView

# from .views import classes
urlpatterns = [
    path('user/', UserView.as_view(), name='User'),
    path('login/', LoginView.as_view(), name='Login'),
    path('logout/', LogoutView.as_view(), name='Logout'),
    path('register/', RegisterView.as_view(), name='Register'),
]