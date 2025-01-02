from django.urls import path
from . import views

urlpatterns = [
    path("", views.dashboard, name='home'),
    path("items-list/", views.ItemListView.as_view(), name="items-list"),
    path("add-category/", views.add_category, name="add-category"),
    path("add-item/", views.add_item, name="add-item"),
    path("item/<int:pk>/", views.ItemDetailView.as_view(), name="item-detail"),
    path("item/<int:pk>/edit/", views.ItemEditView.as_view(), name="item-edit"),
    path("item/<int:pk>/delete/", views.ItemDeleteView.as_view(), name="item-delete"),
    path('low-stock/', views.low_stock_items, name='low-stock'),
    path("item/<int:pk>/record-transaction/", views.record_transaction, name="record-transaction"),
    path("item/<int:pk>/transactions/", views.view_transactions, name="view-transactions"),
    path("stock-report/", views.stock_report, name="stock-report"),
]