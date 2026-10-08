from rest_framework import serializers
from django.db.models import Avg
from django.contrib.auth import get_user_model

User = get_user_model()

from .models import Post, Rating

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = "__all__"

class PostSerializer(serializers.ModelSerializer):
    # DRF adds an "average_rating" field to the API response using the method below.
    average_rating = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = ["id", "title", "average_rating"]

    # DRF automatically calls this method for each post; "obj" is the current Post object.
    def get_average_rating(self, obj):
        average = obj.ratings.aggregate(average=Avg("rating"))["average"]
        return round(average, 1) if average is not None else None