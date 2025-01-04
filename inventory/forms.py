from django import forms
from .models import Item , Category
from .models import Transaction


class CategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ['name', 'description']

class ItemForm(forms.ModelForm):
    class Meta:
        model = Item
        fields = ['name', 'sku', 'quantity', 'price', 'description', 'category']


class TransactionForm(forms.ModelForm):
    class Meta:
        model = Transaction
        fields = ['transaction_type', 'quantity']

    def __init__(self, *args, **kwargs):
        self.item = kwargs.pop('item', None)  # Pass the item instance to the form
        super().__init__(*args, **kwargs)

    def clean(self):
        cleaned_data = super().clean()
        transaction_type = cleaned_data.get('transaction_type')
        quantity = cleaned_data.get('quantity')

        if transaction_type == 'remove' and quantity > self.item.quantity:
            raise forms.ValidationError("Cannot remove more than available stock!")

        return cleaned_data

class SelectItemForm(forms.Form):
    item = forms.ModelChoiceField(
        queryset=Item.objects.all(),
        empty_label="Select an item...",
        widget=forms.Select(attrs={
            'class': 'form-select w-50 mx-auto',
            'aria-label': 'Select an item to record a new transaction',
            'id': 'item-select'
        })
    )

class SelectItemForViewForm(forms.Form):
    item = forms.ModelChoiceField(
        queryset=Item.objects.all(),
        empty_label="Select an item to view transactions...",
        widget=forms.Select(attrs={
            'class': 'form-select w-50 mx-auto',
            'aria-label': 'Select an item to view transactions',
            'id': 'item-select-view'
        })
    )