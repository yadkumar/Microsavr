from django.db import models
from user.models import *


class RiskProfile(models.Model):
    """
    Model to capture user's risk profile
    """
    risk_profile_choices = (
        ('low risk', 'Low Risk'),
        ('moderate risk', 'Moderate Risk'),
        ('high risk', 'High Risk'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    risk_analysis = models.CharField(choices=risk_profile_choices, max_length=16)
    questions = models.CharField(max_length=225)
    answers = models.CharField(max_length=255)


class ETF(models.Model):
    """
    Storing the given ETFs
    """
    risk_profile_choices = (
        ('low risk', 'Low Risk'),
        ('moderate risk', 'Moderate Risk'),
        ('high risk', 'High Risk'),
    )
    name = models.CharField(max_length=255, unique=True)
    risk_analysis = models.CharField(choices=risk_profile_choices, max_length=16)
    abbreviation = models.CharField(max_length=3, unique=True)
    min_points = models.IntegerField(default=2000)


class UserEtf(models.Model):
    """
    Connection between user and ETF
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    etf = models.ForeignKey(ETF, on_delete=models.CASCADE)
    rewards_invested = models.IntegerField(default=0)
    money_invested = models.DecimalField(default=0, decimal_places=2, max_digits=10)


class UserEtfTransaction(models.Model):
    user_etf = models.ForeignKey(UserEtf, on_delete=models.CASCADE)
    rewards_invested = models.IntegerField(default=0)
    money_invested = models.DecimalField(default=0, decimal_places=2, max_digits=10)
    created_at = models.DateTimeField(auto_now_add=True)

