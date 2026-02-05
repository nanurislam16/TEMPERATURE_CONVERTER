function convertTemp() {
  const tempInputEl = document.getElementById('tempInput');
  const tempInput = tempInputEl.value;
  const fromUnit = document.getElementById('fromUnit').value;
  const toUnit = document.getElementById('toUnit').value;
  const resultElement = document.getElementById('result');

  if (tempInput === '') {
    alert('Please enter a temperature value!');
    return;
  }

  let result;

  // Conversion logic
  if (fromUnit === toUnit) {
    result = parseFloat(tempInput);
  } else if (fromUnit === 'C' && toUnit === 'F') {
    result = (parseFloat(tempInput) * 9/5) + 32;
  } else if (fromUnit === 'F' && toUnit === 'C') {
    result = (parseFloat(tempInput) - 32) * 5/9;
  } else if (fromUnit === 'C' && toUnit === 'K') {
    result = parseFloat(tempInput) + 273.15;
  } else if (fromUnit === 'K' && toUnit === 'C') {
    result = parseFloat(tempInput) - 273.15;
  } else if (fromUnit === 'F' && toUnit === 'K') {
    result = ((parseFloat(tempInput) - 32) * 5/9) + 273.15;
  } else if (fromUnit === 'K' && toUnit === 'F') {
    result = ((parseFloat(tempInput) - 273.15) * 9/5) + 32;
  }

  result = result.toFixed(2);
  resultElement.innerHTML = `🌡️ ${tempInput}°${fromUnit} → ${result}°${toUnit}`;

  // Save history
  const dateTime = new Date().toLocaleString();
  const entry = `${dateTime} : ${tempInput}°${fromUnit} → ${result}°${toUnit}`;

  let history = JSON.parse(localStorage.getItem('tempHistory')) || [];
  history.push(entry);
  localStorage.setItem('tempHistory', JSON.stringify(history));

  // --- Automatic clearing of the input value ---
  // Clear the input field immediately
  tempInputEl.value = '';

  // Return focus to the input for quick next entry

  if (delayMs > 0) {
    setTimeout(() => {
      resultElement.innerHTML = ''; // result মুছে ফেলা হবে
    }, delayMs);
  }
}
function clearResult() {
  const resultElement = document.getElementById('result');
  resultElement.innerHTML = ''; // রেজাল্ট টেক্সট মুছে ফেলবে
}




 
/* 🔹 Load History on history.html */
function loadHistory() {
  const history = JSON.parse(localStorage.getItem('tempHistory')) || [];
  const historyList = document.getElementById('historyList');
  historyList.innerHTML = '';

  if (history.length === 0) {
    historyList.innerHTML = '<li>No history found.</li>';
    return;
  }

  // Beautifully aligned list
  history.forEach((item, index) => {
    const container = document.createElement('div');
    container.classList.add('history-entry');

    const serial = document.createElement('span');
    serial.classList.add('serial');
    serial.textContent = `${index + 1}.`;

    const content = document.createElement('span');
    content.classList.add('history-text');
    content.textContent = item;

    container.appendChild(serial);
    container.appendChild(content);
    historyList.appendChild(container);
  });
}

/* 🗑️ Clear History with Confirmation */
function clearHistory() {
  const confirmClear = confirm("⚠️ Are you sure you want to clear all history?");
  if (confirmClear) {
    localStorage.removeItem('tempHistory');
    loadHistory();
    alert("✅ History cleared successfully!");
  } else {
    alert("❌ Action cancelled.");
  }
}

/* ⬅️ Go Back to Home Page */
function goBack() {
  window.location.href = 'index.html';
}

/* 📄 Download Stylish PDF */
function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const history = JSON.parse(localStorage.getItem('tempHistory')) || [];
  if (history.length === 0) {
    alert("No history to download!");
    return;
  }

  // Dark stylish background
  doc.setFillColor(25, 25, 40);
  doc.rect(0, 0, 210, 297, 'F');

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("🌡️ Temperature Conversion History", 105, 20, { align: "center" });

  doc.setFontSize(12);
  let y = 35;

  // Each line left aligned and neatly numbered
  history.forEach((item, index) => {
    const parts = item.split(" : ");
    const datetime = parts[0];
    const result = parts[1];

    if (index % 2 === 0) {
      doc.setFillColor(40, 40, 60);
      doc.rect(10, y - 5, 190, 10, 'F');
    }

    doc.setTextColor(255, 255, 255);
    doc.text(`${index + 1}.`, 15, y);  // fixed left column for serials
    doc.text(`${datetime} → ${result}`, 30, y, { maxWidth: 160 }); // left aligned neatly
    y += 10;

    if (y > 280) {
      doc.addPage();
      doc.setFillColor(25, 25, 40);
      doc.rect(0, 0, 210, 297, 'F');
      y = 20;
    }
  });

  doc.save("Temperature_History.pdf");
}


window.onload = loadHistory;
