from django.urls import path
from .views import *

urlpatterns = [
    path('profile/', RiskProfileView.as_view(), name='RiskProfile'),
    path('initialize/etf/', EtfGeneration.as_view(), name='ETFGeneration'),
    path('etf/performance/', EtfPerformance.as_view(), name='ETFPerformance'),
    path('etf/transactions/', EtfTransactions.as_view(), name='ETFTransactions'),
]