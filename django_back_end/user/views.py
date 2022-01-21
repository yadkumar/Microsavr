import decimal
import hashlib
import json
from django.contrib.auth import authenticate
from google.oauth2 import id_token
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from google.auth.transport import requests
from .decorators import email_already_registered, ssn_already_registered
from .serializers import *
from .models import *
import os
import random
import razorpay
import datetime
from risk_profile.models import *


class UserGoogleLogin(APIView):
    """
    Sign in user using google services
    """
    hash_salt = '$asdi12**019'

    @staticmethod
    def get_user(google_sub_id_hash, email, ssn, google_sub_id):
        try:
            user = User.objects.get(google_id=google_sub_id_hash)
            token = Token.objects.get(user=user)
            result = {'email': user.email, 'token': token.key}
            return Response(result, status=status.HTTP_200_OK)
        except:
            if ssn is not None:
                serializer = UserSerializer(data={'email': email,
                                                  'ssn': ssn,
                                                  'google_id': google_sub_id})
                if serializer.is_valid():
                    user = serializer.save()
                    if user:
                        token = Token.objects.create(user=user)
                        result = serializer.data
                        result['token'] = token.key
                        return Response(result, status=status.HTTP_200_OK)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            return Response({'Error': 'SSN is required'}, status=status.HTTP_404_NOT_FOUND)

    @ssn_already_registered
    def post(self, request):
        token = request.data['id_token']
        id_info = id_token.verify_oauth2_token(
            token, requests.Request(), audience=None)
        google_sub_id = id_info['sub'] + self.hash_salt
        google_sub_id_hash = hashlib.sha256(google_sub_id.encode()).hexdigest()
        result = self.get_user(google_sub_id_hash, id_info['email'],
                               request.data.get('ssn', None), id_info['sub'])
        return result


class UserRegister(APIView):
    """
    View to handle registering of a user using email and password
    """

    @email_already_registered
    @ssn_already_registered
    def post(self, request):
        request.data['google_id'] = None
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                token = Token.objects.create(user=user)
                result = serializer.data
                result['token'] = token.key
                return Response(result, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLogin(APIView):
    """
        Login user using email and password
    """

    def post(self, request):
        user = authenticate(request, email=request.data['email'],
                            password=request.data['password'])
        if user:
            token = Token.objects.get(user=user)
            result = {'email': request.data['email'], 'token': token.key}
            return Response(result, status=status.HTTP_201_CREATED)
        result = {'Error': 'Invalid email address or password'}
        return Response(result, status=status.HTTP_400_BAD_REQUEST)


class InitializeCards(APIView):
    """
    To add the cards to the database from mock.json
    """

    def get(self, request):
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
            #     return Response(serializer.data, status=status.HTTP_200_OK)
            # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        # card_set = Card.objects.all()
        # serializer = CardSerializer(card_set, many=True)
        # return Response(serializer.data, status=status.HTTP_200_OK)


class UserCreditCards(APIView):
    permission_classes = [IsAuthenticated]

    @staticmethod
    def getRandomCards():
        """
        generates a random number in the range of 1 and 3
        this is for the number of cards we need to initialize a user with
        """
        num_of_cards = random.randint(1, 3)
        # pick random cards from the list
        random_cards = random.sample(range(1, 24), num_of_cards)
        result = []
        for card in random_cards:
            result.append(Card.objects.get(pk=card))
        return result

    @staticmethod
    def getRandomCardData(data):
        """
        get total_amt_due and min_amt_due, bank_name, valid_through and card_type
        for a new card being entered by a user
        """
        banks = ['Bank of America', 'JPMorgan Chase',
                 'Citigroup', 'Wells Fargo', 'HSBC Bank USA']
        data['card_type'] = 'Visa'
        data['valid_through'] = '12/24'
        data['bank_name'] = random.choice(banks)
        total_amt_due = float(random.randint(2000, 20000))
        min_amt_due = float((total_amt_due * 5) / 100)
        data['total_amt_due'] = total_amt_due
        data['min_amt_due'] = min_amt_due
        return data

    def get(self, request):
        """
        To get all the cards linked to a user
        """
        user = request.user
        try:
            user_card_obj = UserCard.objects.get(user=user)
        except:
            user_card_obj = UserCard.objects.create(user=user)
            card_set = self.getRandomCards()
            for card in card_set:
                user_card_obj.card.add(card)
            user_card_obj.save()
        serializer = UserCardSerializer(user_card_obj)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        user = request.user
        try:
            user_card_obj = UserCard.objects.get(user=user)
        except:
            return Response({'Error': 'User Cards do not exist'}, status=status.HTTP_400_BAD_REQUEST)
        data = self.getRandomCardData(request.data)
        serializer = CardSerializer(data=data)
        if serializer.is_valid():
            card_obj = serializer.save()
            user_card_obj.card.add(card_obj)
            user_card_serializer = UserCardSerializer(user_card_obj)
            return Response(user_card_serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        try:
            card_obj = Card.objects.get(card_no=request.data['card_no'])
            user_card_set = card_obj.user_cards.get(user=request.user)
            user_card_set.card.remove(card_obj)
            serializer = UserCardSerializer(user_card_set)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response({'Error': 'The card does not exist'}, status=status.HTTP_200_OK)


class PaymentView(APIView):
    permission_classes = [IsAuthenticated]

    extra_reward_constant = 300

    @staticmethod
    def createTransaction(request, card_obj, reward_points):
        transaction_obj = Transaction.objects.create(user=request.user,
                                                     card=card_obj,
                                                     amt=decimal.Decimal(request.data['amt']),
                                                     points=reward_points)
        transaction_obj.save()

    def getRewardPoints(self, request, card_obj):
        reward_points = int(
            int(card_obj.total_amt_due) - decimal.Decimal(request.data['amt']) + self.extra_reward_constant)
        try:
            reward_obj = RewardPoints.objects.get(user=request.user)
            reward_obj.points_earned += reward_points
            reward_obj.save()
        except:
            reward_obj = RewardPoints.objects.create(user=request.user, points_earned=reward_points)
            reward_obj.save()
        return reward_points

    @staticmethod
    def invest_in_etf(request, reward_points):
        # try:
        user_etf = UserEtf.objects.get(user=request.user)
        reward_obj = RewardPoints.objects.get(user=request.user)
        print(reward_obj.points_earned - user_etf.rewards_invested)
        if reward_obj.points_earned - user_etf.rewards_invested >= user_etf.etf.min_points:
            # Calculating ETF Investment amt
            investment_quotient = (reward_obj.points_earned - user_etf.rewards_invested) // user_etf.etf.min_points
            investment = investment_quotient * user_etf.etf.min_points
            # ETF Investment transaction
            user_etf_transaction = UserEtfTransaction.objects.create(user_etf=user_etf,
                                                                     rewards_invested=investment,
                                                                     money_invested=investment // 100)
            print(user_etf_transaction)
            # UserEtf Object update
            user_etf.rewards_invested += investment
            user_etf.money_invested += investment // 100
            user_etf.save()
        print(user_etf.money_invested)
        # except:
        #     return Response({'Error': 'Fill the risk profile'}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        # try:
        card_obj = Card.objects.get(card_no=request.data['card_no'])
        user_card_obj = card_obj.user_cards.filter(user=request.user)
        reward_points = self.getRewardPoints(request, card_obj)
        self.invest_in_etf(request, reward_points)
        self.createTransaction(request, card_obj, reward_points)
        card_obj.total_amt_due -= decimal.Decimal(request.data['amt'])
        card_obj.min_amt_due = decimal.Decimal((card_obj.total_amt_due * 5) // 100)
        card_obj.save()
        return Response({'reward_points': reward_points}, status=status.HTTP_200_OK)
        # except:
        #     return Response({'Error': 'Invalid card for this user'},
        #                     status=status.HTTP_400_BAD_REQUEST)


class TransactionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        transaction_set = Transaction.objects.filter(user=request.user)
        serializer = TransactionSerializer(transaction_set, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RewardsPointsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            reward_set = RewardPoints.objects.get(user=request.user)
            user_etf_set = UserEtf.objects.get(user=request.user)
            reward_milestone = user_etf_set.etf.min_points - (reward_set.points_earned - user_etf_set.rewards_invested)
            serializer = RewardSerializer(reward_set)
            new_dict = {'reward_milestone': reward_milestone}
            new_dict.update(serializer.data)
            return Response(new_dict, status=status.HTTP_200_OK)
        except:
            return Response({'points_earned': 0}, status=status.HTTP_200_OK)
