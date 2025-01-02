document.addEventListener('DOMContentLoaded', function () {
    const chartData = document.getElementById('chart-data');

    try {
        // Parse data from the dataset attributes
        const categories = JSON.parse(chartData.dataset.categories || '[]');
        const quantities = JSON.parse(chartData.dataset.quantities || '[]');
        const values = JSON.parse(chartData.dataset.values || '[]');
        const lowStocks = JSON.parse(chartData.dataset.lowstocks || '[]');

        // Debugging: Log parsed data
        console.log('Categories:', categories);
        console.log('Quantities:', quantities);
        console.log('Values:', values);
        console.log('Low Stocks:', lowStocks);

        // Initialize Stock Overview Chart
        new Chart(document.getElementById('stockOverviewChart'), {
            type: 'bar',
            data: {
                labels: categories,
                datasets: [{
                    label: 'Total Quantity',
                    data: quantities,
                    backgroundColor: '#85C1E9',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { ticks: { display: false }, grid: { display: false } },
                    x: { ticks: { maxRotation: 0, font: { size: 10 } } }
                }
            }
        });

        // Initialize Low Stock Trends Chart
        new Chart(document.getElementById('lowStockLineChart'), {
            type: 'line',
            data: {
                labels: categories,
                datasets: [{
                    label: 'Low Stock Count',
                    data: lowStocks,
                    borderColor: '#E74C3C',
                    backgroundColor: 'rgba(106, 158, 175, 0.2)',
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Low Stock Trends' },
                },
                scales: {
                    y: { ticks: { display: false }, grid: { display: false } },
                    x: { ticks: { maxRotation: 0, font: { size: 10 } } }
                }
            }
        });

        // Initialize Total Value by Category Chart
        new Chart(document.getElementById('valueBarChart'), {
            type: 'bar',
            data: {
                labels: categories,
                datasets: [{
                    label: 'Total Value',
                    data: values,
                    backgroundColor: '#a5d4a5',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Total Value by Category' },
                },
                scales: {
                    x: { ticks: { display: false }, grid: { display: false } },
                    y: { ticks: { font: { size: 10 } } }
                }
            }
        });

        // Initialize Category Contribution (Pie Chart)
        new Chart(document.getElementById('categoryPieChart'), {
            type: 'pie',
            data: {
                labels: categories,
                datasets: [{
                    data: values,
                    backgroundColor: ['#6a9eaf', '#d4a5a5', '#a5d4a5', '#d4c2a5', '#a5a5d4', '#d4a5d4'],
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Category Contribution' },
                }
            }
        });

    } catch (error) {
        // Log errors if any occur during parsing or initialization
        console.error('Error parsing JSON data:', error);
    }
});
