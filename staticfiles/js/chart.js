/* jshint esversion: 6 */
/* global Chart */

// Helper Function: Initialize a Chart
export function initializeChart(chartId, config) {
    const chartElement = document.getElementById(chartId);
    if (chartElement) {
        return new Chart(chartElement.getContext('2d'), config);
    } else {
        console.warn(`Chart element with id "${chartId}" not found.`);
        return null;
    }
}
// Helper Function: Prepare Export Functionality for Charts
export function setupChartExport() {
    window.exportChart = function (canvasId, filename) {
        const canvas = document.getElementById(canvasId);
        if (canvas) {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `${filename}.png`;
            link.click();
        } else {
            console.warn(`Canvas element with id "${canvasId}" not found.`);
        }
    };
}
