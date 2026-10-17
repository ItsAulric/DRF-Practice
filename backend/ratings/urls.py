from django.urls import path

# from .views import classes
from .views import PostView, RatingView

urlpatterns = [
    path('post/', PostView.as_view(), name="Post"),
    path('rating/', RatingView.as_view(), name="Rating"),
]