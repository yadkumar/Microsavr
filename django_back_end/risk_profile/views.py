from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from .models import *
from assets.risk_profile_points import risk_profile
from assets.ETFs import etf


class RiskProfileView(APIView):
    """
    Get - To view the questions answered and analysis given by a person in his risk profile
    Post - To update the questions answered and ge the analysis generated by a person
    """
    permission_classes = [IsAuthenticated]

    @staticmethod
    def get_net_risk_points(data):
        # To get risk points slab
        try:
            question = 1
            net_risk_points = 0
            while question <= 13:
                net_risk_points += risk_profile[str(question)][data[str(question)]]
                question = question + 1

            if net_risk_points < 40:
                return 'low risk'
            elif net_risk_points < 70:
                return 'moderate risk'
            elif net_risk_points < 100:
                return 'high risk'
        except:
            return None

    @staticmethod
    def get_questions(data):
        # To get questions in the form of a string
        questions_string = ''
        for question in data:
            questions_string = questions_string + question + ','
        questions_string = questions_string[:-1]
        return questions_string

    @staticmethod
    def get_answers(data):
        # To get answers in the form of a string
        answers_string = ''
        for answer in data:
            answers_string = answers_string + data[answer] + ','
        answers_string = answers_string[:-1]
        return answers_string

    @staticmethod
    def create_user_etf(request, risk_analysis):
        etf_obj = ETF.objects.filter(risk_analysis=risk_analysis).first()
        try:
            user_etf = UserEtf.objects.get(user=request.user)
            user_etf.etf = etf_obj
            user_etf.save()
        except:
            UserEtf.objects.create(user=request.user, etf=etf_obj)

    def get(self, request):
        user = request.user
        try:
            risk_profile_obj = RiskProfile.objects.get(user=user)
            serializer = RiskProfileSerializer(risk_profile_obj)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response({}, status=status.HTTP_200_OK)

    def post(self, request):
        user = request.user
        net_risk_value = self.get_net_risk_points(request.data)
        self.create_user_etf(request, net_risk_value)
        if net_risk_value is not None:
            result = {
                'risk_analysis': net_risk_value,
                'questions': self.get_questions(request.data),
                'answers': self.get_answers(request.data)
            }
            try:
                risk_profile_obj = RiskProfile.objects.get(user=user)
                serializer = RiskProfileSerializer(risk_profile_obj, data=result)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            except:
                serializer = RiskProfileSerializer(data=result)
                if serializer.is_valid():
                    serializer.validated_data['risk_analysis'] = net_risk_value
                    serializer.validated_data['user'] = user
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'Error': 'Invalid data format => str(question) - str(answer)'},
                        status=status.HTTP_400_BAD_REQUEST)


class EtfGeneration(APIView):
    """
    To save hardcoded ETF's to database
    """
    def get(self, request):
        etf_set = ETF.objects.all()
        if etf_set.count() == 0:
            serializer = EtfSerializer(data=etf, many=True)
            if serializer.is_valid():
                serializer.save()
            #     return Response(serializer.data, status=status.HTTP_200_OK)
            # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        # serializer = EtfSerializer(etf_set, many=True)
        # return Response(serializer.data, status=status.HTTP_200_OK)


class EtfPerformance(APIView):
    """
    To get the user's ETF details
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_etf = UserEtf.objects.get(user=user)
        serializer = UserEtfSerializer(user_etf)
        return Response(serializer.data, status=status.HTTP_200_OK)


class EtfTransactions(APIView):
    """
    To get the user's ETF transaction details
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_etf = UserEtf.objects.get(user=user)
        user_etf_transactions = UserEtfTransaction.objects.filter(user_etf=user_etf)
        serializer = UserEtfTransactionSerializer(user_etf_transactions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)