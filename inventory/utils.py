import json
from django.db.models import Sum, Count, Avg, F, Q, FloatField
from .models import Item


def prepare_stock_data():
    """
        Prepares and aggregates stock-related data for
        visualization and reporting.
    """
    # Group items by category and calculate all metrics
    report_data = Item.objects.values('category__name').annotate(
        total_quantity=Sum('quantity'),
        total_value=Sum(F('quantity') * F('price'), output_field=FloatField()),
        item_count=Count('id'),
        avg_price=Avg('price', output_field=FloatField()),
        low_stock_count=Count(
            'id',
            filter=Q(quantity__lte=F('low_stock_threshold'))
            )
    ).order_by('category__name')

    # Prepare data for the chart
    categories = [data['category__name'] for data in report_data]
    quantities = [data['total_quantity'] for data in report_data]
    values = [data['total_value'] for data in report_data]
    low_stocks = [data['low_stock_count'] for data in report_data]

    return {
        'categories': categories,
        'quantities': quantities,
        'values': values,
        'low_stocks': low_stocks,
        'report_data': report_data,
    }
