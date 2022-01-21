from django.core.exceptions import PermissionDenied
from user.models import User
from .models import *
from rest_framework.response import Response
from rest_framework import status
import hashlib


# to check if user has token in the header
def email_already_registered(function):
    """
    To check if Email ID is being repeated
    :param function: Checks the Email in the existing users
    :return: Error if similar Email found
    """
    def wrap(request, *args, **kwargs):
        user_queryset = User.objects.filter(email=args[0].data['email'])
        if user_queryset.count() == 0:
            return function(request, *args, **kwargs)
        else:
            return Response({'Error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

    wrap.__doc__ = function.__doc__
    wrap.__name__ = function.__name__
    return wrap


def ssn_already_registered(function):
    """
    To check if SSN number is being repeated
    :param function: Checks the SSN in the existing users
    :return: Error if similar SSN found
    """
    def wrap(request, *args, **kwargs):
        hash_salt = '$asdi12**019'
        if args[0].data.get('ssn') is not None:
            ssn_hash = hashlib.sha256((args[0].data['ssn'] + hash_salt).encode()).hexdigest()
            user_queryset = User.objects.filter(ssn=ssn_hash)
            if user_queryset.count() == 0:
                return function(request, *args, **kwargs)
            else:
                return Response({'Error': 'SSN already exists'}, status=status.HTTP_400_BAD_REQUEST)
        return function(request, *args, **kwargs)

    wrap.__doc__ = function.__doc__
    wrap.__name__ = function.__name__
    return wrap
