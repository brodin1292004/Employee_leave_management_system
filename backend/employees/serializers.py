
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Employee

User = get_user_model()


class EmployeeSerializer(serializers.ModelSerializer):

    username = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(
        write_only=True,
        required=False
    )

    class Meta:
        model = Employee
        fields = [
            'id',
            'employee_id',
            'username',
            'email',
            'password',
            'department',
            'phone',
            'designation',
            'gender',
            'date_of_joining',
            'address',
        ]

    def create(self, validated_data):
        username = validated_data.pop('username')
        email = validated_data.pop('email')
        password = validated_data.pop('password', None)

        if not password:
            raise serializers.ValidationError({
                'password': 'Password is required.'
            })

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            role=User.Role.EMPLOYEE
        )

        return Employee.objects.create(
            user=user,
            **validated_data
        )

    def update(self, instance, validated_data):
        username = validated_data.pop('username', None)
        email = validated_data.pop('email', None)
        password = validated_data.pop('password', None)

        if username is not None:
            instance.user.username = username

        if email is not None:
            instance.user.email = email

        if password:
            instance.user.set_password(password)

        instance.user.save()

        return super().update(instance, validated_data)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['username'] = instance.user.username
        data['email'] = instance.user.email
        return data
