from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token

from .serializers import UserSerializer, RegisterSerializer, LoginSerializer
# Create your views here.

User = get_user_model()

# this is simply a test to fetch "all" data from the table. but there are no entries yet.
class UserView(APIView):
    permission_classes = [IsAuthenticated] # Only allow authenticated users to access this view

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"success" : "True"}, status=200)

class LoginView(APIView):
    permission_classes = [] # Allow any user (authenticated or not) to access this view

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user) # Log the user in by creating a session
            return Response({"success" : True, "csrfToken": get_token(request)}) # Include CSRF token in the response to authenticate users
        else:
            return Response({"error": "Invalid username or password!"}, status=status.HTTP_401_UNAUTHORIZED)

class RegisterView(APIView):
    permission_classes = []
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"success" : "True"}, status=201)

        return Response(serializer.errors, status=400)