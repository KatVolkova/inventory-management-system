/* jshint esversion: 6 */
document.addEventListener('DOMContentLoaded', function () {
    // Integration of Transaction Modal Logic
    const recordLink = document.getElementById('recordTransactionLink');
    const recordSelect = document.getElementById('recordItemSelect');
    const viewLink = document.getElementById('viewTransactionsLink');
    const viewSelect = document.getElementById('viewItemSelect');

    // Check if elements exist before adding event listeners
    if (recordLink && recordSelect) {
        recordSelect.addEventListener('change', function () {
            recordLink.href = `/item/${this.value}/record-transaction/`;
        });
    }

    if (viewLink && viewSelect) {
        viewSelect.addEventListener('change', function () {
            viewLink.href = `/item/${this.value}/transactions/`;
        });
    }
});
