import json
from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse
from django.views import generic, View
from django.http import HttpResponseRedirect
from django.contrib import messages
from django.core.paginator import Paginator
from django.db import models
from django.db.models import Sum, Count, Avg, F, Q, FloatField
from .models import Item, Transaction, Category
from .forms import CategoryForm, ItemForm, TransactionForm, SelectItemForm, SelectItemForViewForm


# Create your views here.

class ItemListView(generic.ListView):
    model = Item
    template_name = "inventory/index.html"
    context_object_name = "object_list"
    paginate_by = 10
    queryset = Item.objects.all()

    def get_queryset(self):
        query = self.request.GET.get("q")
        if query:
            return Item.objects.filter(
                Q(name__icontains=query) | 
                Q(sku__icontains=query) | 
                Q(description__icontains=query) |
                Q(category__name__icontains=query)
            )
        return super().get_queryset()
   

class ItemDetailView(generic.DetailView):
    model = Item
    template_name = "inventory/item_detail.html"
    context_object_name = "item"

class ItemDeleteView(View):
    def post(self, request, pk):
        item = get_object_or_404(Item, pk=pk)
        item.delete()
        messages.success(request, "Item deleted successfully!")
        return HttpResponseRedirect(reverse("home"))

def add_or_edit_item(request, pk=None):
    if pk:
        # Editing an existing item
        item = get_object_or_404(Item, pk=pk)
        form = ItemForm(instance=item)
        heading = f"Edit Item: {item.name}"
        success_message = f"Item '{item.name}' updated successfully!"
    else:
        # Adding a new item
        item = None
        form = ItemForm()
        heading = "Add New Item"
        success_message = "Item added successfully!"

    if request.method == "POST":
        form = ItemForm(request.POST, instance=item)
        if form.is_valid():
            saved_item = form.save()
            messages.success(request, success_message)
            # Redirect based on whether it's an add or edit
            return redirect("item-detail", pk=saved_item.pk)
    
    return render(request, "inventory/form.html", {
        "form": form,
        "heading": heading,
        "button_label": "Save",
        "cancel_url": reverse("items-list"),
    })

def low_stock_items(request):
    low_stock_items = Item.objects.filter(quantity__lte=models.F('low_stock_threshold'))
    return render(request, "inventory/low_stock.html", {"low_stock_items": low_stock_items})


def record_transaction(request, pk):
    item = get_object_or_404(Item, pk=pk)

    if request.method == "POST":
        try:
            # Initialize the form with POST data and the item instance
            form = TransactionForm(request.POST, item=item)
            if form.is_valid():
                transaction = form.save(commit=False)
                transaction.item = item

                # Update item quantity
                if transaction.transaction_type == 'add':
                    item.quantity += transaction.quantity
                elif transaction.transaction_type == 'remove':
                    item.quantity -= transaction.quantity

                item.save()
                transaction.save()
                messages.success(request, "Transaction recorded successfully!")
                return redirect('item-detail', pk=pk)
        except Exception as e:
            # Handle unexpected errors gracefully
            messages.error(request, f"An error occurred: {str(e)}")
            return redirect('item-detail', pk=pk)
    else:
        # Initialize the form for a GET request
        form = TransactionForm(item=item)

    # Render the template with the form
    return render(request, 'inventory/record_transaction.html', {'form': form, 'item': item})


def view_transactions(request, pk):
    item = get_object_or_404(Item, pk=pk)
    transactions = item.transactions.all()

    paginator = Paginator(transactions, 10)  # Show 10 transactions per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, 'inventory/view_transactions.html', {'item': item, 'page_obj': page_obj})

def select_item_record_transaction(request):
    """
    View to select an item before redirecting to the Record Transaction page.
    """
    if request.method == 'POST':
        form = SelectItemForm(request.POST)
        if form.is_valid():
            item = form.cleaned_data['item']
            return redirect('record-transaction', pk=item.id)
    else:
        form = SelectItemForm()

    return render(request, 'inventory/select_item_record_transaction.html', {'form': form})


def select_item_view_transactions(request):
    """
    View to select an item before redirecting to the View Transactions page.
    """
    if request.method == 'POST':
        form = SelectItemForViewForm(request.POST)
        if form.is_valid():
            item = form.cleaned_data['item']
            return redirect('view-transactions', pk=item.id)
    else:
        form = SelectItemForm()

    return render(request, 'inventory/select_item_view_transactions.html', {'form': form})

def add_category(request, pk=None):
    if pk:
        category = get_object_or_404(Category, pk=pk)
        form = CategoryForm(instance=category)
        heading = f"Edit Category: {category.name}"
        success_message = f"Category '{category.name}' updated successfully!"
    else:
        category = None
        form = CategoryForm()
        heading = "Add New Category"
        success_message = "Category added successfully!"

    if request.method == "POST":
        form = CategoryForm(request.POST, instance=category)
        if form.is_valid():
            form.save()
            messages.success(request, success_message)
            return redirect("home")
    
    return render(request, "inventory/form.html", {
        "form": form,
        "heading": heading,
        "button_label": "Save",
        "cancel_url": reverse("home"),
    })



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

    # Data for charts
    report_data = Item.objects.values('category__name').annotate(
        total_quantity=Sum('quantity'),
        total_value=Sum(F('quantity') * F('price'), output_field=FloatField()),
        low_stock_count=Count('id', filter=Q(quantity__lte=F('low_stock_threshold')))
    )
    # Fetch Items
    items = Item.objects.all()
    # Prepare data for charts
    categories = [data['category__name'] for data in report_data]
    quantities = [data['total_quantity'] for data in report_data]
    values = [data['total_value'] for data in report_data]
    low_stocks = [data['low_stock_count'] for data in report_data] 

    # Pass the data to the template
    return render(request, 'inventory/dashboard.html', {
        'total_items': total_items,
        'total_categories': total_categories,
        'total_value': total_value,
        'low_stock_count': low_stock_count,
        'categories': json.dumps(categories),
        'quantities': json.dumps(quantities),
        'values': json.dumps(values),
        'low_stocks': json.dumps(low_stocks),
    })

