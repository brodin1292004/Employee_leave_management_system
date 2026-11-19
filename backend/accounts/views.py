
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .serializers import RegisterSerializer
from .models import User, Department


class RegisterAPIView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard(request):

    total_employees = User.objects.filter(
        role=User.Role.EMPLOYEE
    ).count()

    total_hr = User.objects.filter(
        role=User.Role.HR
    ).count()

    total_departments = Department.objects.count()

    return Response({
        "total_employees": total_employees,
        "total_hr": total_hr,
        "total_departments": total_departments,
        "message": "Dashboard data loaded successfully"
    })
