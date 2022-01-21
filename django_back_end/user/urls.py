from django.urls import path, include
from .views import *

urlpatterns = [
    path('google/login/', UserGoogleLogin.as_view(), name='UserGoogleLogin'),
    path('register/', UserRegister.as_view(), name='UserRegister'),
    path('login/', UserLogin.as_view(), name='UserLogin'),
    path('initialize/cards/', InitializeCards.as_view(), name='InitializeCards'),
    path('credit/cards/', UserCreditCards.as_view(), name='UserCreditCards'),
    path('credit/cards/payment/', PaymentView.as_view(), name='CreditCardsPayment'),
    path('rewards/', RewardsPointsView.as_view(), name='RewardsPointsView'),
    path('transactions/', TransactionView.as_view(), name='TransactionView'),
]