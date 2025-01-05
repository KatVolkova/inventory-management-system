from django.urls import path
from . import views
from django.http import HttpResponse
from django.views.generic.base import RedirectView

urlpatterns = [
    path("", views.dashboard, name='home'),
    path("items-list/", views.ItemListView.as_view(), name="items-list"),
    path("add-category/", views.add_category, name="add-category"),
    path("item/add/", views.add_or_edit_item, name="add-item"),
    path("item/<int:pk>/edit/", views.add_or_edit_item, name="item-edit"),
    path("item/<int:pk>/", views.ItemDetailView.as_view(), name="item-detail"),
    path("item/<int:pk>/delete/", views.ItemDeleteView.as_view(), name="item-delete"),
    path('low-stock/', views.low_stock_items, name='low-stock'),
    path('select-item-record-transaction/', views.select_item_record_transaction, name='select-item-record-transaction'),
    path('select-item-view-transactions/', views.select_item_view_transactions, name='select-item-view-transactions'),
    path("item/<int:pk>/record-transaction/", views.record_transaction, name="record-transaction"),
    path("item/<int:pk>/transactions/", views.view_transactions, name="view-transactions"),
    path("stock-report/", views.stock_report, name="stock-report"),
    path('favicon.ico', RedirectView.as_view(url='/static/images/default-favicon.ico', permanent=True)),
]