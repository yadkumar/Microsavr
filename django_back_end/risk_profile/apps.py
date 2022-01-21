import sys
from django.apps import AppConfig


class RiskProfileConfig(AppConfig):
    name = 'risk_profile'

    def ready(self):
        if 'runserver' not in sys.argv:
            return True
        from assets.ETFs import etf
        from risk_profile.models import ETF
        from risk_profile.serializers import EtfSerializer
        etf_set = ETF.objects.all()
        if etf_set.count() == 0:
            serializer = EtfSerializer(data=etf, many=True)
            if serializer.is_valid():
                serializer.save()
