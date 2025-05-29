let data = [];
let currentPage = 1;
let recordsPerPage = 5;
let pdfDoc;
let uploadedImage = null;
let uploadedAudio = null;
let uploadedVideo = null;
let additionalText = "";


async function fetchData() {
    const deviceId = document.getElementById('deviceId').value || 'AC:15:18:D7:B0:80';
    try {
        const response = await fetch(`https://api.fyahalarm.com/data/${deviceId}?page_size=150&page_number=0`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        data = await response.json();
        displayPage(1);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayPage(page) {
    const tbody = document.getElementById('myTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    
    let start = (page - 1) * recordsPerPage;
    let end = start + recordsPerPage;
    let paginatedItems = data.slice(start, end);
    
    paginatedItems.forEach(record => {
        const row = tbody.insertRow();
        const date = new Date(record.time_stamp);
        date.setHours(date.getHours() - 5); // Jamaica is UTC-5
        const formattedTime = date.toLocaleString();
        const convertedFlameLevel = record.flame_level / 4095;  
        row.innerHTML = `
            <td><input type="radio" name="entry" value="${record.device_id}"></td>
            <td>${record.device_id}</td>
            <td>${formattedTime}</td>
            <td>${record.temperature.toFixed(2)}</td>
            <td>${record.humidity.toFixed(2)}</td>
            <td>${record.flame ? '&check;' : '&times;'}</td>
            <td>${convertedFlameLevel.toFixed(2)}</td>
            <td>${record.gas ? '&check;' : '&times;'}</td>
            <td>${record.gas_concentration.toFixed(2)}</td>
            <td>${record.oxygen_concentration.toFixed(2)}</td>
        `;
    });
    updatePagination();
}

function updatePagination() {
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = '';
    let pageCount = Math.ceil(data.length / recordsPerPage);
    
    for (let i = 1; i <= pageCount; i++) {
        let btn = document.createElement('button');
        btn.innerText = i;
        btn.onclick = function() { displayPage(i); };
        paginationDiv.appendChild(btn);
    }
}

function filterTable() {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    data = data.filter(record => {
        const timestamp = new Date(record.time_stamp);
        return (!isNaN(startDate) && !isNaN(endDate)) ? (timestamp >= startDate && timestamp <= endDate) : true;
    });
    displayPage(1);
}

function changePageSize() {
    recordsPerPage = parseInt(document.getElementById('recordsPerPage').value);
    displayPage(1);
}

function handleFileUpload(event, type) {
    const file = event.target.files[0];
    if (type === 'image') {
        uploadedImage = file;
    } else if (type === 'video') {
        uploadedVideo = file;
    } else if (type === 'audio') {
        uploadedAudio = file;
    }
}

function updateAdditionalText(event) {
    additionalText = event.target.value;
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    pdfDoc = new jsPDF();

    let selectedEntry = document.querySelector('input[name="entry"]:checked');
    if (!selectedEntry) {
        alert("Please select an entry to generate a report.");
        return;
    }

    let row = selectedEntry.closest('tr');
    let cells = row.getElementsByTagName('td');

    const marginLeft = 20;
    let y = 20;

    // logo
    pdfDoc.addImage('images/faviconRed.png', 'PNG', 90, y, 30, 30);
    y += 40; // ⬅️ Increased spacing between logo and title

    pdfDoc.setTextColor(178, 34, 34); // firebrick
    pdfDoc.setFontSize(22);
    pdfDoc.setFont("helvetica", "bold");
    pdfDoc.text("Fyah Alarm", 105, y, { align: "center" });

    // Subtitle & Report title
    y += 10;
    pdfDoc.setTextColor(0, 0, 0);
    pdfDoc.setFontSize(16);
    pdfDoc.text("Fire Detection and Alarm System", 105, y, { align: "center" });

    y += 8;
    pdfDoc.setFontSize(12);
    pdfDoc.text("https://fyahalarm.com", 105, y, { align: "center" });

    y += 10;
    pdfDoc.setFontSize(14);
    pdfDoc.setFont("helvetica", "bold");
    pdfDoc.text("Incident Report", 105, y, { align: "center" });

    //box
    y += 10;
    const boxTop = y;
    const boxHeight = 100;
    pdfDoc.setDrawColor(0);
    pdfDoc.setLineWidth(0.5);
    pdfDoc.rect(marginLeft - 5, boxTop, 170, boxHeight);

    y += 10;
    pdfDoc.setFont("helvetica", "normal");
    pdfDoc.setFontSize(12);

    pdfDoc.text("Device ID:", marginLeft, y);
    pdfDoc.text(cells[1].innerText, marginLeft + 50, y); y += 10;

    pdfDoc.text("Timestamp:", marginLeft, y);
    pdfDoc.text(cells[2].innerText, marginLeft + 50, y); y += 10;

    pdfDoc.text("Temperature:", marginLeft, y);
    pdfDoc.text(cells[3].innerText, marginLeft + 50, y); y += 10;

    pdfDoc.text("Humidity:", marginLeft, y);
    pdfDoc.text(cells[4].innerText, marginLeft + 50, y); y += 10;

    pdfDoc.text("Flame Status:", marginLeft, y);
    pdfDoc.text(cells[5].innerText, marginLeft + 50, y); y += 10;

    pdfDoc.text("Flame Level:", marginLeft, y);
    pdfDoc.text(cells[6].innerText, marginLeft + 50, y); y += 10;

    pdfDoc.text("Gas Status:", marginLeft, y);
    pdfDoc.text(cells[7].innerText, marginLeft + 50, y); y += 10;

    pdfDoc.text("Gas Concentration:", marginLeft, y);
    pdfDoc.text(cells[8].innerText, marginLeft + 50, y); y += 10;

    pdfDoc.text("Oxygen Concentration:", marginLeft, y);
    pdfDoc.text(cells[9].innerText, marginLeft + 50, y); y += 10;

    if (additionalText) {
        y += 5;
        pdfDoc.setFont("helvetica", "bold");
        pdfDoc.text("Additional Notes:", marginLeft, y);
        y += 7;
        pdfDoc.setFont("helvetica", "normal");
        const lines = pdfDoc.splitTextToSize(additionalText, 170);
        pdfDoc.text(lines, marginLeft, y);
        y += lines.length * 7 + 5;
    }

    if (uploadedAudio) {
        pdfDoc.setFont("helvetica", "bold");
        pdfDoc.text("Audio File:", marginLeft, y);
        pdfDoc.setFont("helvetica", "normal");
        pdfDoc.text(uploadedAudio.name, marginLeft + 40, y); y += 10;
    }

    if (uploadedVideo) {
        pdfDoc.setFont("helvetica", "bold");
        pdfDoc.text("Video File:", marginLeft, y);
        pdfDoc.setFont("helvetica", "normal");
        pdfDoc.text(uploadedVideo.name, marginLeft + 40, y); y += 10;
    }

    if (uploadedImage) {
        const reader = new FileReader();
        reader.onload = function(event) {
            y += 5;
            pdfDoc.setFont("helvetica", "bold");
            pdfDoc.text("Attached Image:", marginLeft, y);
            y += 5;
            pdfDoc.addImage(event.target.result, 'JPEG', marginLeft, y, 50, 50);
            document.getElementById("downloadBtn").style.display = "inline";
        };
        reader.readAsDataURL(uploadedImage);
    } else {
        document.getElementById("downloadBtn").style.display = "inline";
    }
}

// Send PDF via Email
async function sendEmail() {
    const { jsPDF } = window.jspdf;

    // Generate the PDF
    const pdfDoc = new jsPDF();

    let selectedEntry = document.querySelector('input[name="entry"]:checked');
    if (!selectedEntry) {
        alert("Please select an entry to generate a report.");
        return;
    }

    let row = selectedEntry.closest('tr');
    let cells = row.getElementsByTagName('td');

    pdfDoc.text("Incident Report", 10, 10);
    pdfDoc.text(`Device ID: ${cells[1].innerText}`, 10, 20);
    pdfDoc.text(`Timestamp: ${cells[2].innerText}`, 10, 30);
    pdfDoc.text(`Temperature: ${cells[3].innerText}`, 10, 40);
    pdfDoc.text(`Flame Status: ${cells[4].innerText}`, 10, 50);
    pdfDoc.text(`Flame Level: ${cells[5].innerText}`, 10, 60);
    pdfDoc.text(`Gas Status: ${cells[6].innerText}`, 10, 70);
    pdfDoc.text(`Gas Concentration: ${cells[7].innerText}`, 10, 80);
    pdfDoc.text(`O2 Concentration: ${cells[8].innerText}`, 10, 90);

    if (additionalText) {
        pdfDoc.text("Additional Notes:", 10, 110);
        pdfDoc.text(additionalText, 10, 120);
    }

    let yOffset = 140;

    if (uploadedAudio) {
        pdfDoc.text(`Audio File: ${uploadedAudio.name}`, 10, yOffset);
        yOffset += 10;
    }

    if (uploadedVideo) {
        pdfDoc.text(`Video File: ${uploadedVideo.name}`, 10, yOffset);
        yOffset += 10;
    }

    if (uploadedImage) {
        const reader = new FileReader();
        reader.onload = function(event) {
            pdfDoc.addImage(event.target.result, 'JPEG', 10, yOffset, 50, 50);
            sendPDFToBackend(pdfDoc);
        };
        reader.readAsDataURL(uploadedImage);
    } else {
        sendPDFToBackend(pdfDoc);
    }
}

// Send the PDF to the backend
async function sendPDFToBackend(pdfDoc) {
    const email = document.getElementById("email").value;
    if (!email) {
        alert("Please enter a valid email address.");
        return; 
    }

    const pdfBlob = pdfDoc.output('blob');
    const formData = new FormData();
    formData.append('pdf', pdfBlob, 'incident_report.pdf');
    formData.append('email', email);

    try {
        const response = await fetch('https://api.fyahalarm.com/send-email', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to send email.");
        }

        const data = await response.json();
        alert(data.message);
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || "Failed to send email.");
    }
}

function downloadPDF() {
    if (!pdfDoc) {
        alert("Please generate the PDF first.");
        return;
    }
    pdfDoc.save("Fyah Alarm Incident Report.pdf");
}

document.getElementById('nav-toggle').addEventListener('change', function() {
    var pageContent = document.getElementById('pageContainer1');
    // var map = document.getElementsByTagName('gmp-map');
    console.log(pageContent);
    if (this.checked) {
        pageContent.style.paddingLeft = '0vw'; // Adjust as needed
        // map.style.paddingLeft = '100px';
        console.log("Nm");
    } else {
        pageContent.style.paddingLeft = '13vw'; // Adjust as needed
        // map.style.paddingLeft = '290px'; // Adjust as needed
    }
});

window.onload = fetchData;
