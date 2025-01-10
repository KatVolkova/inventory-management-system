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
from .forms import CategoryForm, ItemForm, TransactionForm, ItemSelectionForm
from .utils import prepare_stock_data

# Create your views here.


class ItemListView(generic.ListView):
    """View to display a paginated list of
    inventory items with optional search functionality."""
    model = Item
    template_name = "inventory/index.html"
    context_object_name = "object_list"
    paginate_by = 10
    queryset = Item.objects.all()

    def get_queryset(self):
        """Filter the queryset based on a search query parameter."""
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
    """View to display detailed information
    about a specific inventory item."""
    model = Item
    template_name = "inventory/item_detail.html"
    context_object_name = "item"


class ItemDeleteView(View):
    """View to handle the deletion of an inventory item."""
    def post(self, request, pk):
        """Handle the deletion of an inventory
        item and redirect to the home page."""
        item = get_object_or_404(Item, pk=pk)
        item.delete()
        messages.success(request, "Item deleted successfully!")
        return HttpResponseRedirect(reverse("home"))


def add_or_edit_item(request, pk=None):
    """
    Handle the creation or editing of an inventory item.
    """
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
    """
    View to display a list of items that are low in stock
    """
    low_stock_items = Item.objects.filter(
        quantity__lte=models.F('low_stock_threshold')
        )
    return render(
        request,
        "inventory/low_stock.html",
        {"low_stock_items": low_stock_items}
        )


def select_item_for_transaction(request, action):
    """View to handle item selection for recording or viewing transactions."""
    form = ItemSelectionForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        item = form.cleaned_data['item']
        if action == 'record':
            return redirect('record-transaction', item_id=item.id)
        elif action == 'view':
            return redirect('view-transactions', item_id=item.id)
    return render(request, 'inventory/transaction_form.html', {'form': form})


def record_transaction(request, item_id):
    """View to handle recording a transaction for a specific inventory item."""
    item = get_object_or_404(Item, id=item_id)
    form = TransactionForm(request.POST or None, item=item)
    if request.method == 'POST' and form.is_valid():
        transaction = form.save(commit=False)
        transaction.item = item

        # Update item quantity based on transaction type
        if transaction.transaction_type == 'add':
            item.quantity += transaction.quantity
        elif transaction.transaction_type == 'remove':
            item.quantity -= transaction.quantity

        item.save()
        transaction.save()
        messages.success(request, "Transaction recorded successfully!")
        return redirect('item-detail', pk=item.id)  # Use 'pk' here

    return render(
        request,
        'inventory/transaction_form.html',
        {'item': item, 'form': form}
        )


def view_transactions(request, item_id):
    """View to display a paginated list of transactions for a specific item."""
    item = get_object_or_404(Item, id=item_id)
    transactions = Transaction.objects.filter(item=item).order_by('-timestamp')

    paginator = Paginator(transactions, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(
        request,
        'inventory/transaction_list.html',
        {'item': item, 'page_obj': page_obj}
        )


def add_category(request, pk=None):
    """View to add a new category or edit an existing one."""
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
    """View to generate and display a stock report
    with aggregated metrics and visualizations."""
    sort = request.GET.get('sort', 'category')
    report_data = Item.objects.values('category__name').annotate(
        total_quantity=Sum('quantity'),
        total_value=Sum(F('quantity') * F('price'), output_field=FloatField()),
        item_count=Count('id'),
        avg_price=Avg('price', output_field=FloatField()),
        low_stock_count=Count(
            'id',
            filter=Q(quantity__lte=F('low_stock_threshold'))
            )
    ).order_by(sort)

    # Prepare data for the chart
    stock_data = prepare_stock_data()

    # Fetch all items for the All Inventory Items table
    items = Item.objects.all().order_by('-updated_at')

    # Fetch all recorded transactions

    transactions = (
        Transaction.objects
        .select_related('item')
        .all().
        order_by('-timestamp')
        )
    return render(request, 'inventory/stock_report.html', {
        'report_data': report_data,
        'items': items,
        'transactions': transactions,
        'categories': json.dumps(stock_data['categories']),
        'quantities': json.dumps(stock_data['quantities']),
        'values': json.dumps(stock_data['values']),
        'low_stocks': json.dumps(stock_data['low_stocks']),
        })


def dashboard(request):
    """View to display the inventory dashboard with
    analytics and visualizations."""
    # Calculate analytics data
    total_items = Item.objects.count()
    total_categories = Category.objects.count()
    total_value = (
        Item.objects.aggregate(
            total_value=Sum(F('quantity') * F('price'))
            )['total_value'] or 0
        )
    low_stock_count = (
        Item.objects.filter(
            quantity__lte=F('low_stock_threshold')
            ).count()
            )

    # Data for charts
    stock_data = prepare_stock_data()
    # Fetch Items
    items = Item.objects.all()

    # Pass the data to the template
    return render(request, 'inventory/dashboard.html', {
        'total_items': total_items,
        'total_categories': total_categories,
        'total_value': total_value,
        'low_stock_count': low_stock_count,
        'categories': json.dumps(stock_data['categories']),
        'quantities': json.dumps(stock_data['quantities']),
        'values': json.dumps(stock_data['values']),
        'low_stocks': json.dumps(stock_data['low_stocks']),
    })
