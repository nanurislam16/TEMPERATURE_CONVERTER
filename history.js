// ✅ Load History from localStorage
function loadHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';

    let history = JSON.parse(localStorage.getItem('tempHistory')) || [];

    history.forEach((item, index) => {
        const parts = item.split(" : ");
        const date = parts[0];
        const result = parts[1];

        const li = document.createElement('li');
        li.style.display = "grid";
        li.style.gridTemplateColumns = "50px 1fr 1fr"; // SL | Date | Result
        li.style.alignItems = "start";
        li.style.gap = "10px";
        li.style.background = "rgba(0,0,30,0.5)";
        li.style.padding = "12px 20px";
        li.style.borderRadius = "10px";
        li.style.marginBottom = "10px";

        li.innerHTML = `
            <span>${index + 1}</span>
            <span>${date}</span>
            <span>${result}</span>
        `;

        historyList.appendChild(li);
    });
}

// ✅ Back button
function goBack() {
    window.location.href = 'index.html';
}

// ✅ Clear History with confirmation modal
function clearHistory() {
    const confirmBox = document.getElementById('confirmBox');
    confirmBox.classList.add('show');

    document.getElementById('confirmYes').onclick = () => {
        localStorage.removeItem('tempHistory');
        loadHistory();
        confirmBox.classList.remove('show');
        showToast("✅ History cleared successfully!");
    };

    document.getElementById('confirmNo').onclick = () => {
        confirmBox.classList.remove('show');
    };
}

// ✅ Download History as PDF
function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const history = JSON.parse(localStorage.getItem('tempHistory')) || [];
  if(history.length === 0) {
    alert("No history to download!");
    return;
  }

  // Page background: very dark gray
  doc.setFillColor(30, 30, 40);
  doc.rect(0, 0, 210, 297, 'F');

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("Temperature Conversion History", 105, 20, { align: "center" });

  doc.setFontSize(12);
  let y = 30;

  // Table header with navy background
  doc.setFillColor(0, 51, 102); // darker navy
  doc.rect(10, y, 190, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont(undefined, "bold");
  doc.text("SL No", 15, y + 7);
  doc.text("Date/Time", 35, y + 7);
  doc.text("Result", 125, y + 7);
  doc.setFont(undefined, "normal");

  y += 18; // spacing before first entry

  // Entries
  history.forEach((item, index) => {
    const parts = item.split(" : ");
    const datetime = parts[0];
    const result = (parts[1] || "").replace(/→/g, "->");

    // Alternate row background: dark gray
    if (index % 2 === 0) {
      doc.setFillColor(50, 50, 70);
      doc.rect(10, y - 5, 190, 10, 'F');
    }

    doc.setTextColor(255, 255, 255);
    doc.text(`${index + 1}`, 15, y);
    doc.text(datetime, 35, y);
    doc.text(result, 125, y);

    y += 10;

    if(y > 280) {
      doc.addPage();
      doc.setFillColor(30, 30, 40);
      doc.rect(0, 0, 210, 297, 'F');
      y = 20;
    }
  });

  doc.save("Temperature_History.pdf");
}

// ✅ Toast Messages (stylish)
function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = msg;

    document.getElementById('toastContainer').appendChild(toast);

    // show animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 50);

    // hide after 2.5s
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 2500);
}

// ✅ Initialize page
window.onload = loadHistory;
