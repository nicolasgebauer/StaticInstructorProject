from dataclasses import field
from django import forms
from .models import Task


class TaskForm(forms.ModelForm):
    category = forms.IntegerField(widget=forms.HiddenInput())
    level_points = forms.IntegerField(widget=forms.HiddenInput())
    draw = forms.JSONField(widget=forms.HiddenInput())
    class Meta:
        model = Task
        fields = '__all__'
