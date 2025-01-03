/* jshint esversion: 6 */
/* global Chart, chartData */

document.addEventListener('DOMContentLoaded', function () {
    // Chart creation helper function
    function createChart(context, config) {
        return new Chart(context, config);
    }

    // Bar Chart: Total Quantity
    const stockOverviewChart = createChart(
        document.getElementById('stockOverviewChartCanvas').getContext('2d'),
        {
            type: 'bar',
            data: {
                labels: chartData.categories,
                datasets: [{
                    label: 'Total Quantity',
                    data: chartData.quantities,
                    backgroundColor: [
                        '#6a9eaf', '#d4a5a5', '#a5d4a5', '#d4c2a5', '#a5a5d4', '#d4a5d4',
                        '#5885ca', '#99e5be', '#e1e0c0', '#e2afa8', '#c0b3cd', '#aeb9be'
                    ],
                    borderColor: [
                        '#40738a', '#b06d6d', '#6db06d', '#b09e6d', '#6d6db0', '#b06db0',
                        '#969882', '#5fc87a', '#49856c', '#5a7b7b', '#67997d', '#9f67a5'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                return `Total Quantity: ${tooltipItem.raw}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Total Quantity' }
                    },
                    x: {
                        title: { display: true, text: 'Categories' }
                    }
                }
            }
        }
    );

    // Horizontal Bar Chart: Total Value by Category
    const valueBarChart = createChart(
        document.getElementById('valueBarChartCanvas').getContext('2d'),
        {
            type: 'bar',
            data: {
                labels: chartData.categories,
                datasets: [{
                    label: 'Total Value',
                    data: chartData.values,
                    backgroundColor: [
                        '#6a9eaf', '#d4a5a5', '#a5d4a5', '#d4c2a5', '#a5a5d4', '#d4a5d4',
                        '#5885ca', '#99e5be', '#e1e0c0', '#e2afa8', '#c0b3cd', '#aeb9be'
                    ],
                    borderColor: [
                        '#40738a', '#b06d6d', '#6db06d', '#b09e6d', '#6d6db0', '#b06db0',
                        '#969882', '#5fc87a', '#49856c', '#5a7b7b', '#67997d', '#9f67a5'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                return `$${tooltipItem.raw}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        title: { display: true, text: 'Total Value (USD)' }
                    },
                    y: {
                        title: { display: true, text: 'Categories' }
                    }
                }
            }
        }
    );

    // Pie Chart: Category Contribution
    const categoryPieChart = createChart(
        document.getElementById('categoryPieChartCanvas').getContext('2d'),
        {
            type: 'pie',
            data: {
                labels: chartData.categories,
                datasets: [{
                    data: chartData.values,
                    backgroundColor: [
                        '#6a9eaf', '#d4a5a5', '#a5d4a5', '#d4c2a5', '#a5a5d4', '#d4a5d4',
                        '#5885ca', '#99e5be', '#e1e0c0', '#e2afa8', '#c0b3cd', '#aeb9be'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                const percentage = ((tooltipItem.raw / chartData.values.reduce((a, b) => a + b, 0)) * 100).toFixed(2);
                                return `${chartData.categories[tooltipItem.dataIndex]}: $${tooltipItem.raw} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        }
    );

    // Line Chart: Low Stock Trends
    const lowStockLineChart = createChart(
        document.getElementById('lowStockLineChartCanvas').getContext('2d'),
        {
            type: 'line',
            data: {
                labels: chartData.categories,
                datasets: [{
                    label: 'Low Stock Count',
                    data: chartData.lowStocks,
                    borderColor: '#6a9eaf',
                    backgroundColor: 'rgba(106, 158, 175, 0.2)',
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, title: { display: true, text: 'Low Stock Count' } },
                    x: { title: { display: true, text: 'Categories' } }
                }
            }
        }
    );

    // Export Chart Function
    window.exportChart = function (canvasId, filename) {
        const canvas = document.getElementById(canvasId);
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png'); 
        link.download = `${filename}.png`; 
        link.click(); 
    };
});
