/* jshint esversion: 9 */
import { initializeChart, setupChartExport } from './chart.js';

document.addEventListener('DOMContentLoaded', () => {
    const chartDataElement = document.getElementById('chart-data');

    if (!chartDataElement) {
        console.error('Chart data element not found.');
        return;
    }

    // Helper Function: Parse Data Attributes
    const parseChartData = (key, fallback = []) => {
        try {
            return JSON.parse(chartDataElement.dataset[key] || JSON.stringify(fallback));
        } catch (error) {
            console.error(`Error parsing data for ${key}:`, error);
            return fallback;
        }
    };

    // Retrieve data from the dataset
    const categories = parseChartData('categories');
    const quantities = parseChartData('quantities');
    const values = parseChartData('values');
    const lowStocks = parseChartData('lowstocks');

    // Common chart options
    const commonOptions = Object.assign({}, {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: { ticks: { display: false }, grid: { display: false } },
            x: { ticks: { maxRotation: 0, font: { size: 10 } } }
        }
    });

    // Chart Configurations
    const chartsConfig = [
        {
            id: 'stockOverviewChart',
            type: 'bar',
            data: {
                labels: categories,
                datasets: [{
                    label: 'Total Quantity',
                    data: quantities,
                    backgroundColor: '#85C1E9'
                }]
            },
            options: commonOptions
        },
        {
            id: 'lowStockLineChart',
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
            options: Object.assign({}, commonOptions, {
                plugins: { title: { display: true, text: 'Low Stock Trends' } }
            })
        },
        {
            id: 'valueBarChart',
            type: 'bar',
            data: {
                labels: categories,
                datasets: [{
                    label: 'Total Value',
                    data: values,
                    backgroundColor: '#a5d4a5'
                }]
            },
            options: Object.assign({}, commonOptions, {
                indexAxis: 'y',
                plugins: { title: { display: true, text: 'Total Value by Category' } }
            })
        },
        {
            id: 'categoryPieChart',
            type: 'pie',
            data: {
                labels: categories,
                datasets: [{
                    data: values,
                    backgroundColor: ['#6a9eaf', '#d4a5a5', '#a5d4a5', '#d4c2a5', '#a5a5d4', '#d4a5d4']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { title: { display: true, text: 'Category Contribution' } }
            }
        }
    ];

    // Initialize all charts
    chartsConfig.forEach(({ id, type, data, options }) => {
        initializeChart(id, { type, data, options });
    });

    // Setup chart export functionality
    setupChartExport();
});
