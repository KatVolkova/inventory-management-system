from django import forms
from .models import Item, Category
from .models import Transaction


class CategoryForm(forms.ModelForm):
    """Form for creating and editing Category instances."""
    class Meta:
        model = Category
        fields = ['name', 'description']


class ItemForm(forms.ModelForm):
    """Form for creating and editing Item instances."""
    class Meta:
        model = Item
        fields = [
            'name',
            'sku',
            'quantity',
            'price',
            'description',
            'category'
            ]


class TransactionForm(forms.ModelForm):
    """Form for recording and validating stock transactions."""
    class Meta:
        model = Transaction
        fields = ['transaction_type', 'quantity']

    def __init__(self, *args, **kwargs):
        self.item = kwargs.pop('item', None)
        super().__init__(*args, **kwargs)

    def clean(self):
        cleaned_data = super().clean()
        transaction_type = cleaned_data.get('transaction_type')
        quantity = cleaned_data.get('quantity')

        if transaction_type == 'remove':
            if not self.item:
                raise forms.ValidationError(
                    "Item is not provided for validation."
                    )
            if quantity > self.item.quantity:
                raise forms.ValidationError(
                    "Cannot remove more than available stock!"
                    )
        return cleaned_data


class ItemSelectionForm(forms.Form):
    """Form for selecting an item from the inventory."""
    item = forms.ModelChoiceField(
        queryset=Item.objects.all(),
        empty_label="Select an item...",
        widget=forms.Select(attrs={
            'class': 'form-select w-50 mx-auto',
            'aria-label': 'Select an item',
            'id': 'item-select'
        })
    )
