from multiprocessing import context
from django.shortcuts import render, redirect
from .models import Task, Account, TaskPerStudent
from .forms import TaskForm, TaskFormDraw
from django.contrib.auth.models import User, auth
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib import messages
# Create your views here.

def list_tasks(request):
    tasks = Task.objects.all()
    context = {
        'tasks': tasks
    }
    return render (request,'index.html',context)


def create_task(request):
    if request.method == 'GET':
        task_form = TaskForm()
        context = {
            'form':task_form
        }
    else:
        task_form = TaskForm(request.POST, request.FILES)
        context = {
            'form':task_form
        }
        if task_form.is_valid():
            task_form.save()
            return redirect('teacher_page')
    return render (request,'create_task.html',context)


def edit_task(request,id):
    task = Task.objects.get(id = id)
    if request.method == 'GET':
        task_form = TaskForm(instance = task)
        context = {
            'form': task_form,
            'drawJSON': task.draw
        }
    else:
        task_form = TaskForm(request.POST, request.FILES , instance = task)
        context = {
            'form':task_form
        }
        if task_form.is_valid():
            task_form.save()
            return redirect('teacher_page')
    return render (request,'edit_task.html',context)


def delete_task(request,id=None):
    task = Task.objects.get(id = id)
    task.delete()
    return redirect('teacher_page')


def login(request):   
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        user = auth.authenticate(username=username, password=password)

        if user is not None:
            auth.login(request, user)
            if username == "teacher":
                return redirect('teacher_page')
            else:
                return redirect('student_page') 
        else:
            messages.info(request, 'Credenciales inválidas')
            return redirect('login')

    else:
        return render(request, 'login.html')


def register(request):
    if request.method == 'POST':
        username = request.POST["username"]
        user_email = request.POST['email']
        password = request.POST['password']
        password2 = request.POST['password2']
        
        if password == password2:
            if User.objects.filter(email=user_email).exists():
                messages.info(request, 'Email Taken')
                return redirect('register')
            
            elif User.objects.filter(username=username).exists():
                messages.info(request, 'Username Taken')
                return redirect('register')
            
            else:
                user = User.objects.create_user(username = username,email=user_email, password=password)
                user.save()

                user_login = auth.authenticate(username=username, password=password)
                auth.login(request, user_login)

                user_model = User.objects.get(username=username)
                new_profile = Account.objects.create(user=user_model, id=user_model.id,email = user_email)
                
                new_profile.save()
        
                if username == "teacher":
                    return redirect('login')
                
                else:
                    return redirect('login')
                
        else:
            messages.info(request, 'Las contraseñas no coinciden')
            return redirect('register')
        
    else:
        return render(request, 'register.html')


def student_page(request):
    user_object = User.objects.get(username=request.user.username)
    user_profile = Account.objects.get(user=user_object)
    
    p = user_profile.user_category
    order_tasks = []
    tasks = list(Task.objects.filter(category = p+1))
    ready_tasks = TaskPerStudent.objects.filter(student = user_profile, solved = True )
    print(tasks)
    for rt in ready_tasks:
        if rt.task in tasks:
            tasks.remove(rt.task)
    print("/"*100)
    print(tasks)
    while tasks:
        min = float("inf")
        min_task = ""
        for t in tasks:
            if t.level_points <= min:
                min = t.level_points
                min_task = t
        print(min_task)
        print(tasks)
        order_tasks.append(min_task)
        tasks.remove(min_task)
            
    student = Account.objects.get(id=request.user.id)
    print(order_tasks)
    next_task = TaskPerStudent.objects.create(task = order_tasks[0], student = student)       
    next_task.save()
    order_tasks.pop(0)
    print('ACA'*100)
    print(order_tasks)
    print(tasks)
    s = 0
    l = []
    for i in tasks:
        l.append((i.id,i.level_points))
        
    l.sort(key = lambda x: x[1]) 
    print(l)
    
    context = {
        'tasks': order_tasks,
        'next_task': next_task,
        'ready_tasks': ready_tasks,
        'user_profile': user_profile
    }
        
    return render(request, 'student_page.html',context)


@login_required(login_url="login")
def logout(request):
    auth.logout(request)
    return redirect('login')


@login_required(login_url="login")
def teacher_page(request):
    tasks = Task.objects.all()
    context = {
        'tasks': tasks
    }
    return render (request,'teacher_page.html',context)

@login_required(login_url="login")
def task_to_student(request, id_task):
    task = Task.objects.get(id = id_task)
    student = Account.objects.get(id=request.user.id)
    new_homework = TaskPerStudent.objects.create(task = task, student = student)       
    new_homework.save()
    return redirect('student_page')

@login_required(login_url="login")
def task_to_student0(request, id_task):
    new_homework = TaskPerStudent.objects.get(id = id_task)   
    task = Task.objects.get(id = new_homework.task.id)
    student = Account.objects.get(id=request.user.id)
    print("_"*100)
    print(new_homework)
    print(task)
    print(student) 
    draw_sjon = new_homework.task.draw
    
    if request.method == 'GET':
        task_form = TaskFormDraw(instance=new_homework)
        context = {
            'homework' : new_homework,
            'form':task_form,
            'draw_json': draw_sjon,
            'task': task
        }
    else:
        task_form = TaskFormDraw(request.POST, request.FILES, instance=new_homework)
        context = {
            'homework' : new_homework,
            'form': task_form,
            'draw_json': draw_sjon,
            'task': task 
        }
        if task_form.is_valid():
            task_form.save()
            return redirect('task_to_student1', id_task=new_homework.id)
        
    
    return render(request, 'resolution_task_0.html', context)


@login_required(login_url="login")

def task_to_student1(request, id_task):
    new_homework = TaskPerStudent.objects.get(id = id_task)   
    task = Task.objects.get(id = new_homework.task.id)
    student = Account.objects.get(id=request.user.id)
    draw_json = new_homework.task.draw
    dcl_json = new_homework.task.dcl
    print("_"*100)
    print(new_homework)
    print(task)
    print(student)
    if request.method == 'GET':
        task_form = TaskFormDraw(instance=new_homework)
        context = {
            'homework' : new_homework,
            'form':task_form,
            'draw_json': draw_json,
            'dcl_json': dcl_json,
            'task': task
        }
    else:
        task_form = TaskFormDraw(request.POST, request.FILES, instance=new_homework)
        context = {
            'homework' : new_homework,
            'form':task_form,
            'draw_json': draw_json,
            'dcl_json': dcl_json,
            'task': task
        }
        if task_form.is_valid():
            task_form.save()
            return redirect('student_page')
    return render(request, 'resolution_task_1.html',context)


@login_required(login_url="login")
def task_to_student2(request, id_task):
    task = Task.objects.get(id = id_task)
    student = Account.objects.get(id=request.user.id)
    new_homework = TaskPerStudent.objects.create(task = task, student = student)       
    new_homework.save()
    draw_sjon = new_homework.task.draw
    
    if request.method == 'GET':
        task_form = TaskFormDraw()
        context = {
            'homework' : new_homework,
            'form':task_form,
            'draw_json': draw_sjon
        }
    else:
        task_form = TaskFormDraw(request.POST, request.FILES)
        context = {
            'homework' : new_homework,
            'form': task_form,
            'draw_json': draw_sjon
        }
        if task_form.is_valid():
            task_form.save()
            return render("student_page.html")
    
    return render(request, 'resolution_task_2.html', context)


def users_list(request):
    users = Account.objects.all()
    h = []
    for g in users:
        if g.user.username != 'teacher':
            h.append(g)
                 
    context = {
        'users': h
    }       
    return render (request,'users_list.html',context)


def users_details(request,id):
    print("/"*100)
    print(id)
    user = Account.objects.get(id = id)
    print(user)
    context = {
        'user': user
    }
   
    return render (request,'users_details.html',context)