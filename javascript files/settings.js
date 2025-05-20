let data = [];
    


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