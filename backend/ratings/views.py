from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth import get_user_model

from .models import Post, Rating
from .serializers import PostSerializer, RatingSerializer

User = get_user_model()
# Create your views here.

class PostView(APIView):
    def get(self, request):
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)

        return Response(serializer.data)

class RateListView(APIView):
    def get(self, request):
        ratings = Rating.objects.all()
        serializer = RatingSerializer(ratings, many=True)

        return Response(serializer.data, status=201)

class RateView(APIView):
    # Handle POST requests to create or update a rating
    def post(self, request):
        post_id = request.data.get("post_id")
        rate_value = request.data.get("rate_value")

        user = request.user

        rating = Rating.objects.filter(
            user=user,
            post_id=post_id
        ).first()

        if rating:
            rating.rating = rate_value
            rating.save()
        else:
            Rating.objects.create(
                user=user,
                post_id=post_id,
                rating=rate_value
            )