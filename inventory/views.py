from django.shortcuts import render
from django.views import generic
from .models import Item

# Create your views here.

class ItemListView(generic.ListView):
    model = Item
    template_name = "inventory/index.html"
    queryset = Item.objects.all()
   

class ItemDetailView(generic.DetailView):
    model = Item
    template_name = "inventory/item_detail.html"
    context_object_name = "item"