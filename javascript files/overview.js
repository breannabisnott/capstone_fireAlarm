
console.log("hi");


// function displayLatestReading(latestRecord) {
//   const container = document.getElementById("myDevices");
  
//   // Create the box element
//   const readingBox = document.createElement("div");
//   readingBox.classList.add("latestReadingBox");

//   // Create caption box
//   const captionBox = document.createElement("div");
//   captionBox.classList.add("latestReadingCaption");

//   // Name container
//   const nameContainer = document.createElement("div");
//   nameContainer.classList.add("latestReadingName");
//   const title = document.createElement("span");
//   title.classList.add("latestReadingTitle");
//   title.textContent = "AC:15:18:D7:B0:80";
//   nameContainer.appendChild(title);

//   // Text container
//   const textContainer = document.createElement("div");
//   textContainer.classList.add("latestReadingTextContainer");

//   // Format the timestamp
//   const date = new Date(latestRecord.time_stamp);
//   date.setHours(date.getHours() - 5); // Jamaica is UTC-5
//   const formattedTime = date.toLocaleString();

//   textContainer.innerHTML = `
//       <p class="latestReadingText">Time: ${formattedTime}</p>
//       <p class="latestReadingText">Temp: ${latestRecord.temperature}°C</p>
//       <p class="latestReadingText">Humidity: ${latestRecord.humidity}%</p>
//       <p class="latestReadingText">Flame: ${latestRecord.flame ? "Detected" : "Not Detected"}</p>
//       <p class="latestReadingText">Gas: ${latestRecord.gas ? "Detected" : "Not Detected"}</p>
//       <p class="latestReadingText">O₂: ${latestRecord.oxygen_concentration}%</p>
//   `;

//   // Image container
//   const imgContainer = document.createElement("div");
//   imgContainer.classList.add("latestReadingImg");
//   const img = document.createElement("img");
//   img.src = "images/faviconRed.png";
//   img.alt = "Device Image";
//   img.classList.add("productImg");
//   imgContainer.appendChild(img);

//   // Append elements
//   captionBox.appendChild(nameContainer);
//   captionBox.appendChild(textContainer);
//   readingBox.appendChild(captionBox);
//   readingBox.appendChild(imgContainer);
  
//   // Insert at the beginning of the myDevices container
//   container.insertBefore(readingBox, container.firstChild);
// }

function displayLatestReading(latestRecord) {
  const container = document.getElementById("myDevices");
  const deviceId = 'AC:15:18:D7:B0:80'; // Or get this dynamically
  
  // Check if a reading box for this specific device already exists and remove it
  const existingBoxes = container.querySelectorAll('.latestReadingBox');
  existingBoxes.forEach(box => {
    const titleElement = box.querySelector('.latestReadingTitle');
    if (titleElement && titleElement.textContent === deviceId) {
      box.remove();
    }
  });
  
  // Create the box element
  const readingBox = document.createElement("div");
  readingBox.classList.add("latestReadingBox");
  readingBox.setAttribute('data-device-id', deviceId); // Add device ID as data attribute

  // Rest of your existing code remains the same...
  const captionBox = document.createElement("div");
  captionBox.classList.add("latestReadingCaption");

  const nameContainer = document.createElement("div");
  nameContainer.classList.add("latestReadingName");
  const title = document.createElement("span");
  title.classList.add("latestReadingTitle");
  title.textContent = deviceId;
  nameContainer.appendChild(title);

  const textContainer = document.createElement("div");
  textContainer.classList.add("latestReadingTextContainer");

  const date = new Date(latestRecord.time_stamp);
  date.setHours(date.getHours() - 5);
  const formattedTime = date.toLocaleString();

  textContainer.innerHTML = `
      <p class="latestReadingText">Time: ${formattedTime}</p>
      <p class="latestReadingText">Temp: ${latestRecord.temperature}°C</p>
      <p class="latestReadingText">Humidity: ${latestRecord.humidity}%</p>
      <p class="latestReadingText">Flame: ${latestRecord.flame ? "Detected" : "Not Detected"}</p>
      <p class="latestReadingText">Gas: ${latestRecord.gas ? "Detected" : "Not Detected"}</p>
      <p class="latestReadingText">O₂: ${latestRecord.oxygen_concentration}%</p>
  `;

  const imgContainer = document.createElement("div");
  imgContainer.classList.add("latestReadingImg");
  const img = document.createElement("img");
  img.src = "images/faviconRed.png";
  img.alt = "Device Image";
  img.classList.add("productImg");
  imgContainer.appendChild(img);

  captionBox.appendChild(nameContainer);
  captionBox.appendChild(textContainer);
  readingBox.appendChild(captionBox);
  readingBox.appendChild(imgContainer);
  
  container.insertBefore(readingBox, container.firstChild);
}

// Modify your existing fetch function or add this:
async function fetchLatestReading() {
  const deviceId = 'AC:15:18:D7:B0:80'; // Or get this dynamically if you have multiple devices
  try {
      const response = await fetch(`https://api.fyahalarm.com/data/${deviceId}?page_size=1&page_number=0`);
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      
      if (data.length > 0) {
          displayLatestReading(data[0]);
      }
  } catch (error) {
      console.error('Error fetching latest reading:', error);
  }
}

// Call this when the page loads
window.onload = function() {
  fetchLatestReading();
  // Your other onload functions...
};


document.addEventListener('DOMContentLoaded', function() {
  const deviceId = 'AC:15:18:D7:B0:80'; // Replace with your actual device ID
  let mapElement = document.querySelector("gmp-map");
  let markerElement = document.querySelector("gmp-advanced-marker");
  console.log("hi1");

  async function fetchLatestLocation() {
      try {
          console.log(deviceId);
          const response = await fetch(`https://api.fyahalarm.com/latestLocation/${deviceId}`);
          const data = await response.json();

          if (Array.isArray(data) && data.length > 0) {
            const latitude = parseFloat(data[0].lat);  // Access first object in array
            const longitude = parseFloat(data[0].lng);

            console.log("Parsed Latitude:", latitude, "Parsed Longitude:", longitude); // Debugging

            document.querySelector("gmp-map").setAttribute("center", `${latitude},${longitude}`);
            document.querySelector("gmp-advanced-marker").setAttribute("position", `${latitude},${longitude}`);
        } else {
            console.error("Invalid latitude or longitude from API:", data);
        }
      } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
      }
  }

  //  function updateMapAndMarker(lat, lng) {
  //      mapElement.setAttribute('center', `${lat},${lng}`);
  //      markerElement.setAttribute('position', `${lat},${lng}`);
  //  }

  fetchLatestLocation();
});

let sensorData = [];
let charts = {};
let currentTimeRange = 20;

// Safe color function for flame chart
function getFlameColor(value) {
  if (typeof value !== 'number' || isNaN(value)) return 'rgba(40, 167, 69, 0.8)';
  if (value > 0.7) return 'rgba(220, 53, 69, 0.8)'; // High - Red
  if (value > 0.4) return 'rgba(255, 193, 7, 0.8)'; // Medium - Yellow
  return 'rgba(40, 167, 69, 0.8)'; // Low - Green
}

function getFlameBorderColor(value) {
  if (typeof value !== 'number' || isNaN(value)) return '#28a745';
  if (value > 0.7) return '#dc3545';
  if (value > 0.4) return '#ffc107';
  return '#28a745';
}

// Initialize all charts when page loads
function initializeCharts() {
  console.log("Initializing charts...");
  
  // Temperature & Humidity Chart
  const tempHumidityCtx = document.getElementById('tempHumidityChart').getContext('2d');
  charts.tempHumidity = new Chart(tempHumidityCtx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Temperature (°C)',
        data: [],
        borderColor: '#e55604',
        backgroundColor: 'rgba(229, 86, 4, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        yAxisID: 'y'
      }, {
        label: 'Humidity (%)',
        data: [],
        borderColor: '#26577C',
        backgroundColor: 'rgba(38, 87, 124, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        yAxisID: 'y1'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            font: { family: 'Poppins-Regular' }
          }
        }
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: { 
            display: true, 
            text: 'Temperature (°C)',
            font: { family: 'Poppins-Regular' }
          },
          ticks: {
            font: { family: 'Poppins-Regular' }
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: { 
            display: true, 
            text: 'Humidity (%)',
            font: { family: 'Poppins-Regular' }
          },
          grid: { drawOnChartArea: false },
          ticks: {
            font: { family: 'Poppins-Regular' }
          }
        },
        x: {
          ticks: {
            font: { family: 'Poppins-Regular' }
          }
        }
      }
    }
  });

  // Gas & Oxygen Chart
  const gasOxygenCtx = document.getElementById('gasOxygenChart').getContext('2d');
  charts.gasOxygen = new Chart(gasOxygenCtx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Gas Concentration',
        data: [],
        borderColor: '#6d1111',
        backgroundColor: 'rgba(109, 17, 17, 0.1)',
        borderWidth: 2,
        tension: 0.4
      }, {
        label: 'O2 Concentration (%)',
        data: [],
        borderColor: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        borderWidth: 2,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            font: { family: 'Poppins-Regular' }
          }
        }
      },
      scales: {
        y: {
          title: { 
            display: true, 
            text: 'Concentration',
            font: { family: 'Poppins-Regular' }
          },
          ticks: {
            font: { family: 'Poppins-Regular' }
          }
        },
        x: {
          ticks: {
            font: { family: 'Poppins-Regular' }
          }
        }
      }
    }
  });

  // Flame Detection Chart - Fixed with safer color functions
  const flameCtx = document.getElementById('flameChart').getContext('2d');
  charts.flame = new Chart(flameCtx, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: 'Flame Level',
        data: [],
        backgroundColor: 'rgba(40, 167, 69, 0.8)', // Default color
        borderColor: '#28a745', // Default border
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            font: { family: 'Poppins-Regular' }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 1,
          title: { 
            display: true, 
            text: 'Flame Level (0-1)',
            font: { family: 'Poppins-Regular' }
          },
          ticks: {
            font: { family: 'Poppins-Regular' }
          }
        },
        x: {
          ticks: {
            font: { family: 'Poppins-Regular' }
          }
        }
      }
    }
  });

  // System Overview Chart
  const overviewCtx = document.getElementById('overviewChart').getContext('2d');
  charts.overview = new Chart(overviewCtx, {
    type: 'doughnut',
    data: {
      labels: ['Normal', 'Warning', 'Critical'],
      datasets: [{
        data: [85, 10, 5],
        backgroundColor: [
          'rgba(40, 167, 69, 0.8)',
          'rgba(255, 193, 7, 0.8)',
          'rgba(220, 53, 69, 0.8)'
        ],
        borderColor: [
          '#28a745',
          '#ffc107',
          '#dc3545'
        ],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { family: 'Poppins-Regular' },
            padding: 20
          }
        }
      }
    }
  });
  
  console.log("Charts initialized successfully");
}

// Fetch sensor data from API
async function fetchSensorData() {
  const deviceId = document.getElementById('deviceId').value || 'AC:15:18:D7:B0:80';
  console.log("Fetching data for device:", deviceId);
  
  try {
    const response = await fetch(`https://api.fyahalarm.com/data/${deviceId}?page_size=100&page_number=0`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Fetched data:", data);
    
    if (data && data.length > 0) {
      sensorData = data;
      updateAllCharts();
      updateStatusIndicators();
      console.log("Data updated successfully");
    } else {
      console.log("No data received from API");
      // Show placeholder data or empty state
      sensorData = [];
    }
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    // Show error message to user
    showErrorMessage('Failed to fetch sensor data. Please check your connection and try again.');
  }
}

function showErrorMessage(message) {
  // You can customize this to show error messages in your UI
  console.error(message);
  // Optionally show a user-friendly error in the charts area
}

// Update all charts with current data
function updateAllCharts() {
  if (!sensorData || sensorData.length === 0) {
    console.log("No sensor data available to update charts");
    return;
  }

  console.log("Updating charts with", sensorData.length, "data points");

  // Get recent data based on selected time range
  const recentData = sensorData.slice(-currentTimeRange);
  const labels = recentData.map(record => {
    const date = new Date(record.time_stamp);
    date.setHours(date.getHours() - 5); // Jamaica time adjustment
    return date.toLocaleTimeString();
  });

  // Update Temperature & Humidity Chart
  if (charts.tempHumidity) {
    charts.tempHumidity.data.labels = labels;
    charts.tempHumidity.data.datasets[0].data = recentData.map(r => r.temperature || 0);
    charts.tempHumidity.data.datasets[1].data = recentData.map(r => r.humidity || 0);
    charts.tempHumidity.update();
  }

  // Update Gas & Oxygen Chart
  if (charts.gasOxygen) {
    charts.gasOxygen.data.labels = labels;
    charts.gasOxygen.data.datasets[0].data = recentData.map(r => r.gas_concentration || 0);
    charts.gasOxygen.data.datasets[1].data = recentData.map(r => r.oxygen_concentration || 0);
    charts.gasOxygen.update();
  }

  // Update Flame Chart with safer data handling
  if (charts.flame) {
    const flameData = recentData.map(r => {
      const flameLevel = r.flame_level ? r.flame_level / 4095 : 0;
      return Math.max(0, Math.min(1, flameLevel)); // Ensure value is between 0 and 1
    });
    
    charts.flame.data.labels = labels;
    charts.flame.data.datasets[0].data = flameData;
    
    // Update colors based on data
    charts.flame.data.datasets[0].backgroundColor = flameData.map(getFlameColor);
    charts.flame.data.datasets[0].borderColor = flameData.map(getFlameBorderColor);
    
    charts.flame.update();
  }

  // Update system status based on latest readings
  if (sensorData.length > 0) {
    updateSystemStatus();
  }
  
  console.log("Charts updated successfully");
}

// Update system status overview
function updateSystemStatus() {
  if (!sensorData || sensorData.length === 0) return;
  
  const latest = sensorData[sensorData.length - 1];
  const flameLevel = latest.flame_level ? latest.flame_level / 4095 : 0;
  
  let normal = 85, warning = 10, critical = 5;
  
  // Adjust percentages based on actual sensor readings
  if (latest.temperature > 40 || latest.gas_concentration > 500 || flameLevel > 0.5) {
    critical = 25;
    warning = 35;
    normal = 40;
  } else if (latest.temperature > 30 || latest.gas_concentration > 200 || flameLevel > 0.2) {
    warning = 25;
    normal = 70;
    critical = 5;
  }
  
  if (charts.overview) {
    charts.overview.data.datasets[0].data = [normal, warning, critical];
    charts.overview.update();
  }
}

// Update status indicators
function updateStatusIndicators() {
  if (!sensorData || sensorData.length === 0) return;
  
  const latest = sensorData[sensorData.length - 1];
  const indicators = document.querySelectorAll('.status-indicator');
  
  // Simple logic to determine status - you can make this more sophisticated
  indicators.forEach(indicator => {
    indicator.className = indicator.className.replace(/status-(ok|warning|danger)/, 'status-ok');
    
    const flameLevel = latest.flame_level ? latest.flame_level / 4095 : 0;
    
    if (latest.temperature > 40 || latest.gas_concentration > 500 || flameLevel > 0.5) {
      indicator.className = indicator.className.replace('status-ok', 'status-danger');
    } else if (latest.temperature > 30 || latest.gas_concentration > 200 || flameLevel > 0.2) {
      indicator.className = indicator.className.replace('status-ok', 'status-warning');
    }
  });
}

// Change time range for chart display
function changeTimeRange() {
  const select = document.getElementById('timeRange');
  currentTimeRange = parseInt(select.value);
  updateAllCharts();
}

// Auto-refresh data every 30 seconds
function startAutoRefresh() {
  setInterval(() => {
    fetchSensorData();
    fetchLatestReading(); // Also refresh the latest reading display
  }, 30000); // 30 seconds
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM loaded, initializing...");
  
  // Wait a bit for the page to fully load
  setTimeout(() => {
    initializeCharts();
    fetchSensorData();
    fetchLatestReading();
    startAutoRefresh();
    console.log("Initialization complete");
  }, 1000);
});