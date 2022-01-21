import json
import os
import sys

from django.apps import AppConfig


class UserConfig(AppConfig):
    name = 'user'

    def ready(self):
        if 'runserver' not in sys.argv:
            return True
        from user.models import Card
        from user.serializers import CardSerializer
        from .models import User
        # Create super user on runserver
        try:
            super_user = User.objects.get(is_admin=True)
            super_user.email = "admin@gmail.com"
            super_user.set_password("admin")
            super_user.save()
        except:
            super_user = User.objects.create_superuser(email="admin@gmail.com",
                                                       password="admin")
        if Card.objects.all().count() == 0:
            mock_file_location = 'assets/mockcards.json'
            if os.path.exists(mock_file_location):
                mock_file = open(mock_file_location)
                arr_of_cards = json.load(mock_file)['cards']
            else:
                raise FileNotFoundError("mockcards.json file does not exist in the assets folder")
            serializer = CardSerializer(data=arr_of_cards, many=True)
            if serializer.is_valid():
                serializer.save()
