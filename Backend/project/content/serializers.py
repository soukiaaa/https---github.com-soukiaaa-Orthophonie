from rest_framework import serializers
from .models import User, Theme, Subcategory
from django.contrib.auth import authenticate

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'first_name',
            'last_name',
            'email',
            'password',
            'gender',
            'age',
            'specialist_name'
        ]

    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data['username'] = validated_data.get('email')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(username=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        return user


class SubcategorySerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='slug', read_only=True)
    hidden = serializers.SerializerMethodField()

    class Meta:
        model = Subcategory
        fields = ['id', 'name', 'image', 'video', 'voice', 'hidden']

    def get_hidden(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return obj.hidden_by.filter(pk=request.user.pk).exists()