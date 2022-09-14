from distutils.command.upload import upload
from tokenize import blank_re
from django.db import models

# Create your models here.
class Task(models.Model):
    id = models.AutoField(primary_key=True)
    statement = models.TextField()
    category = models.IntegerField(default=0)
    level_points = models.IntegerField(default=0)
    image = models.ImageField(null=True,blank = True,upload_to = "images/")


    def __str__(self):
        return self.category + " | " + str(self.level)
