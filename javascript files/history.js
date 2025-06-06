let data = [];
        window.onloadge = 1;
        let recordsPerPage = 5;

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

        function downloadCSV() {
            const csvHeaders = [
                "Device ID", "Time Stamp", "Temperature", "Humidity",
                "Flame Status", "Flame Level", "Gas Status", "Gas Concentration", "O2 Concentration"
            ];
        
            // Convert records to CSV rows
            const csvRows = [
                csvHeaders.join(",")
            ];
        
            data.forEach(record => {
                const row = [
                    record.device_id,
                    record.time_stamp,
                    record.temperature,
                    record.humidity,
                    record.flame,
                    record.flame_level,
                    record.gas,
                    record.gas_concentration,
                    record.oxygen_concentration
                ];
                csvRows.push(row.join(","));
            });
        
            // Create blob and download
            const csvContent = csvRows.join("\n");
            const blob = new Blob([csvContent], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement("a");
            a.href = url;
            a.download = `Fyah Alarm History_${new Date().toISOString()}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
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