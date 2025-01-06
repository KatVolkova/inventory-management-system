/* jshint esversion: 6 */
/* global Chart */
import { initializeChart, setupChartExport } from './chart.js';

document.addEventListener('DOMContentLoaded', function () {
    const chartDataElement = document.getElementById('chart-data');

    if (!chartDataElement) {
        console.error('Chart data element not found.');
        return;
    }

    try {
        // Parse data from dataset attributes
        const categories = JSON.parse(chartDataElement.dataset.categories || '[]');
        const quantities = JSON.parse(chartDataElement.dataset.quantities || '[]');
        const values = JSON.parse(chartDataElement.dataset.values || '[]');
        const lowStocks = JSON.parse(chartDataElement.dataset.lowstocks || '[]');

        // Initialize Charts
        initializeChart('stockOverviewChart', {
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

        initializeChart('lowStockLineChart', {
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
                plugins: { legend: { display: false } },
                scales: {
                    y: { ticks: { display: false }, grid: { display: false } },
                    x: { ticks: { maxRotation: 0, font: { size: 10 } } }
                }
            }
        });

        initializeChart('valueBarChart', {
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
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { display: false }, grid: { display: false } },
                    y: { ticks: { font: { size: 10 } } }
                }
            }
        });

        initializeChart('categoryPieChart', {
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
                plugins: { legend: { display: true } },
            }
        });

    } catch (error) {
        console.error('Error initializing charts:', error);
    }

    // Setup chart export functionality
    setupChartExport();
});
