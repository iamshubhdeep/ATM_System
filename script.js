
const initialUserData = {
    "123456": { pin: "1234", balance: 50000.00, name: "Alice Smith" },
    "987654": { pin: "4321", balance: 1200.50, name: "Bob Johnson" }
};

let currentUser = null;

const screenMessage = document.getElementById('screen-message');
const balanceDisplay = document.getElementById('balance-display');
const loginFields = document.getElementById('login-fields');
const transactionFields = document.getElementById('transaction-fields');
const navigationButtons = document.getElementById('navigation-buttons');
const accountInput = document.getElementById('account-input');
const pinInput = document.getElementById('pin-input');
const amountInput = document.getElementById('amount-input');

function getUserData() {
    let data = localStorage.getItem('atmUserData');
    if (!data) {
        localStorage.setItem('atmUserData', JSON.stringify(initialUserData));
        data = JSON.stringify(initialUserData);
    }
    return JSON.parse(data);
}

function saveUserData(data) {
    localStorage.setItem('atmUserData', JSON.stringify(data));
}

function updateScreen(message, balance = null) {
    screenMessage.textContent = message;
    if (balance !== null) {
        balanceDisplay.textContent = `Balance: ₹${balance.toFixed(2)}`;
        balanceDisplay.classList.remove('hidden');
    } else {
        balanceDisplay.classList.add('hidden');
    }
}

function login() {
    const accountNumber = accountInput.value.trim();
    const pin = pinInput.value.trim();
    const users = getUserData();

    if (accountNumber.length !== 6 || pin.length !== 4) {
        updateScreen("Error: Account and PIN must be 6 and 4 digits respectively.");
        return;
    }

    if (users[accountNumber] && users[accountNumber].pin === pin) {
        currentUser = accountNumber;
        accountInput.value = '';
        pinInput.value = '';
        showTransactionMenu();
        updateScreen(`Welcome back, ${users[currentUser].name}! Select a transaction.`);
    } else {
        updateScreen("Login Failed: Invalid Account Number or PIN.");
    }
}

function checkBalance() {
    if (!currentUser) return logout();
    const users = getUserData();
    const balance = users[currentUser].balance;
    updateScreen(`Current Balance for A/C ${currentUser}:`, balance);
    showNavigation();
}

function performTransaction(type) {
    if (!currentUser) return logout();

    let amount = parseFloat(amountInput.value);
    amountInput.value = ''; 

    if (isNaN(amount) || amount <= 0) {
        updateScreen("Error: Please enter a valid positive amount.");
        return;
    }
    
    const users = getUserData();
    let currentBalance = users[currentUser].balance;
    
    let newBalance;
    let message;

    if (type === 'withdraw') {
        if (amount > currentBalance) {
            updateScreen("Transaction Failed: Insufficient funds.");
            return;
        
        if (amount % 100 !== 0) {
             updateScreen("Transaction Failed: Withdrawal must be in multiples of 100.");
            return;
        }
        newBalance = currentBalance - amount;
        message = `Withdrawal successful. Amount: ₹${amount.toFixed(2)}.`;
    } else if (type === 'deposit') {
        newBalance = currentBalance + amount;
        message = `Deposit successful. Amount: ₹${amount.toFixed(2)}.`;
    }

    users[currentUser].balance = newBalance;
    saveUserData(users);
    updateScreen(message, newBalance);
    showNavigation();
}

function logout() {
    currentUser = null;
    updateScreen("Thank you for using the ATM. Card ejected. Please re-insert your card to log in.");
    
    loginFields.classList.remove('hidden');
    transactionFields.classList.add('hidden');
    navigationButtons.classList.add('hidden');
    amountInput.value = '';
}


function showTransactionMenu() {
    loginFields.classList.add('hidden');
    transactionFields.classList.remove('hidden');
    navigationButtons.classList.add('hidden');
    updateScreen(`Welcome, ${getUserData()[currentUser].name}! Select an operation.`);
}

function showNavigation() {
    transactionFields.classList.add('hidden');
    navigationButtons.classList.remove('hidden');
}


window.onload = function() {
    getUserData(); 
    updateScreen("Welcome! Please insert your card (Enter Account/PIN).");

};
