var mapAPI = "CHANGETHIS";
//Add your api key on the mapAPI variable above
var apiScript = document.createElement('script');
apiScript.setAttribute('src','https://maps.googleapis.com/maps/api/js?key='+mapAPI + "&callback=myMap");
var lastElement = document.body.lastChild;

lastElement.appendChild(apiScript);