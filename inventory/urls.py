from django.urls import path
from django.views.generic.base import RedirectView
from . import views


urlpatterns = [
    path("", views.dashboard, name='home'),
    path("items-list/", views.ItemListView.as_view(), name="items-list"),
    path("add-category/", views.add_category, name="add-category"),
    path("item/add/", views.add_or_edit_item, name="add-item"),
    path("item/<int:pk>/edit/", views.add_or_edit_item, name="item-edit"),
    path("item/<int:pk>/", views.ItemDetailView.as_view(), name="item-detail"),
    path(
        "item/<int:pk>/delete/",
        views.ItemDeleteView.as_view(),
        name="item-delete"),
    path('low-stock/', views.low_stock_items, name='low-stock'),
    path(
        'select-item/<str:action>/',
        views.select_item_for_transaction,
        name='select-item'
        ),
    path(
        "item/<int:item_id>/record-transaction/",
        views.record_transaction,
        name="record-transaction"
        ),
    path(
        "item/<int:item_id>/transactions/",
        views.view_transactions,
        name="view-transactions"
        ),
    path("stock-report/", views.stock_report, name="stock-report"),
    path(
        'favicon.ico',
        RedirectView.as_view(
            url='/static/images/favicon.png',
            permanent=True)
        ),
    path('test-404/', views.test_404_view, name='test-404'),
]
