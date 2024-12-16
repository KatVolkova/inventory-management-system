from django.shortcuts import render
from django.views import generic
from .models import Item

# Create your views here.

class ItemListView(generic.ListView):
    model = Item
    template_name = "inventory/item_list.html"
    content_object_name = "items"
    queryset = Item.objects.all()