/* jshint esversion: 6 */
/* global Chart, chartData */
import { initializeChart, setupChartExport } from './chart.js';

document.addEventListener('DOMContentLoaded', function () {
    // Bar Chart: Total Quantity
    initializeChart('stockOverviewChartCanvas', {
        type: 'bar',
        data: {
            labels: chartData.categories,
            datasets: [{
                label: 'Total Quantity',
                data: chartData.quantities,
                backgroundColor: '#6a9eaf',
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
        }
    });

    // Horizontal Bar Chart: Total Value by Category
    initializeChart('valueBarChartCanvas', {
        type: 'bar',
        data: {
            labels: chartData.categories,
            datasets: [{
                label: 'Total Value',
                data: chartData.values,
                backgroundColor: '#a5d4a5',
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: { legend: { display: false } },
        }
    });

    // Pie Chart: Category Contribution
    initializeChart('categoryPieChartCanvas', {
        type: 'pie',
        data: {
            labels: chartData.categories,
            datasets: [{
                data: chartData.values,
                backgroundColor: ['#6a9eaf', '#d4a5a5', '#a5d4a5', '#d4c2a5', '#a5a5d4', '#d4a5d4'],
            }]
        },
        options: {
            plugins: { legend: { position: 'bottom' } },
        }
    });

    // Line Chart: Low Stock Trends
    initializeChart('lowStockLineChartCanvas', {
        type: 'line',
        data: {
            labels: chartData.categories,
            datasets: [{
                label: 'Low Stock Count',
                data: chartData.lowStocks,
                borderColor: '#6a9eaf',
                backgroundColor: 'rgba(106, 158, 175, 0.2)',
                tension: 0.3,
                pointRadius: 4,
                pointBackgroundColor: '#6a9eaf',
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
        }
    });

    // Setup chart export functionality
    setupChartExport();
});
