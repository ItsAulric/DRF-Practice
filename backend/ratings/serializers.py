from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

from .models import Post, Rating

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = "__all__"

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ["id", "title", "average_rating"]