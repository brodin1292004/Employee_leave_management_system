from django.db import models
class Leave(models.Model):
    class Status(models.TextChoices):
                PENDING = 'PENDING', 'Pending'
                APPROVED = 'APPROVED', 'Approved'
                REJECTED = 'REJECTED', 'Rejected'
    leave_id = models.IntegerField(primary_key=True)
    employee_id = models.IntegerField()
    reviewed_by = models.IntegerField()
    start_date = models.DateField()
    end_date = models.DateField()
    leave_type = models.CharField(max_length=50)
    reason = models.TextField()
    status = models.CharField(max_length=20,choices=Status.choices)