from distutils.command.upload import upload
from tokenize import blank_re
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.
class Task(models.Model):
    id = models.AutoField(primary_key=True)
    statement = models.TextField()
    category = models.IntegerField(default=0)
    level_points = models.IntegerField(default=0)
    image = models.ImageField(null=True,blank = True,upload_to = "images")
    draw = models.JSONField(null=True, blank = True)
    dcl = models.JSONField(null=True, blank = True)

    def __str__(self):
        return self

class Account(models.Model):
    email = models.CharField(max_length=30)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    user_category = models.IntegerField(default= 1)
    user_level = models.IntegerField(default= 0)
    id = models.IntegerField(default= 1, primary_key=True)


    def __str__(self):
        return self.user.username

class TaskPerStudent(models.Model):
    task = models.ForeignKey(Task,on_delete=models.CASCADE)
    student = models.ForeignKey(Account,on_delete=models.CASCADE)
    current_stage = models.IntegerField(default=0)
    stage0_errors = models.IntegerField(default=0)
    stage1_errors = models.IntegerField(default=0)
    stage2_errors = models.IntegerField(default=0)
    student_draw = models.JSONField(null=True, blank = True)
    student_dcl = models.JSONField(null=True, blank = True)