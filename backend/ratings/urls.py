from django.urls import path

# from .views import classes
from .views import PostView

urlpatterns = [
    path('post/', PostView.as_view(), name="Post"),
]