fetch("https://api.fyahalarm.com/latestData/AC:15:18:D7:B0:80")
//fetch("http://localhost:8000/latestData/AC:15:18:D7:B0:80")
  .then((response) => {
    // If the response is not 2xx, throw an error
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // If the response is 200 OK, return the response in JSON format.
    return response.json();
  })
  .then((data) => console.log(data)) // You can continue to do something to the response.
  .catch((error) => console.error("Fetch error:", error)); // In case of an error, it will be captured and logged.