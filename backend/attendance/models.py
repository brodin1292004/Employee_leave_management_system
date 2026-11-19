from django.db import models


class Attendance(models.Model):
    class Status(models.TextChoices):
            PRESENT = 'PRESENT', 'Present'
            ABSENT = 'ABSENT', 'Absent'
            LATE = 'LATE', 'Late'
    attendance_id = models.IntegerField(primary_key=True)
    employee_id = models.IntegerField()
    attendance_date = models.DateField()
    check_in = models.TimeField()
    check_out = models.TimeField()
    status = models.CharField(max_length=20,choices=Status.choices)