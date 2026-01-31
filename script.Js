let data = JSON.parse(localStorage.getItem('ledgerData')) || [];
let myChart;

// Switch between Dashboard and Form
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    document.getElementById(tabId).style.display = 'block';
    
    if (tabId === 'dashboard') {
        renderChart();
        calculateTotals();
    } else {
        updateTable();
    }
}

// Add data and save
function addEntry() {
    const desc = document.getElementById('desc').value;
    const amount = document.getElementById('amount').value;
    const type = document.getElementById('type').value;

    if (!desc || !amount) {
        alert("Enter details first!");
        return;
    }

    data.push({
        desc,
        amount: parseFloat(amount),
        type,
        date: new Date().toLocaleDateString()
    });

    localStorage.setItem('ledgerData', JSON.stringify(data));
    document.getElementById('desc').value = '';
    document.getElementById('amount').value = '';
    
    updateTable();
    alert("Saved!");
}

function calculateTotals() {
    let inc = data.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    let exp = data.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    
    document.getElementById('total-income').innerText = `$${inc.toFixed(2)}`;
    document.getElementById('total-expense').innerText = `$${exp.toFixed(2)}`;
    document.getElementById('net-balance').innerText = `$${(inc - exp).toFixed(2)}`;
}

function updateTable() {
    const body = document.getElementById('table-body');
    body.innerHTML = data.map(t => `
        <tr>
            <td>${t.desc}</td>
            <td style="color:${t.type === 'income' ? 'green' : 'red'}">${t.type.toUpperCase()}</td>
            <td>$${t.amount.toFixed(2)}</td>
            <td>${t.date}</td>
        </tr>
    `).reverse().join(''); // Most recent at top
}

function downloadCSV() {
    if (data.length === 0) return alert("No data!");
    let csv = "Description,Amount,Type,Date\n" + 
        data.map(t => `"${t.desc}",${t.amount},${t.type},${t.date}`).join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup.csv';
    a.click();
}

function renderChart() {
    const ctx = document.getElementById('financeChart').getContext('2d');
    if (myChart) myChart.destroy();
    
    const inc = data.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const exp = data.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{ data: [inc, exp], backgroundColor: ['#2ca01c', '#d5281b'] }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

// Start app
showTab('dashboard');
