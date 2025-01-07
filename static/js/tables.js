/* jshint esversion: 9 */
/* jshint jquery: true */

$(document).ready(function () {
    // Reusable function for DataTable buttons
    const dataTableButtons = [
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
    ];

    // Common DataTable language settings
    const dataTableLanguage = {
        paginate: {
            previous: '<span aria-hidden="true">Previous</span>',
            next: '<span aria-hidden="true">Next</span>'
        },
        aria: {
            sortAscending: 'Activate to sort column ascending',
            sortDescending: 'Activate to sort column descending'
        }
    };

    // Common ARIA updates for pagination
    const updatePaginationAria = () => {
        $('.paginate_button.previous').attr({
            'aria-label': 'Go to the previous page',
            'role': 'button'
        });
        $('.paginate_button.next').attr({
            'aria-label': 'Go to the next page',
            'role': 'button'
        });
        $('.paginate_button.current').attr({
            'aria-label': 'You are on the current page',
            'role': 'button'
        });
    };

    // Update pagination links with valid href attributes
    const updatePaginationLinks = (tableId) => {
        $(`${tableId}_paginate a`).each(function () {
            const text = $(this).text().trim();
            if (!isNaN(text)) {
                // For numbered pages, set href with a query parameter
                $(this).attr('href', `?page=${text}`);
            } else if (text.toLowerCase() === 'previous') {
                // For the "Previous" button
                $(this).attr('href', '?page=prev');
            } else if (text.toLowerCase() === 'next') {
                // For the "Next" button
                $(this).attr('href', '?page=next');
            }
        });
    };

    // Reusable DataTable initialization function
    const initializeDataTable = (tableId, additionalOptions = {}) => {
        $(tableId).DataTable({
            dom: 'Bfrtip',
            buttons: dataTableButtons,
            language: dataTableLanguage,
            drawCallback: function () {
                updatePaginationAria();
                updatePaginationLinks(tableId); // Add valid href attributes
            },
            ...additionalOptions // Allow overriding or adding custom options
        });
    };

    // Initialize Stock Report Table
    initializeDataTable('#stockReportTable', {
        footerCallback: function (row, data, start, end, display) {
            const api = this.api();

            // Total Quantity
            const totalQuantity = api
                .column(1, { page: 'current' })
                .data()
                .reduce((a, b) => parseInt(a) + parseInt(b), 0);

            // Total Value
            const totalValue = api
                .column(2, { page: 'current' })
                .data()
                .reduce((a, b) => parseFloat(a) + parseFloat(b.replace(/[\$,]/g, '')), 0);

            // Average Price
            const averagePrice =
                totalValue / api.column(4, { page: 'current' }).data().length || 0;

            // Update footer with ARIA live regions
            $(api.column(1).footer()).html(totalQuantity).attr('aria-live', 'polite');
            $(api.column(2).footer()).html('$' + totalValue.toFixed(2)).attr('aria-live', 'polite');
            $(api.column(4).footer()).html('$' + averagePrice.toFixed(2)).attr('aria-live', 'polite');
        }
    });

    // Highlight rows in the Stock Report Table
    $('#stockReportTable tbody tr').each(function () {
        const lowStock = $(this).find('td').eq(5).text();
        if (parseInt(lowStock) > 0) {
            $(this).addClass('table-danger').attr('aria-live', 'polite').attr('role', 'alert');
        }
    });

    // Initialize other tables with different configurations
    initializeDataTable('#lowStockItemsTable', {
        order: [[2, 'asc']], // Sort by the third column
        columnDefs: [{ targets: 4, orderable: false }]
    });

    initializeDataTable('#transactionsTable', {
        order: [[1, 'desc']], // Sort by the second column
        columnDefs: [{ targets: [0, 3], orderable: false }]
    });

    initializeDataTable('#allItemsTable', {
        order: [[5, 'desc']] // Sort by the sixth column
    });

    // Initialize Bootstrap tooltips
    $('[title]')
        .tooltip({
            container: 'body',
            trigger: 'hover focus',
            placement: 'top'
        })
        .attr('aria-describedby', function () {
            return $(this).attr('id') + '-tooltip';
        });
});
