from django.shortcuts import render
from django.views import generic
from .models import Item

# Create your views here.

class ItemListView(generic.ListView):
    model = Item
    template_name = "inventory/index.html"
    queryset = Item.objects.all()
   