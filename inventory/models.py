from django.db import models

# Create your models here.


class Category(models.Model):
    """
    Represents a category to which items can belong
    """
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"
        ordering = ['name']

    def __str__(self):
        return str(self.name)


class Item(models.Model):
    """Model representing an inventory item with stock and category details."""
    name = models.CharField(max_length=100, unique=True)
    sku = models.CharField(max_length=50, unique=True)
    quantity = models.PositiveIntegerField()
    low_stock_threshold = models.PositiveIntegerField(default=10)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        blank=True,
        null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Item"
        verbose_name_plural = "Items"
        ordering = ['-created_at']
        get_latest_by = 'created_at'
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['sku']),
        ]

    @property
    def is_low_stock(self):
        """Check if the item's stock is below
        or equal to the low stock threshold."""
        return self.quantity <= self.low_stock_threshold

    def __str__(self):
        return str(self.name)


class Transaction(models.Model):
    """Model representing a stock transaction for an inventory item."""
    TRANSACTION_TYPE_CHOICES = [
        ('add', 'Add Stock'),
        ('remove', 'Remove Stock'),
    ]

    item = models.ForeignKey(
        'Item',
        on_delete=models.CASCADE,
        related_name='transactions')
    transaction_type = models.CharField(
        max_length=10,
        choices=TRANSACTION_TYPE_CHOICES)
    quantity = models.PositiveIntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Transaction"
        verbose_name_plural = "Transactions"
        ordering = ['-timestamp']

    def __str__(self):
        return (
            f"{self.get_transaction_type_display()} "
            f"{self.quantity} of {self.item.name}"
        )
