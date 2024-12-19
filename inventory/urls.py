from django.urls import path
from . import views

urlpatterns = [
    path("", views.ItemListView.as_view(), name="home"),
    path("item/<int:pk>/", views.ItemDetailView.as_view(), name="item-detail"),
    path("item/<int:pk>/edit/", views.ItemEditView.as_view(), name="item-edit"),
    path("item/<int:pk>/delete/", views.ItemDeleteView.as_view(), name="item-delete"),
]