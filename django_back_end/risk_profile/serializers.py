from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import *
from user.serializers import *


class RiskProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for Risk Profile
    """
    user = UserSerializer(read_only=True, required=False)
    risk_analysis = serializers.CharField(max_length=16, required=True)
    questions = serializers.CharField(max_length=255, required=True)
    answers = serializers.CharField(max_length=255, required=True)

    def update(self, instance, validated_data):
        instance.risk_analysis = validated_data.get('risk_analysis', instance.risk_analysis)
        instance.questions = validated_data.get('questions', instance.questions)
        instance.answers = validated_data.get('answers', instance.answers)
        instance.save()
        return instance

    class Meta:
        model = RiskProfile
        fields = '__all__'


class EtfSerializer(serializers.ModelSerializer):
    """
    ETF serializer
    """

    class Meta:
        model = ETF
        fields = '__all__'


class UserEtfSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    etf = EtfSerializer(read_only=True)

    class Meta:
        model = UserEtf
        fields = '__all__'


class UserEtfTransactionSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserEtfTransaction
        fields = '__all__'
