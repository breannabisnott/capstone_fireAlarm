//require('dotenv').config();

//const apiKey = process.env.MAP_KEY;
console.log("hi");

fetch("https://api.fyahalarm.com/latestData/AC:15:18:D7:B0:80")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    displayDeviceData(data);
  })
  .catch((error) => console.error("Fetch error:", error));

function displayDeviceData(device) {
  const container = document.getElementById("myDevices");

  // Create the device box
  const deviceBox = document.createElement("div");
  deviceBox.classList.add("deviceBox");

  // Create caption box
  const captionBox = document.createElement("div");
  captionBox.classList.add("deviceCaptionBox");

  // Name container with editable span
  const nameContainer = document.createElement("div");
  nameContainer.classList.add("nameContainer");
  const deviceName = document.createElement("span");
  deviceName.classList.add("deviceName");
  deviceName.contentEditable = true;
  deviceName.textContent = device.name || "Unknown Device"; // Default name if not provided

  nameContainer.appendChild(deviceName);

  // Text container
  const textContainer = document.createElement("div");
  textContainer.classList.add("textContainer");

  textContainer.innerHTML = `
    <p class="deviceText">Device: ${device.status ? "ON" : "OFF"}</p>
    <p class="deviceText">Temperature: ${device.temperature} C</p>
    <p class="deviceText">Oxygen Concentration: ${device.oxygen}%</p>
    <p class="deviceText">Gas Concentration: ${device.gas}%</p>
    <p class="deviceText">Flame: ${device.flameDetected ? "Detected" : "Not Detected"}</p>
  `;

  // Image container
  const imgContainer = document.createElement("div");
  imgContainer.classList.add("imgContainer");
  const img = document.createElement("img");
  img.src = "images/faviconRed.png";
  img.alt = "Device Image";
  img.classList.add("productImg");

  imgContainer.appendChild(img);

  // Append elements
  captionBox.appendChild(nameContainer);
  captionBox.appendChild(textContainer);
  deviceBox.appendChild(captionBox);
  deviceBox.appendChild(imgContainer);
  container.appendChild(deviceBox);
}

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

  // function updateMapAndMarker(lat, lng) {
  //     mapElement.setAttribute('center', `${lat},${lng}`);
  //     markerElement.setAttribute('position', `${lat},${lng}`);
  // }

  fetchLatestLocation();
});