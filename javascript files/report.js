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

    // if (uploadedAudio) {
    //     pdfDoc.setFont("helvetica", "bold");
    //     pdfDoc.text("Audio File:", marginLeft, y);
    //     pdfDoc.setFont("helvetica", "normal");
    //     pdfDoc.text(uploadedAudio.name, marginLeft + 40, y); y += 10;
    // }

    // if (uploadedVideo) {
    //     pdfDoc.setFont("helvetica", "bold");
    //     pdfDoc.text("Video File:", marginLeft, y);
    //     pdfDoc.setFont("helvetica", "normal");
    //     pdfDoc.text(uploadedVideo.name, marginLeft + 40, y); y += 10;
    // }

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

async function sendEmail() {
    const { jsPDF } = window.jspdf;
    const pdfDoc = new jsPDF();

    let selectedEntry = document.querySelector('input[name="entry"]:checked');
    if (!selectedEntry) {
        alert("Please select an entry to generate a report.");
        return;
    }

    let row = selectedEntry.closest('tr');
    let cells = row.getElementsByTagName('td');

    const marginLeft = 20;
    let y = 20;

    // Logo
    pdfDoc.addImage('images/faviconRed.png', 'PNG', 90, y, 30, 30);
    y += 40;

    pdfDoc.setTextColor(178, 34, 34); // firebrick
    pdfDoc.setFontSize(22);
    pdfDoc.setFont("helvetica", "bold");
    pdfDoc.text("Fyah Alarm", 105, y, { align: "center" });

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

    // Box
    y += 10;
    const boxTop = y;
    const boxHeight = 110;
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

    // if (uploadedAudio) {
    //     pdfDoc.setFont("helvetica", "bold");
    //     pdfDoc.text("Audio File:", marginLeft, y);
    //     pdfDoc.setFont("helvetica", "normal");
    //     pdfDoc.text(uploadedAudio.name, marginLeft + 40, y);
    //     y += 10;
    // }

    // if (uploadedVideo) {
    //     pdfDoc.setFont("helvetica", "bold");
    //     pdfDoc.text("Video File:", marginLeft, y);
    //     pdfDoc.setFont("helvetica", "normal");
    //     pdfDoc.text(uploadedVideo.name, marginLeft + 40, y);
    //     y += 10;
    // }

    if (uploadedImage) {
        const reader = new FileReader();
        reader.onload = function(event) {
            y += 5;
            pdfDoc.setFont("helvetica", "bold");
            pdfDoc.text("Attached Image:", marginLeft, y);
            y += 5;
            pdfDoc.addImage(event.target.result, 'JPEG', marginLeft, y, 50, 50);
            sendPDFToBackend(pdfDoc);
        };
        reader.readAsDataURL(uploadedImage);
    } else {
        sendPDFToBackend(pdfDoc);
    }
}

async function sendPDFToBackend(pdfDoc) {
    const email = document.getElementById("email").value;
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Show loading indicator
    const submitBtn = document.getElementById("submitBtn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
        const pdfArrayBuffer = pdfDoc.output('arraybuffer'); // ✅ no await, no .then
        const formData = new FormData();
        formData.append('pdf', new Blob([pdfArrayBuffer], { type: 'application/pdf' }), 'incident_report.pdf');
        formData.append('email', email);
        
        // Add timeout to fetch
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

        const response = await fetch('https://api.fyahalarm.com/send-email', {
            method: 'POST',
            body: formData,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Server error: ${response.status}`);
        }

        const data = await response.json();
        alert("Email sent successfully!");
    } catch (error) {
        console.error('Error:', error);
        alert(error.name === 'AbortError' 
            ? "Request timed out. Please try again." 
            : error.message || "Failed to send email. Please check your connection.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Report";
    }
}

function downloadPDF() {
    if (!pdfDoc) {
        alert("Please generate the PDF first.");
        return;
    }
    pdfDoc.save("Fyah Alarm Incident Report.pdf");
}


function generateWebReport(imageFile = null, audioFile = null, videoFile = null, notes = '') {
    // DEBUG: Log all parameters received
    console.log('=== generateWebReport called ===');
    console.log('Parameters received:');
    console.log('imageFile:', imageFile ? `${imageFile.name} (${(imageFile.size/1024).toFixed(1)}KB)` : 'null');
    console.log('audioFile:', audioFile ? `${audioFile.name} (${(audioFile.size/1024).toFixed(1)}KB)` : 'null');
    console.log('videoFile:', videoFile ? `${videoFile.name} (${(videoFile.size/1024).toFixed(1)}KB)` : 'null');
    console.log('notes:', notes || 'empty');

    let selectedEntry = document.querySelector('input[name="entry"]:checked');
    if (!selectedEntry) {
        alert("Please select an entry to generate a report.");
        return;
    }

    let row = selectedEntry.closest('tr');
    let cells = row.getElementsByTagName('td');

    // DEBUG: Check global variables
    console.log('Checking global variables:');
    console.log('uploadedImage exists:', typeof uploadedImage !== 'undefined' ? 'YES' : 'NO');
    console.log('uploadedAudio exists:', typeof uploadedAudio !== 'undefined' ? 'YES' : 'NO');
    console.log('uploadedVideo exists:', typeof uploadedVideo !== 'undefined' ? 'YES' : 'NO');
    console.log('additionalText exists:', typeof additionalText !== 'undefined' ? 'YES' : 'NO');

    // If no parameters passed, try to get from global variables as fallback
    if (!imageFile && typeof uploadedImage !== 'undefined') {
        imageFile = uploadedImage;
        console.log('Using global uploadedImage:', imageFile ? imageFile.name : 'null');
    }
    if (!audioFile && typeof uploadedAudio !== 'undefined') {
        audioFile = uploadedAudio;
        console.log('Using global uploadedAudio:', audioFile ? audioFile.name : 'null');
    }
    if (!videoFile && typeof uploadedVideo !== 'undefined') {
        videoFile = uploadedVideo;  // Fixed: was videoFile = videoFile
        console.log('Using global uploadedVideo:', videoFile ? videoFile.name : 'null');
    }
    if (!notes && typeof additionalText !== 'undefined') {
        notes = additionalText;
        console.log('Using global additionalText:', notes);
    }

    // DEBUG: Final file status
    console.log('Final files to process:');
    console.log('imageFile:', imageFile ? `${imageFile.name} (${(imageFile.size/1024).toFixed(1)}KB)` : 'NONE');
    console.log('audioFile:', audioFile ? `${audioFile.name} (${(audioFile.size/1024).toFixed(1)}KB)` : 'NONE');
    console.log('videoFile:', videoFile ? `${videoFile.name} (${(videoFile.size/1024).toFixed(1)}KB)` : 'NONE');
    console.log('================================');

    // File size validation
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit
    
    if (audioFile && audioFile.size > MAX_FILE_SIZE) {
        alert(`Audio file is too large: ${(audioFile.size / 1024 / 1024).toFixed(1)}MB. Maximum size is 10MB.`);
        return;
    }
    
    if (videoFile && videoFile.size > MAX_FILE_SIZE) {
        alert(`Video file is too large: ${(videoFile.size / 1024 / 1024).toFixed(1)}MB. Maximum size is 10MB.`);
        return;
    }

    // Create a new window for the report
    const reportWindow = window.open('', '_blank', 'width=800,height=1000');
    
    // Show loading message
    reportWindow.document.write('<html><body><h2>Loading report...</h2><p>Processing media files, please wait...</p></body></html>');
    
    // Convert files to data URLs for embedding
    const promises = [];
    let imageDataURL = null;
    let audioDataURL = null;
    let videoDataURL = null;
    let audioFileName = '';
    let videoFileName = '';
    
    if (imageFile) {
        console.log('Processing image file:', imageFile.name, 'Size:', (imageFile.size / 1024).toFixed(1) + 'KB');
        promises.push(
            new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    imageDataURL = e.target.result;
                    console.log('Image converted successfully, data URL length:', imageDataURL.length);
                    resolve();
                };
                reader.onerror = (error) => {
                    console.error('Error reading image file:', error);
                    reject(error);
                };
                reader.readAsDataURL(imageFile);
            })
        );
    }
    
    if (audioFile) {
        audioFileName = audioFile.name;
        console.log('Processing audio file:', audioFile.name, 'Size:', (audioFile.size / 1024 / 1024).toFixed(1) + 'MB', 'Type:', audioFile.type);
        promises.push(
            new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    audioDataURL = e.target.result;
                    console.log('Audio converted successfully, data URL length:', audioDataURL.length);
                    resolve();
                };
                reader.onerror = (error) => {
                    console.error('Error reading audio file:', error);
                    reject(error);
                };
                reader.readAsDataURL(audioFile);
            })
        );
    }
    
    if (videoFile) {
        videoFileName = videoFile.name;
        console.log('Processing video file:', videoFile.name, 'Size:', (videoFile.size / 1024 / 1024).toFixed(1) + 'MB', 'Type:', videoFile.type);
        promises.push(
            new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    videoDataURL = e.target.result;
                    console.log('Video converted successfully, data URL length:', videoDataURL.length);
                    resolve();
                };
                reader.onerror = (error) => {
                    console.error('Error reading video file:', error);
                    reject(error);
                };
                reader.readAsDataURL(videoFile);
            })
        );
    }
    
    // If no files to process, create empty promise
    if (promises.length === 0) {
        promises.push(Promise.resolve());
    }
    
    // Wait for all file conversions to complete
    Promise.all(promises).then(() => {
        console.log('All files processed. Video data URL exists:', !!videoDataURL);
        console.log('Video data URL length:', videoDataURL ? videoDataURL.length : 0);
        
        // Generate HTML content with embedded media
        const reportHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Fyah Alarm Incident Report</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                        line-height: 1.6;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 2px solid #B22222;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .logo {
                        margin: 0 auto 20px;
                        text-align: center;
                    }
                    .title {
                        color: #B22222;
                        font-size: 28px;
                        font-weight: bold;
                        margin: 10px 0;
                    }
                    .subtitle {
                        font-size: 18px;
                        color: #666;
                    }
                    .data-section {
                        background-color: #f9f9f9;
                        padding: 20px;
                        border-radius: 8px;
                        margin: 20px 0;
                        border: 1px solid #ddd;
                    }
                    .data-row {
                        display: flex;
                        margin: 10px 0;
                        padding: 5px 0;
                        border-bottom: 1px solid #eee;
                    }
                    .data-label {
                        font-weight: bold;
                        width: 150px;
                        color: #333;
                    }
                    .data-value {
                        flex: 1;
                        color: #666;
                    }
                    .media-section {
                        margin: 30px 0;
                        padding: 20px;
                        background-color: #f5f5f5;
                        border-radius: 8px;
                    }
                    .media-item {
                        margin: 20px 0;
                        padding: 15px;
                        background-color: white;
                        border-radius: 5px;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    }
                    audio, video {
                        width: 100%;
                        max-width: 500px;
                        margin-top: 10px;
                    }
                    .image-container {
                        text-align: center;
                        margin: 20px 0;
                    }
                    .evidence-image {
                        max-width: 100%;
                        height: auto;
                        border: 2px solid #ddd;
                        border-radius: 8px;
                    }
                    .notes-section {
                        background-color: #fff3cd;
                        border: 1px solid #ffeaa7;
                        border-radius: 8px;
                        padding: 20px;
                        margin: 20px 0;
                    }
                    .print-btn, .download-btn {
                        background-color: #B22222;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        margin: 10px 5px;
                        font-size: 16px;
                    }
                    .print-btn:hover, .download-btn:hover {
                        background-color: #8B0000;
                    }
                    .media-error {
                        color: #B22222;
                        font-style: italic;
                        margin-top: 10px;
                        padding: 10px;
                        background-color: #fff5f5;
                        border-radius: 5px;
                    }
                    .debug-info {
                        background-color: #e8f4f8;
                        border: 1px solid #bee5eb;
                        border-radius: 5px;
                        padding: 10px;
                        margin: 10px 0;
                        font-size: 12px;
                        color: #0c5460;
                    }
                    @media print {
                        .print-btn, .download-btn, .debug-info { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo">
                        <img src="images/faviconRed.png" alt="Fyah Alarm Logo" style="width: 60px; height: 60px;" onerror="this.style.display='none'">
                    </div>
                    <div class="title">Fyah Alarm</div>
                    <div class="subtitle">Fire Detection and Alarm System</div>
                    <div style="margin-top: 10px; color: #666;">https://fyahalarm.com</div>
                    <h2 style="margin-top: 20px; color: #B22222;">Incident Report</h2>
                </div>

                <div class="data-section">
                    <h3 style="color: #B22222; margin-top: 0;">Sensor Data</h3>
                    <div class="data-row">
                        <div class="data-label">Device ID:</div>
                        <div class="data-value">${cells[1].innerText}</div>
                    </div>
                    <div class="data-row">
                        <div class="data-label">Timestamp:</div>
                        <div class="data-value">${cells[2].innerText}</div>
                    </div>
                    <div class="data-row">
                        <div class="data-label">Temperature:</div>
                        <div class="data-value">${cells[3].innerText}°C</div>
                    </div>
                    <div class="data-row">
                        <div class="data-label">Humidity:</div>
                        <div class="data-value">${cells[4].innerText}%</div>
                    </div>
                    <div class="data-row">
                        <div class="data-label">Flame Status:</div>
                        <div class="data-value">${cells[5].innerText}</div>
                    </div>
                    <div class="data-row">
                        <div class="data-label">Flame Level:</div>
                        <div class="data-value">${cells[6].innerText}</div>
                    </div>
                    <div class="data-row">
                        <div class="data-label">Gas Status:</div>
                        <div class="data-value">${cells[7].innerText}</div>
                    </div>
                    <div class="data-row">
                        <div class="data-label">Gas Concentration:</div>
                        <div class="data-value">${cells[8].innerText} ppm</div>
                    </div>
                    <div class="data-row">
                        <div class="data-label">Oxygen Concentration:</div>
                        <div class="data-value">${cells[9].innerText}%</div>
                    </div>
                </div>

                ${notes ? `
                    <div class="notes-section">
                        <h3 style="color: #B22222; margin-top: 0;">Additional Notes</h3>
                        <p>${notes.replace(/\n/g, '<br>')}</p>
                    </div>
                ` : ''}

                <div class="media-section">
                    <h3 style="color: #B22222; margin-top: 0;">Evidence</h3>
               
                    ${imageDataURL ? `
                        <div class="media-item">
                            <h4>📸 Image Evidence</h4>
                            <div class="image-container">
                                <img src="${imageDataURL}" alt="Evidence Image" class="evidence-image" id="evidence-image">
                            </div>
                            <div class="media-error" id="image-error" style="display: none;">
                                Failed to load image evidence
                            </div>
                        </div>
                    ` : ''}
                    
                    ${audioDataURL ? `
                        <div class="media-item">
                            <h4>🎵 Audio Evidence</h4>
            
                            <audio controls preload="metadata">
                                <source src="${audioDataURL}" type="${audioFile.type}">
                                Your browser does not support audio playback.
                            </audio>
                            <div class="media-error" id="audio-error" style="display: none;">
                                Unable to load audio file. Check console for details.
                            </div>
                        </div>
                    ` : ''}
                    
                    ${videoDataURL ? `
                        <div class="media-item">
                            <h4>🎥 Video Evidence</h4>
                            
                            <!-- Browser Compatibility Notice -->
                            ${videoFile.type === 'video/quicktime' || videoFileName.toLowerCase().endsWith('.mov') ? `
                            ` : ''}
                            
                            <video controls preload="metadata" style="max-height: 400px;" id="evidence-video">
                                <source src="${videoDataURL}" type="${videoFile.type}">
                                <!-- Try generic video type as fallback -->
                                <source src="${videoDataURL}" type="video/mp4">
                                <source src="${videoDataURL}" type="video/webm">
                                Your browser does not support video playback for this format (${videoFile.type}).
                            </video>
                            
                            <div class="media-error" id="video-error" style="display: none;">
                                <strong>Video Playback Error:</strong>
                                <div id="video-error-details"></div>
                                <br>
                                <strong>Troubleshooting:</strong>
                                <ul style="margin: 5px 0; padding-left: 20px; text-align: left;">
                                    <li>Try a different browser (Chrome, Firefox, Safari)</li>
                                    <li>Check if your browser supports ${videoFile.type}</li>
                                    <li>Convert video to MP4 format</li>
                                    <li>File may be corrupted</li>
                                </ul>
                            </div>
                            
                            <!-- Download option for unsupported videos -->
                            <div style="margin-top: 10px;">
                                <button onclick="downloadVideoFile()" style="background-color: #28a745; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">
                                    📥 Download Original Video
                                </button>
                            </div>
                        </div>
                    ` : videoFile ? `
                        <div class="media-item">
                            <h4>🎥 Video Evidence</h4>
                            <div class="media-error">
                                Video file failed to process: ${videoFileName} (${(videoFile.size / 1024 / 1024).toFixed(2)}MB, ${videoFile.type})
                            </div>
                        </div>
                    ` : ''}
                    
                    ${!imageDataURL && !audioDataURL && !videoDataURL && !imageFile && !audioFile && !videoFile ? `
                        <p style="text-align: center; color: #666; font-style: italic;">No media evidence attached to this incident.</p>
                    ` : ''}
                </div>

                <div style="text-align: center; margin: 30px 0;">
                    <button class="print-btn" onclick="window.print()">🖨️ Print Report</button>
                    <button class="download-btn" onclick="downloadReport()">💾 Save as HTML</button>
                </div>

                <script>
                    function downloadReport() {
                        const html = document.documentElement.outerHTML;
                        const blob = new Blob([html], { type: 'text/html' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'Fyah_Alarm_Incident_Report_${new Date().toISOString().split('T')[0]}.html';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    }
                    
                    function downloadVideoFile() {
                        try {
                            const video = document.getElementById('evidence-video');
                            const source = video.querySelector('source');
                            if (source && source.src) {
                                const a = document.createElement('a');
                                a.href = source.src;
                                a.download = '${videoFileName}';
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                            }
                        } catch (error) {
                            console.error('Error downloading video:', error);
                            alert('Unable to download video file.');
                        }
                    }

                    // And update your DOMContentLoaded script section to include this:
                    document.addEventListener('DOMContentLoaded', function() {
                        console.log('Report DOM loaded');
                        
                        // Handle image loading
                        const evidenceImage = document.getElementById('evidence-image');
                        if (evidenceImage) {
                            console.log('Image element found');
                            
                            evidenceImage.addEventListener('load', function() {
                                console.log('Image loaded successfully');
                                console.log('Image dimensions:', this.naturalWidth, 'x', this.naturalHeight);
                            });
                            
                            evidenceImage.addEventListener('error', function(e) {
                                console.error('Image failed to load:', e);
                                document.getElementById('image-error').style.display = 'block';
                                this.style.display = 'none';
                            });
                            
                            // Check if image is already loaded (in case event fired before listener was attached)
                            if (evidenceImage.complete) {
                                if (evidenceImage.naturalWidth === 0) {
                                    // Image failed to load
                                    document.getElementById('image-error').style.display = 'block';
                                    evidenceImage.style.display = 'none';
                                } else {
                                    console.log('Image was already loaded');
                                }
                            }
                        }
                        
                        const audio = document.querySelector('audio');
                        const video = document.querySelector('video');
                        
                        if (audio) {
                            const source = audio.querySelector('source');
                            console.log('Audio element found');
                            console.log('Audio source:', source ? 'Present' : 'Missing');
                            console.log('Audio src length:', source?.src?.length || 0);
                            console.log('Audio type:', source?.type || 'Not specified');
                            
                            audio.addEventListener('loadstart', () => console.log('Audio: Load started'));
                            audio.addEventListener('canplay', () => console.log('Audio: Can play'));
                            audio.addEventListener('error', function(e) {
                                console.error('Audio error:', e.target.error);
                                document.getElementById('audio-error').style.display = 'block';
                            });
                        }
                        
                        if (video) {
                            const source = video.querySelector('source');
                            console.log('Video element found');
                            console.log('Video source:', source ? 'Present' : 'Missing');
                            console.log('Video src length:', source?.src?.length || 0);
                            console.log('Video type:', source?.type || 'Not specified');
                            
                            video.addEventListener('loadstart', () => console.log('Video: Load started'));
                            video.addEventListener('canplay', () => console.log('Video: Can play'));
                            video.addEventListener('canplaythrough', () => console.log('Video: Can play through'));
                            video.addEventListener('loadedmetadata', () => {
                                console.log('Video metadata loaded - Duration:', video.duration, 'seconds');
                            });
                            video.addEventListener('error', function(e) {
                                const error = e.target.error;
                                let errorMessage = 'Unknown error';
                                
                                if (error) {
                                    switch(error.code) {
                                        case error.MEDIA_ERR_ABORTED:
                                            errorMessage = 'Video loading was aborted';
                                            break;
                                        case error.MEDIA_ERR_NETWORK:
                                            errorMessage = 'Network error occurred';
                                            break;
                                        case error.MEDIA_ERR_DECODE:
                                            errorMessage = 'Video format not supported or corrupted';
                                            break;
                                        case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                                            errorMessage = 'Video format not supported by browser';
                                            break;
                                    }
                                }
                                
                                console.error('Video error:', errorMessage);
                                console.error('Video error code:', error?.code || 'No code');
                                console.error('Video error message:', error?.message || 'No message');
                                
                                const errorDiv = document.getElementById('video-error');
                                const errorDetails = document.getElementById('video-error-details');
                                if (errorDiv && errorDetails) {
                                    errorDetails.innerHTML = errorMessage + ' (Error code: ' + (error?.code || 'unknown') + ')';
                                    errorDiv.style.display = 'block';
                                }
                            });
                            
                            // Test video format support
                            const formatSupport = {
                                'video/mp4': video.canPlayType('video/mp4'),
                                'video/quicktime': video.canPlayType('video/quicktime'),
                                'video/webm': video.canPlayType('video/webm'),
                                'video/ogg': video.canPlayType('video/ogg')
                            };
                            console.log('Browser video format support:', formatSupport);
                        }
                    });
                </script>
            </body>
            </html>
        `;

        // Write the HTML to the new window
        try {
            reportWindow.document.open();
            reportWindow.document.write(reportHTML);
            reportWindow.document.close();
        } catch (error) {
            console.error('Error writing to report window:', error);
            alert('Error generating report. Please try again.');
        }
    }).catch(error => {
        console.error('Error processing files:', error);
        alert('Error processing media files: ' + error.message);
        reportWindow.close();
    });
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
