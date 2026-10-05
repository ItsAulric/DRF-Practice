from django.urls import path

from .views import UserView, RegisterView

# from .views import classes
urlpatterns = [
    path('user/', UserView.as_view(), name='User'),
    
    path('register/', RegisterView.as_view(), name='Register'),
]