from dataclasses import field
from django import forms
from .models import Task, TaskPerStudent


class TaskForm(forms.ModelForm):
    category = forms.IntegerField(widget=forms.HiddenInput())
    level_points = forms.IntegerField(widget=forms.HiddenInput())
    draw = forms.JSONField(widget=forms.HiddenInput())
    dcl = forms.JSONField(widget=forms.HiddenInput())
    
    class Meta:
        model = Task
        fields = '__all__'
        
class TaskFormDraw(forms.ModelForm):
    student_draw = forms.JSONField(widget=forms.HiddenInput())
    solved = forms.BooleanField(widget=forms.HiddenInput())
    class Meta:
        model = TaskPerStudent
        fields = ["student_draw", "solved",] #'__all__'
