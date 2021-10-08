// Get HTML elements
const INPUTS = document.querySelectorAll('.input');
const TIP_BTNS = document.querySelectorAll('.tip-percent');

const RESET_BTN = document.querySelector('.btn--reset');

const TIP_AMOUNT_PER_PERSON = document.getElementById('tip-amount');
const TOTAL_AMOUNT_PER_PERSON = document.getElementById('total-amount');

// These variables temporarily store user's inputted values
let billValue = '';
let customValue = '';
let headcountValue = '';

let tipMultiplier = 0;

function calculateTipAmountPerPerson(total) {
    // Display the 'Tip Amount / person'
    TIP_AMOUNT_PER_PERSON.textContent = '$' + ((total - INPUTS[0].value) / INPUTS[2].value).toFixed(2);

    // If the 'Number of People' input is zero or empty, display '$0.00' as the 'Tip Amount / person' text content
    if (INPUTS[2].value == false) TIP_AMOUNT_PER_PERSON.textContent = '$0.00';
};

function calculateTotalPerPerson() {
    for (let btn of TIP_BTNS) {
        // If a button is selected, the tip % displayed on the button will be saved in variable
        if (btn.checked) tipMultiplier = btn.dataset.percent;
    }

    // If user enters a 'Custom Tip' value, this will be saved in variable
    if (INPUTS[1].value) tipMultiplier = INPUTS[1].value;

    // Calculate total cost...
    const total = INPUTS[0].value * (1 + tipMultiplier / 100);
    // ...and display the 'Total / person'
    TOTAL_AMOUNT_PER_PERSON.textContent = '$' + (total / INPUTS[2].value).toFixed(2);

    // If the 'Number of People' input is zero or empty...
    if (INPUTS[2].value == false) { 
        // ...add 'error' class to 'Number of People' input parent element...
        INPUTS[2].parentElement.classList.add('error');
        // ...and add aria-invalid="true" to 'Number of People' input...
        INPUTS[2].setAttribute('aria-invalid', 'true');
        // ...and add aria-describedBy attribute which links with 'Error Message' ID
        INPUTS[2].setAttribute('aria-describedby', 'error-message');
        // ...and display '$0.00' as the 'Total / person' text content...
        TOTAL_AMOUNT_PER_PERSON.textContent = '$0.00';
    }
    
    else {
        // ...otherwise remove the 'error' class...
        INPUTS[2].parentElement.classList.remove('error');
        // ...and remove aria-invalid="true" to 'Number of People' input...
        INPUTS[2].removeAttribute('aria-invalid');
        // ...and remove aria-describedBy attribute
        INPUTS[2].removeAttribute('aria-describedby');
    }
    
    calculateTipAmountPerPerson(total);
}

// When user clicks a '%' button...
TIP_BTNS.forEach( btn => {
    btn.addEventListener('click', e => {
        // ...remove content from 'Custom Tip' input...
        INPUTS[1].value = '';
        customValue = '';
        // ...and uncheck any '%' buttons...
        if (e.target.checked === true) {
            uncheckPercentBtns();
            // ...except the one being clicked
            btn.checked = true;
        }

        toggleResetBtn();
        calculateTotalPerPerson();
    });
});

// When user changes 'Custom Tip' input value...
const uncheckPercentBtns = () => {
    // ...uncheck selected '%' button
    for (let btn of TIP_BTNS) btn.checked = false;
}

function toggleResetBtn() {
    // If any input fields have content...
    if (INPUTS[0].value ||
        INPUTS[1].value ||
        INPUTS[2].value ||
        // ...or any buttons are checked...
        TIP_BTNS[0].checked ||
        TIP_BTNS[1].checked ||
        TIP_BTNS[2].checked ||
        TIP_BTNS[3].checked ||
        TIP_BTNS[4].checked) {

        // ...enable the 'Reset' button by adding 'enabled' class...
        RESET_BTN.classList.add('enabled');
    }
    // ...otherwise disable the 'Reset' button by removing the 'enabled' class
    else { RESET_BTN.classList.remove('enabled'); }
}

/* ------------------------------------------------------ */
/*                     Event Listeners                    */
/* ------------------------------------------------------ */

// When the 'Reset' button is clicked...
RESET_BTN.addEventListener('click', e => {
    // ...empty all the input fields...
    for (let input of INPUTS) {
        input.value = '';
    }
    // ...and uncheck all the buttons
    for (let btn of TIP_BTNS) {
        btn.checked = false;
    }

    calculateTotalPerPerson();
    toggleResetBtn();

    // Remove the 'error' class...
    INPUTS[2].parentElement.classList.remove('error');
    // ...and remove aria-invalid="true" to 'Number of People' input...
    INPUTS[2].removeAttribute('aria-invalid');
    // ...and remove aria-describedBy attribute
    INPUTS[2].removeAttribute('aria-describedby');
});

INPUTS.forEach( input => {
    input.addEventListener('keydown', e => {
        // Allow the user to delete last remaining character with backspace key
        // Necessary because 'input' event listener prevents this otherwise
        if (e.target.id === 'bill' && e.key === 'Backspace') billValue = '';
        if (e.target.id === 'bill' && e.key === 'Delete') billValue = '';

        if (e.target.id === 'custom-tip' && e.key === 'Backspace') customValue = '';
        if (e.target.id === 'custom-tip' && e.key === 'Delete') customValue = '';

        if (e.target.id === 'headcount' && e.key === 'Backspace') headcountValue = '';
        if (e.target.id === 'headcount' && e.key === 'Delete') headcountValue = '';

        // Prevent user from typing a decimal number
        if (e.target.id === 'headcount' && e.key === '.') e.preventDefault();
    });
});

INPUTS.forEach( input => {
    // Listen for changes to the input fields
    input.addEventListener('input', e => {

        // If the input field is 'Bill'...
        if (e.target.id === 'bill') {
            // ...and if value is NOT empty...
            if (e.target.value !== '') {
                // ...save value in variable...
                billValue = e.target.value;
            }
            // ...else if value is empty...
            else if (e.target.value === '') {
                // ...let value be what has been saved in variable
                e.target.value = billValue;
            }

            // If user tries to input a number greater than 10000, input value becomes 10000
            if (e.target.value > 10000) e.target.value = 10000;

            // If user tries to input number with more than 2 decimal places...
            if (e.target.value.includes('.') && e.target.value.split('.')[1].length > 2) {
                // ...round the number to 2 decimal places...
                billValue = Number(e.target.value).toFixed(2);
                // ...and update value
                e.target.value = billValue;
            }
        }
        
        // If the input field is 'Custom Tip'...
        if (e.target.id === 'custom-tip') {

            // ...and if value is NOT empty...
            if (e.target.value !== '') {
                // ...save value in variable...
                customValue = e.target.value;
            }
            // ...else if value is empty...
            else if (e.target.value === '') {
                // ...let value be what has been saved in variable
                e.target.value = customValue;
            }

            // If user tries to input a number greater than 100, input value becomes 100
            if (e.target.value > 100) e.target.value = 100;

            // If user tries to input number with more than 2 decimal places...
            if (e.target.value.includes('.') && e.target.value.split('.')[1].length > 2) {
                // ...round the number to 2 decimal places...
                customValue = Number(e.target.value).toFixed(2);
                // ...and update value
                e.target.value = customValue;
            }

            uncheckPercentBtns();
        }

        // If the input field is 'Number of People'...
        if (e.target.id === 'headcount') {
            // ...and if value is NOT empty...
            if (e.target.value !== '') {
                // ...save value in variable...
                headcountValue = e.target.value;
            }
            // ...else if value is empty...
            else if (e.target.value === '') {
                // ...let value be what has been saved in variable
                e.target.value = headcountValue;
            }

            // If user tries to input a number greater than 1000, input value becomes 1000
            if (e.target.value > 1000) e.target.value = 1000;

            // If value includes a decimal...
            if (e.target.value.includes('.')) {
                // ...remove it
                e.target.value = headcountValue.slice(0, -1);
            }
        }

        toggleResetBtn();
        calculateTotalPerPerson();
    })
})
