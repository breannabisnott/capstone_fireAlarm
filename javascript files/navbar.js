// script.js
document.getElementById('nav-toggle').addEventListener('change', function() {
    var devicesContainer = document.getElementById('devicesContainer');
    if (this.checked) {
        devicesContainer.overview.paddingLeft = '290px'; // Adjust as needed
    } else {
        devicesContainer.overview.paddingLeft = '50px'; // Adjust as needed
    }
});
