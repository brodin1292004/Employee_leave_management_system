from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):

    class Role(models.TextChoices):
        HR = 'HR', 'Human Resources'
        EMPLOYEE = 'EMPLOYEE', 'Employee'

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.EMPLOYEE
    )

    def __str__(self):
        return f"{self.username} - {self.role}"

class Department(models.Model):
    department_id = models.IntegerField(primary_key=True)
    department_name =  models.CharField(max_length=100)
    