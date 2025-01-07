/* jshint esversion: 6 */
/* jshint jquery: true */
$(document).ready(function() {
    // Initialize Stock Report Table
    $('#stockReportTable').DataTable({
    dom: 'Bfrtip', 
    buttons: [
    {
        extend: 'copy',
        text: '<i class="fas fa-copy"></i> Copy',
        className: 'btn btn-primary',
        attr: {
            'aria-label': 'Copy table data to clipboard'
        }
    },
    {
        extend: 'csv',
        text: '<i class="fas fa-file-csv"></i> CSV',
        className: 'btn btn-primary',
        attr: {
            'aria-label': 'Download table data as CSV file'
        }
    },
    {
        extend: 'excel',
        text: '<i class="fas fa-file-excel"></i> Excel',
        className: 'btn btn-primary',
        attr: {
            'aria-label': 'Download table data as Excel file'
        }
    },
    {
        extend: 'pdf',
        text: '<i class="fas fa-file-pdf"></i> PDF',
        className: 'btn btn-primary',
        attr: {
            'aria-label': 'Download table data as PDF file'
        }
    },
    {
        extend: 'print',
        text: '<i class="fas fa-print"></i> Print',
        className: 'btn btn-primary',
        attr: {
            'aria-label': 'Print table data'
        }
    }
    ],
    footerCallback: function (row, data, start, end, display) {
    // Calculate Totals
    var api = this.api();

    // Total Quantity
    var totalQuantity = api
        .column(1, { page: 'current' })
        .data()
        .reduce(function (a, b) {
            return parseInt(a) + parseInt(b);
        }, 0);

    // Total Value
    var totalValue = api
        .column(2, { page: 'current' })
        .data()
        .reduce(function (a, b) {
            return parseFloat(a) + parseFloat(b.replace(/[\$,]/g, ''));
        }, 0);

    // Average Price
    var averagePrice =
        totalValue / api.column(4, { page: 'current' }).data().length || 0;

    // Summary row
    $(api.column(1).footer()).html(totalQuantity).attr('aria-live', 'polite');
    $(api.column(2).footer()).html('$' + totalValue.toFixed(2)).attr('aria-live', 'polite');
    $(api.column(4).footer()).html('$' + averagePrice.toFixed(2)).attr('aria-live', 'polite');
}
});

// Highlight rows based on the 'Items Below Stock Threshold' column
$('#stockReportTable tbody tr').each(function () {
var lowStock = $(this).find('td').eq(5).text(); 
if (parseInt(lowStock) > 0) {
    $(this).addClass('table-danger').attr('aria-live', 'polite').attr('role', 'alert'); 
}
});
// Initialize Low Stock Items Table
$('#lowStockItemsTable').DataTable({
dom: 'Bfrtip',
buttons: [
    {
        extend: 'copy',
        text: '<i class="fas fa-copy"></i> Copy',
        className: 'btn btn-primary',
        attr: {
            'aria-label': 'Copy table data to clipboard'
        }
    },
    {
        extend: 'csv',
        text: '<i class="fas fa-file-csv"></i> CSV',
        className: 'btn btn-primary',
        attr: {
            'aria-label': 'Download table data as CSV file'
        }
    },
    {
        extend: 'excel',
        text: '<i class="fas fa-file-excel"></i> Excel',
        className: 'btn btn-primary',
        attr: {
            'aria-label': 'Download table data as Excel file'
        }
    },
    {
        extend: 'pdf',
        text: '<i class="fas fa-file-pdf"></i> PDF',
        className: 'btn btn-primary',
        attr: {
            'aria-label': 'Download table data as PDF file'
        }
    },
    {
        extend: 'print',
        text: '<i class="fas fa-print"></i> Print',
        className: 'btn btn-primary',
        attr: {
            'aria-label': 'Print table data'
        }
    }
],
paging: true, 
searching: true, 
ordering: true, 
order: [[2, 'asc']], 
columnDefs: [
    { targets: 4, orderable: false } 
], 
language: {
    paginate: {
        previous: '<span aria-hidden="true">Previous</span>',
        next: '<span aria-hidden="true">Next</span>',
    },
    aria: {
        sortAscending: 'Activate to sort column ascending',
        sortDescending: 'Activate to sort column descending'
    } 
    },
    drawCallback: function () {
        // Add ARIA attributes to pagination buttons
        $('.paginate_button.previous').attr({
            'aria-label': 'Go to the previous page',
            'role': 'button',
        });
        $('.paginate_button.next').attr({
            'aria-label': 'Go to the next page',
            'role': 'button',
        });
        $('.paginate_button.current').attr({
            'aria-label': 'You are on the current page',
            'role': 'button',
        });
    }
});
// Initialize Transactions Table
$('#transactionsTable').DataTable({
    dom: 'Bfrtip',
    buttons: [
        {
            extend: 'copy',
            text: '<i class="fas fa-copy"></i> Copy',
            className: 'btn btn-primary',
            attr: {
                'aria-label': 'Copy table data to clipboard'
            }
        },
        {
            extend: 'csv',
            text: '<i class="fas fa-file-csv"></i> CSV',
            className: 'btn btn-primary',
            attr: {
                'aria-label': 'Download table data as CSV file'
            }
        },
        {
            extend: 'excel',
            text: '<i class="fas fa-file-excel"></i> Excel',
            className: 'btn btn-primary',
            attr: {
                'aria-label': 'Download table data as Excel file'
            }
        },
        {
            extend: 'pdf',
            text: '<i class="fas fa-file-pdf"></i> PDF',
            className: 'btn btn-primary',
            attr: {
                'aria-label': 'Download table data as PDF file'
            }
        },
        {
            extend: 'print',
            text: '<i class="fas fa-print"></i> Print',
            className: 'btn btn-primary',
            attr: {
                'aria-label': 'Print table data'
            }
        }
    ],
    paging: true,
    searching: true,
    ordering: true,
    order: [[1, 'desc']], 
    columnDefs: [
        { targets: [0, 3], orderable: false } 
    ]
});
// Initialize Inventory Items List Table
$('#allItemsTable').DataTable({
    dom: 'Bfrtip',
    buttons: [
        {
            extend: 'copy',
            text: '<i class="fas fa-copy"></i> Copy',
            className: 'btn btn-primary',
            attr: {
                'aria-label': 'Copy table data to clipboard'
            }
        },
        {
            extend: 'csv',
            text: '<i class="fas fa-file-csv"></i> CSV',
            className: 'btn btn-primary',
            attr: {
                'aria-label': 'Download table data as CSV file'
            }
        },
        {
            extend: 'excel',
            text: '<i class="fas fa-file-excel"></i> Excel',
            className: 'btn btn-primary',
            attr: {
                'aria-label': 'Download table data as Excel file'
            }
        },
        {
            extend: 'pdf',
            text: '<i class="fas fa-file-pdf"></i> PDF',
            className: 'btn btn-primary',
            attr: {
                'aria-label': 'Download table data as PDF file'
            }
        },
        {
            extend: 'print',
            text: '<i class="fas fa-print"></i> Print',
            className: 'btn btn-primary',
            attr: {
                'aria-label': 'Print table data'
            }
        }
    ],
    paging: true,
    searching: true,
    ordering: true,
    order: [[5, 'desc']], 
});

// Initialize Bootstrap tooltips
$('[title]').tooltip(
    {
        container: 'body',
        trigger: 'hover focus',
        placement: 'top'
    }).attr('aria-describedby', function () {
        return $(this).attr('id') + '-tooltip';
    }
);
});
