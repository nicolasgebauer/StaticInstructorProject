from django.urls import path
from . import views


urlpatterns = [
    path('',views.list_tasks,name='index'),
    path('newTask/',views.create_task, name='new_task'),
    path('editTask/<int:id>/',views.edit_task, name='edit_task'),
    path('deleteTask/<int:id>/',views.delete_task, name='delete_task'),
    path('login/', views.login ,name='login'),
    path('register/', views.register, name="register"),
    path('student_page/', views.student_page, name='student_page'),
    path('logout/', views.logout, name='logout'),
    path('teacher_page/', views.teacher_page, name='teacher_page'),
    path('etapa1/<int:id_task>/', views.task_to_student, name='task_to_student'),
]