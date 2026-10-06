from django.urls import path

from .views import UserView, RegisterView, LoginView

# from .views import classes
urlpatterns = [
    path('user/', UserView.as_view(), name='User'),
    path('login/', LoginView.as_view(), name='Login'),
    path('register/', RegisterView.as_view(), name='Register'),
]