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
        const response = await fetch(`https://api.fyahalarm.com/data/${deviceId}?page_size=100&page_number=0`);
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
        row.innerHTML = `
            <td><input type="radio" name="entry" value="${record.device_id}"></td>
            <td>${record.device_id}</td>
            <td>${record.time_stamp}</td>
            <td>${record.temperature}</td>
            <td>${record.flame}</td>
            <td>${record.flame_level}</td>
            <td>${record.gas}</td>
            <td>${record.gas_concentration}</td>
            <td>${record.oxygen_concentration}</td>
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

// Generate PDF
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
    pdfDoc.save("incident_report.pdf");
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
