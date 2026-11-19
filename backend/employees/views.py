
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Employee
from .serializers import EmployeeSerializer
from .permissions import IsHR


class EmployeeListCreateAPIView(generics.ListCreateAPIView):

    queryset = Employee.objects.select_related(
        'user', 'department'
    ).all()

    serializer_class = EmployeeSerializer

    permission_classes = [IsAuthenticated, IsHR]


class EmployeeDetailAPIView(generics.RetrieveUpdateDestroyAPIView):

    queryset = Employee.objects.select_related(
        'user', 'department'
    ).all()

    serializer_class = EmployeeSerializer

    permission_classes = [IsAuthenticated, IsHR]
