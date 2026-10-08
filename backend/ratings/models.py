from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Post(models.Model):
    title = models.CharField(max_length=255)

    def __str__(self):
        return self.title

class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="ratings"
    )
    rating = models.IntegerField()
    comment = models.CharField(max_length=500, blank=True)

    def __str__(self):
        return f"{self.user} - {self.post}: {self.rating} stars"