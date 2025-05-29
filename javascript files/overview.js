
console.log("hi");


function displayLatestReading(latestRecord) {
  const container = document.getElementById("myDevices");
  
  // Create the box element
  const readingBox = document.createElement("div");
  readingBox.classList.add("latestReadingBox");

  // Create caption box
  const captionBox = document.createElement("div");
  captionBox.classList.add("latestReadingCaption");

  // Name container
  const nameContainer = document.createElement("div");
  nameContainer.classList.add("latestReadingName");
  const title = document.createElement("span");
  title.classList.add("latestReadingTitle");
  title.textContent = "AC:15:18:D7:B0:80";
  nameContainer.appendChild(title);

  // Text container
  const textContainer = document.createElement("div");
  textContainer.classList.add("latestReadingTextContainer");

  // Format the timestamp
  const date = new Date(latestRecord.time_stamp);
  date.setHours(date.getHours() - 5); // Jamaica is UTC-5
  const formattedTime = date.toLocaleString();

  textContainer.innerHTML = `
      <p class="latestReadingText">Time: ${formattedTime}</p>
      <p class="latestReadingText">Temp: ${latestRecord.temperature}°C</p>
      <p class="latestReadingText">Humidity: ${latestRecord.humidity}%</p>
      <p class="latestReadingText">Flame: ${latestRecord.flame ? "Detected" : "Not Detected"}</p>
      <p class="latestReadingText">Gas: ${latestRecord.gas ? "Detected" : "Not Detected"}</p>
      <p class="latestReadingText">O₂: ${latestRecord.oxygen_concentration}%</p>
  `;

  // Image container
  const imgContainer = document.createElement("div");
  imgContainer.classList.add("latestReadingImg");
  const img = document.createElement("img");
  img.src = "images/faviconRed.png";
  img.alt = "Device Image";
  img.classList.add("productImg");
  imgContainer.appendChild(img);

  // Append elements
  captionBox.appendChild(nameContainer);
  captionBox.appendChild(textContainer);
  readingBox.appendChild(captionBox);
  readingBox.appendChild(imgContainer);
  
  // Insert at the beginning of the myDevices container
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