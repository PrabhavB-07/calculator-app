let currentInput = '';
let previousInput = '';
let operator = '';
let resultShown = false;

const resultEl = document.getElementById('result');
const expressionEl = document.getElementById('expression');

function updateDisplay(value) {
    resultEl.textContent = value;
    resultEl.classList.add('pop');
    setTimeout(() => resultEl.classList.remove('pop'), 150);
}

function appendNumber(num) {
    if (resultShown) {
        currentInput = '';
        resultShown = false;
    }

    if (currentInput.length >= 12) return;

    currentInput += num;
    updateDisplay(currentInput);
}

function appendOperator(op) {
    if (currentInput === '' && previousInput === '') return;

    if (currentInput !== '' && previousInput !== '') {
        calculate(true);
    }

    if (currentInput !== '') {
        previousInput = currentInput;
        currentInput = '';
    }

    operator = op;
    resultShown = false;

    const symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
    expressionEl.textContent = previousInput + ' ' + symbols[op];
}

function appendDot() {
    if (resultShown) {
        currentInput = '0';
        resultShown = false;
    }

    if (currentInput.includes('.')) return;
    if (currentInput === '') currentInput = '0';

    currentInput += '.';
    updateDisplay(currentInput);
}

function calculate(chaining = false) {
    if (previousInput === '' || operator === '') return;

    let a = parseFloat(previousInput);
    let b = parseFloat(currentInput === '' ? previousInput : currentInput);
    let result;

    if (operator === '+') result = a + b;
    else if (operator === '-') result = a - b;
    else if (operator === '*') result = a * b;
    else if (operator === '/') {
        if (b === 0) {
            expressionEl.textContent = '';
            updateDisplay('Error');
            currentInput = '';
            previousInput = '';
            operator = '';
            return;
        }
        result = a / b;
    }

    result = parseFloat(result.toFixed(10));

    if (!chaining) {
        const symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
        expressionEl.textContent = previousInput + ' ' + symbols[operator] + ' ' + (currentInput || previousInput) + ' =';
    }

    currentInput = String(result);
    previousInput = '';
    operator = '';
    resultShown = !chaining;

    updateDisplay(currentInput);
}

function clearAll() {
    currentInput = '';
    previousInput = '';
    operator = '';
    resultShown = false;
    expressionEl.textContent = '';
    updateDisplay('0');
}

function toggleSign() {
    if (currentInput === '' || currentInput === '0') return;
    currentInput = String(parseFloat(currentInput) * -1);
    updateDisplay(currentInput);
}

function percentage() {
    if (currentInput === '') return;
    currentInput = String(parseFloat(currentInput) / 100);
    updateDisplay(currentInput);
}

document.addEventListener('keydown', function(e) {
    if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
    else if (e.key === '+') appendOperator('+');
    else if (e.key === '-') appendOperator('-');
    else if (e.key === '*') appendOperator('*');
    else if (e.key === '/') { e.preventDefault(); appendOperator('/'); }
    else if (e.key === '.') appendDot();
    else if (e.key === 'Enter' || e.key === '=') calculate();
    else if (e.key === 'Backspace') {
        if (resultShown) { clearAll(); return; }
        currentInput = currentInput.slice(0, -1);
        updateDisplay(currentInput || '0');
    }
    else if (e.key === 'Escape') clearAll();
});