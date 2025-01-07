/* jshint esversion: 9 */
/* global chartData */
import { initializeChart, setupChartExport } from './chart.js';

document.addEventListener('DOMContentLoaded', () => {
    // Common chart options
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
    };

    // Chart Configurations
    const chartsConfig = [
        {
            id: 'stockOverviewChartCanvas',
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
                ...commonOptions,
                plugins: { legend: { display: false } },
            }
        },
        {
            id: 'valueBarChartCanvas',
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
                ...commonOptions,
                indexAxis: 'y',
                plugins: { legend: { display: false } },
            }
        },
        {
            id: 'categoryPieChartCanvas',
            type: 'pie',
            data: {
                labels: chartData.categories,
                datasets: [{
                    data: chartData.values,
                    backgroundColor: ['#6a9eaf', '#d4a5a5', '#a5d4a5', '#d4c2a5', '#a5a5d4', '#d4a5d4'],
                }]
            },
            options: {
                ...commonOptions,
                plugins: { legend: { position: 'bottom' } },
            }
        },
        {
            id: 'lowStockLineChartCanvas',
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
                ...commonOptions,
                plugins: { legend: { display: false } },
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
