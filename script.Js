let data = JSON.parse(localStorage.getItem('ledgerData')) || [];
let myChart;

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    if (tabName === 'dashboard') {
        document.getElementById('dashboard').style.display = 'block';
        renderChart();
    } else {
        document.getElementById('entry-form').style.display = 'block';
        updateTable();
    }
}

function addEntry() {
    const desc = document.getElementById('desc').value;
    const amount = document.getElementById('amount').value;
    const type = document.getElementById('type').value;

    if (!desc || !amount) return alert("Please enter details");

    data.push({ desc, amount: parseFloat(amount), type, date: new Date().toLocaleDateString() });
    localStorage.setItem('ledgerData', JSON.stringify(data));
    
    document.getElementById('desc').value = '';
    document.getElementById('amount').value = '';
    updateTable();
    calculateTotals();
}

function calculateTotals() {
    let income = data.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    let expense = data.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    document.getElementById('total-income').innerText = `$${income.toFixed(2)}`;
    document.getElementById('total-expense').innerText = `$${expense.toFixed(2)}`;
    document.getElementById('net-balance').innerText = `$${(income - expense).toFixed(2)}`;
}

function updateTable() {
    const body = document.getElementById('table-body');
    body.innerHTML = data.map(t => `
        <tr>
            <td>${t.desc}</td>
            <td class="${t.type}">${t.type.toUpperCase()}</td>
            <td>$${t.amount.toFixed(2)}</td>
            <td>${t.date}</td>
        </tr>
    `).join('');
}

function renderChart() {
    const ctx = document.getElementById('financeChart').getContext('2d');
    if (myChart) myChart.destroy();
    
    const income = data.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = data.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                data: [income, expense],
                backgroundColor: ['#2ecc71', '#e74c3c']
            }]
        }
    });
}

// Start on Dashboard
showTab('dashboard');
calculateTotals();
