from django.shortcuts import render, get_object_or_404, reverse
from django.views import generic, View
from django.http import HttpResponseRedirect
from django.contrib import messages
from django.db import models
from django.db.models import Q
from .models import Item
from .forms import ItemForm

# Create your views here.

class ItemListView(generic.ListView):
    model = Item
    template_name = "inventory/index.html"
    queryset = Item.objects.all()

    def get_queryset(self):
        query = self.request.GET.get("q")
        if query:
            return Item.objects.filter(
                Q(name__icontains=query) | Q(sku__icontains=query) | Q(description__icontains=query)
            )
        return super().get_queryset()
   

class ItemDetailView(generic.DetailView):
    model = Item
    template_name = "inventory/item_detail.html"
    context_object_name = "item"


class ItemEditView(View):
    def get(self, request, pk):
        item = get_object_or_404(Item, pk=pk)
        form = ItemForm(instance=item)
        return render(request, "inventory/item_edit.html", {"form": form, "item": item})


    def post(self, request, pk):
        item = get_object_or_404(Item, pk=pk)
        form = ItemForm(request.POST, instance=item)
        if form.is_valid():
            form.save()
            messages.success(request, "Item updated successfully!")
            return HttpResponseRedirect(reverse("item-detail", args=[pk]))
        return render(request, "inventory/item_edit.html", {"form": form, "item": item})





class ItemDeleteView(View):
    def post(self, request, pk):
        item = get_object_or_404(Item, pk=pk)
        item.delete()
        messages.success(request, "Item deleted successfully!")
        return HttpResponseRedirect(reverse("home"))


def low_stock_items(request):
    low_stock_items = Item.objects.filter(quantity__lte=models.F('low_stock_threshold'))
    return render(request, "inventory/low_stock.html", {"low_stock_items": low_stock_items})