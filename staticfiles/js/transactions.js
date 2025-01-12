/* jshint esversion: 6 */
document.addEventListener('DOMContentLoaded', function () {
    // Form handling for the "Select Item" process
    const itemSelectForm = document.querySelector('#item-select-form');
    const itemSelect = document.querySelector('#item-select');
    
    // Check if elements exist before adding event listeners
    if (itemSelectForm && itemSelect) {
        itemSelectForm.addEventListener('submit', function (event) {
            if (!itemSelect.value) {
                event.preventDefault(); 
                alert('Please select an item to proceed.');
            }
        });
    }

    // Handling dynamic links for record and view transactions (if applicable)
    const recordLink = document.getElementById('recordTransactionLink');
    const recordSelect = document.getElementById('recordItemSelect');
    const viewLink = document.getElementById('viewTransactionsLink');
    const viewSelect = document.getElementById('viewItemSelect');

    if (recordLink && recordSelect) {
        recordSelect.addEventListener('change', function () {
            recordLink.href = `/select-item/record?item=${this.value}`;
        });
    }

    if (viewLink && viewSelect) {
        viewSelect.addEventListener('change', function () {
            viewLink.href = `/select-item/view?item=${this.value}`;
        });
    }

    // Add ARIA attributes to buttons for better accessibility
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach((button) => {
        button.setAttribute('role', 'button');
    });
});