from django.contrib import admin
from .models import Task, TaskPerStudent, Account


admin.site.register(Task)
admin.site.register(TaskPerStudent)
admin.site.register(Account)