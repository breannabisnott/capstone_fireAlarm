// Function to load data from FastAPI
async function loadData(pageNumber = 1) {
    const deviceId = document.getElementById("device_id").value;
    const pageSize = 5; // Adjust as needed
    const url = `/data/${deviceId}?page_size=${pageSize}&page_number=${pageNumber}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Clear existing rows in the table
        const tableBody = document.querySelector("#data-table tbody");
        tableBody.innerHTML = "";

        // Insert data into the table
        data.forEach((item) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.device_id}</td>
                <td>${item.time_stamp}</td>
                <td>${item.temperature}</td>
                <td>${item.flame}</td>
                <td>${item.flame_level}</td>
                <td>${item.gas}</td>
                <td>${item.gas_concentration}</td>
                <td>${item.oxygen_concentration}</td>
            `;

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Load data on page load
window.onload = () => {
    loadData(); // Load first page of data by default
};