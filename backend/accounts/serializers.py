from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Profile

User = get_user_model()

# test serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']



import re  # 're' is for regular expression
def validate_password_rules(password):
    if len(password) < 8:
        raise serializers.ValidationError("This password is too short.")

    if not re.search(r"[A-Z]", password):
        raise serializers.ValidationError("Password must include an uppercase letter.")

    if not re.search(r"[0-9]", password):
        raise serializers.ValidationError("Password must include a number.")

    if not re.search(r"[!@#$%^&*]", password):
        raise serializers.ValidationError("Password must include a special character.")

    return password

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    # 1. EMAIL RULES
    def validate_email(self, value):
        pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"
        if not re.match(pattern, value):
            raise serializers.ValidationError("Invalid email format.")
        
        # uniquness check
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already taken.")
        
        return value

    # 2. USERNAME RULES
    def validate_username(self, value):
        if len(value) < 3:
            raise serializers.ValidationError("This username is too short.")

        # all numbers check
        if not value.isalnum():
            raise serializers.ValidationError("Username must be alphanumeric.")

        # blacklist words for username moderation
        blacklist = ["admin", "root", "mod"]
        if any(word in value.lower() for word in blacklist): 
            raise serializers.ValidationError("This username is not allowed.")

        # uniqueness check
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")

        return value

    # 3. PASSWORD RULES
    def validate_password(self, value):
        return validate_password_rules(value)

    # 4. CREATE USER
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']  # hashed automatically
        )

        # 5. AUDIT LOGGING (example)
        print(f"[AUDIT] New user created: {user.username}")

        return user
