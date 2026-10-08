from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

from .models import Post

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = "__all__"