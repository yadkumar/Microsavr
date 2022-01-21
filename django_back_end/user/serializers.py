from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import *
import hashlib


class UserSerializer(serializers.ModelSerializer):
    """
        Serializer class to add a user object
    """
    hash_salt = '$asdi12**019'
    email = models.EmailField(validators=[UniqueValidator(queryset=User.objects.all())])
    password = serializers.CharField(write_only=True, required=False, allow_null=True)
    ssn = serializers.CharField(write_only=True, validators=[UniqueValidator(queryset=User.objects.all())])
    google_id = serializers.CharField(write_only=True, required=False, allow_null=True)

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data.get('password', None),
            ssn=validated_data.get('ssn', None),
            google_id=validated_data.get('google_id', None),
        )
        return user

    class Meta:
        model = User
        fields = ['email', 'password', 'ssn', 'google_id']


class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = '__all__'


class UserCardSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    card = CardSerializer(read_only=True, many=True)

    class Meta:
        model = UserCard
        fields = '__all__'


class TransactionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    card = CardSerializer(read_only=True)

    class Meta:
        model = Transaction
        fields = '__all__'


class RewardSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = RewardPoints
        fields = '__all__'
