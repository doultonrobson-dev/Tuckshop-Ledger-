// 1. DATA INITIALIZATION
// This pulls your saved data from the browser's memory
let data = JSON.parse(localStorage.getItem('ledgerData')) || [];
let myChart;

// 2. NAVIGATION LOGIC
function showTab(tabName) {
    // Hide all sections first
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    
    // Show the one we clicked
    if (tabName === 'dashboard') {
        document.getElementById('dashboard').style.display = 'block';
        renderChart(); // Refresh the chart with latest numbers
    } else {
        document.getElementById('entry-form').style.display = 'block';
        updateTable(); // Refresh the list of transactions
    }
}

// 3. CORE FUNCTIONALITY: ADDING DATA
function addEntry() {
    const desc = document.getElementById('desc').value;
    const amount = document.getElementById('amount').value;
    const type = document.getElementById('type').value;

    if (!desc || !amount) {
        alert("Please enter both a description and an amount.");
        return;
    }

    // Create a new entry object
    const entry = { 
        desc, 
        amount: parseFloat(amount), 
        type, 
        date: new Date().toLocaleDateString() 
    };

    // Save to the array and LocalStorage
    data.push(entry);
    localStorage.setItem('ledgerData', JSON.stringify(data));
    
    // Clear the input boxes for the next entry
    document.getElementById('desc').value = '';
    document.getElementById('amount').value = '';
    
    updateTable();
    calculateTotals();
    alert("Saved successfully!");
}

// 4. CALCULATION LOGIC
function calculateTotals() {
    let income = data.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    let expense = data.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    document.getElementById('total-income').innerText = `$${income.toFixed(2)}`;
    document.getElementById('total-expense').innerText = `$${expense.toFixed(2)}`;
    document.getElementById('net-balance').innerText = `$${(income - expense).toFixed(2)}`;
}

// 5. UI UPDATE: THE TABLE
function updateTable() {
    const body = document.getElementById('table-body');
    body.innerHTML = data.map(t => `
        <tr>
            <td>${t.desc}</td>
            <td class="${t.type.toUpperCase()}">${t.type.toUpperCase()}</td>
            <td>$${t.amount.toFixed(2)}</td>
            <td>${t.date}</td>
        </tr>
    `).join('');
}

// 6. EXPORT LOGIC: DOWNLOAD AS EXCEL (CSV)
function downloadCSV() {
    if (data.length === 0) {
        alert("No data to download yet!");
        return;
    }

    let csv = "Description,Amount,Type,Date\n";
    data.forEach(t => {
        csv += `"${t.desc}",${t.amount},${t.type},${t.date}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'finance_backup.csv');
    a.click();
}

// 7. VISUALS: THE QUICKBOOKS CHART
function renderChart() {
    const ctx = document.getElementById('financeChart').getContext('2d');
    
    // If a chart already exists, destroy it so we can draw a new one
    if (myChart) myChart.destroy();
    
    const income = data.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = data.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    // If no data, don't draw a blank circle
    if (income === 0 && expense === 0) return;

    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                data: [income, expense],
                backgroundColor: ['#2ca01c', '#d5281b'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// INITIALIZE APP
showTab('dashboard');
calculateTotals();
