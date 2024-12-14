from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.


def welcome_message(request):
    return HttpResponse("Welcome to Inventory Management System!")