from django.db import models

# Create your models here.
class Task(models.Model):
    id = models.AutoField(primary_key=True)
    statement = models.TextField()

    def __str__(self):
        return self
