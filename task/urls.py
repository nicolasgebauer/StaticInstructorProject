from django.urls import path
from . import views


urlpatterns = [
    path('',views.list_tasks,name='index'),
    path('newTask/',views.create_task, name='new_task'),
    path('addingDCL/',views.add_dcl, name='add_dcl'),
    path('editTask/<int:id>/',views.edit_task, name='edit_task'),
]