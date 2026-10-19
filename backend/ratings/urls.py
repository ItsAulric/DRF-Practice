from django.urls import path

# from .views import classes
from .views import PostView, RateListView, RateView

urlpatterns = [
    path('post/', PostView.as_view(), name="Post"),
    path('rating/', RateListView.as_view(), name="Rating"),
    path('rate/', RateView.as_view(), name="Rate")
]