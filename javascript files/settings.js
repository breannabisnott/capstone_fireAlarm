let data = [];
    
async function update_alert_email(){
    const email = document.getElementById("alertEmail").value;
    if (!email) {
        alert("Please enter a valid email address.");
        return; 
    }

    try {
        const response = await fetch('https://api.fyahalarm.com/update-alertEmail', {
            method: 'PATCH', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ alert_email: email }),  
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update email.");
        }

        const data = await response.json();
        alert(data.message || "Email updated successfully!");
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || "Failed to update email.");
    }
}

async function update_fire_email(){
    const email = document.getElementById("fireEmail").value;
    if (!email) {
        alert("Please enter a valid email address.");
        return; 
    }

    try {
        const response = await fetch('https://api.fyahalarm.com/update-fireEmail', {
            method: 'PATCH', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fire_email: email }),  
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update email.");
        }

        const data = await response.json();
        alert(data.message || "Email updated successfully!");
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || "Failed to update email.");
    }
}

async function update_hospital_email(){
    const email = document.getElementById("hospitalEmail").value;
    if (!email) {
        alert("Please enter a valid email address.");
        return; 
    }

    try {
        const response = await fetch('https://api.fyahalarm.com/update-hospitalEmail', {
            method: 'PATCH', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ hospital_email: email }),  
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update email.");
        }

        const data = await response.json();
        alert(data.message || "Email updated successfully!");
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || "Failed to update email.");
    }
}

async function update_temp_threshold() {
    const temp = parseFloat(document.getElementById("tempThresh").value);

    if (isNaN(temp)) {
        alert("Please enter a valid number.");
        return;
    }

    try {
        const response = await fetch('https://api.fyahalarm.com/update-tempThresh', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ temp_thresh: temp }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update temperature threshold.");
        }

        const data = await response.json();
        alert(data.message || "Temperature threshold updated successfully!");
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || "Failed to update temperature threshold.");
    }
}

async function update_gas_threshold() {
    const gas = parseFloat(document.getElementById("gasThresh").value);

    if (isNaN(gas)) {
        alert("Please enter a valid number.");
        return;
    }

    try {
        const response = await fetch('https://api.fyahalarm.com/update-gasThresh', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ gas_thresh: gas }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update temperature threshold.");
        }

        const data = await response.json();
        alert(data.message || "Gas threshold updated successfully!");
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || "Failed to update gas threshold.");
    }
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