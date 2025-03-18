// script.js
// console.log("Hr");
// document.getElementById('nav-toggle').addEventListener('change', function() {
//     var pageContent = document.getElementById('pageContent');
//     // var map = document.getElementsByTagName('gmp-map');
//     console.log(pageContent);
//     if (this.checked) {
//         pageContent.style.paddingLeft = '120px'; // Adjust as needed
//         // map.style.paddingLeft = '100px';
//         console.log("Nm");
//     } else {
//         pageContent.style.paddingLeft = '310px'; // Adjust as needed
//         // map.style.paddingLeft = '290px'; // Adjust as needed
//     }
// });

console.log("Hr");
document.getElementById('nav-toggle').addEventListener('change', function() {
    var pageContent = document.getElementById('pageContent-left');
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