from django.urls import path

from .views import UserView

# from .views import classes
urlpatterns = [
    path('user/', UserView.as_view(), name='User'),
]