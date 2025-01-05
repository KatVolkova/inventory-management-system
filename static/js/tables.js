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
        className: 'btn btn-primary'
    },
    {
        extend: 'csv',
        text: '<i class="fas fa-file-csv"></i> CSV',
        className: 'btn btn-primary'
    },
    {
        extend: 'excel',
        text: '<i class="fas fa-file-excel"></i> Excel',
        className: 'btn btn-primary'
    },
    {
        extend: 'pdf',
        text: '<i class="fas fa-file-pdf"></i> PDF',
        className: 'btn btn-primary'
    },
    {
        extend: 'print',
        text: '<i class="fas fa-print"></i> Print',
        className: 'btn btn-primary'
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
    $(api.column(1).footer()).html(totalQuantity);
    $(api.column(2).footer()).html('$' + totalValue.toFixed(2));
    $(api.column(4).footer()).html('$' + averagePrice.toFixed(2));
}
});

// Highlight rows based on the 'Items Below Stock Threshold' column
$('#stockReportTable tbody tr').each(function () {
var lowStock = $(this).find('td').eq(5).text(); 
if (parseInt(lowStock) > 0) {
    $(this).addClass('table-danger'); 
}
});
// Initialize Low Stock Items Table
$('#lowStockItemsTable').DataTable({
dom: 'Bfrtip',
buttons: [
    {
        extend: 'copy',
        text: '<i class="fas fa-copy"></i> Copy',
        className: 'btn btn-primary'
    },
    {
        extend: 'csv',
        text: '<i class="fas fa-file-csv"></i> CSV',
        className: 'btn btn-primary'
    },
    {
        extend: 'excel',
        text: '<i class="fas fa-file-excel"></i> Excel',
        className: 'btn btn-primary'
    },
    {
        extend: 'pdf',
        text: '<i class="fas fa-file-pdf"></i> PDF',
        className: 'btn btn-primary'
    },
    {
        extend: 'print',
        text: '<i class="fas fa-print"></i> Print',
        className: 'btn btn-primary'
    }
],
paging: true, 
searching: true, 
ordering: true, 
order: [[2, 'asc']], 
columnDefs: [
    { targets: 4, orderable: false } 
]   
});
// Initialize Transactions Table
$('#transactionsTable').DataTable({
    dom: 'Bfrtip',
    buttons: [
        {
            extend: 'copy',
            text: '<i class="fas fa-copy"></i> Copy',
            className: 'btn btn-primary'
        },
        {
            extend: 'csv',
            text: '<i class="fas fa-file-csv"></i> CSV',
            className: 'btn btn-primary'
        },
        {
            extend: 'excel',
            text: '<i class="fas fa-file-excel"></i> Excel',
            className: 'btn btn-primary'
        },
        {
            extend: 'pdf',
            text: '<i class="fas fa-file-pdf"></i> PDF',
            className: 'btn btn-primary'
        },
        {
            extend: 'print',
            text: '<i class="fas fa-print"></i> Print',
            className: 'btn btn-primary'
        }
    ],
    paging: true,
    searching: true,
    ordering: true,
    order: [[1, 'desc']], // Sort by date (timestamp column) in descending order
    columnDefs: [
        { targets: [0, 3], orderable: false } // Disable ordering on 'Item' and 'Type' columns
    ]
});
// Initialize Bootstrap tooltips
$('[title]').tooltip();
});
