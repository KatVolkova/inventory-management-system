import json
from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse
from django.views import generic, View
from django.http import HttpResponseRedirect
from django.contrib import messages
from django.db import models
from django.db.models import Sum, Count, Avg, F, Q, FloatField
from .models import Item, Transaction, Category
from .forms import CategoryForm, ItemForm, TransactionForm

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


def record_transaction(request, pk):
    item = get_object_or_404(Item, pk=pk)

    if request.method == "POST":
        form = TransactionForm(request.POST)
        if form.is_valid():
            transaction = form.save(commit=False)
            transaction.item = item

            # Update item quantity
            if transaction.transaction_type == 'add':
                item.quantity += transaction.quantity
            elif transaction.transaction_type == 'remove':
                if transaction.quantity > item.quantity:
                    messages.error(request, "Cannot remove more than available stock!")
                    return redirect('record-transaction', pk=pk)
                item.quantity -= transaction.quantity

            item.save()
            transaction.save()
            messages.success(request, "Transaction recorded successfully!")
            return redirect('item-detail', pk=pk)
    else:
        form = TransactionForm()

    return render(request, 'inventory/record_transaction.html', {'form': form, 'item': item})


def view_transactions(request, pk):
    item = get_object_or_404(Item, pk=pk)
    transactions = item.transactions.all()

    return render(request, 'inventory/view_transactions.html', {'item': item, 'transactions': transactions})


def add_category(request):
    if request.method == "POST":
        form = CategoryForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Category added successfully!")
            return redirect("home")
    else:
        form = CategoryForm()
    return render(request, "inventory/add_category.html", {"form": form})

def add_item(request):
    if request.method == "POST":
        form = ItemForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Item added successfully!")
            return redirect("home")
    else:
        form = ItemForm()
    return render(request, "inventory/add_item.html", {"form": form})

def stock_report(request):
    # Group items by category and calculate all metrics
    sort = request.GET.get('sort', 'category')
    report_data = Item.objects.values('category__name').annotate(
        total_quantity=Sum('quantity'),
        total_value=Sum(F('quantity') * F('price'), output_field=FloatField()),
        item_count=Count('id'),
        avg_price=Avg('price', output_field=FloatField()),
        low_stock_count=Count('id', filter=Q(quantity__lte=F('low_stock_threshold')))
    ).order_by(sort)

    # Prepare data for the chart
    categories = [data['category__name'] for data in report_data]
    quantities = [data['total_quantity'] for data in report_data]
    values = [data['total_value'] for data in report_data]
    low_stocks = [data['low_stock_count'] for data in report_data]

    return render(request, 'inventory/stock_report.html', {
        'report_data': report_data,
        'categories': json.dumps(categories),
        'quantities': json.dumps(quantities),
        'values': json.dumps(values),
        'low_stocks': json.dumps(low_stocks),
        })


def dashboard(request):
    # Calculate analytics data
    total_items = Item.objects.count()
    total_categories = Category.objects.count()
    total_value = Item.objects.aggregate(total_value=Sum(F('quantity') * F('price')))['total_value'] or 0
    low_stock_count = Item.objects.filter(quantity__lte=F('low_stock_threshold')).count()

    # Pass the data to the template
    return render(request, 'inventory/dashboard.html', {
        'total_items': total_items,
        'total_categories': total_categories,
        'total_value': total_value,
        'low_stock_count': low_stock_count,
    })

