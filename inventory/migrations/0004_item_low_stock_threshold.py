# Generated by Django 4.2.17 on 2024-12-28 17:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0003_alter_category_options_alter_item_options_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='item',
            name='low_stock_threshold',
            field=models.PositiveIntegerField(default=10),
        ),
    ]
