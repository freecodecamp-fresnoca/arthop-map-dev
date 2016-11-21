'use strict';
var coords;
var map;

//Center location button function
function CenterControl(controlDiv, map) {
  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = 'rgba(255,215,36,.75)';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '22px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to recenter the map';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '2.2em';
  controlText.style.lineHeight = '38px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = '&#9672';
  controlUI.appendChild(controlText);

}

//Zoom in and out function
function ZoomControl(controlDiv, map) {

    // Creating divs & styles for custom zoom control
    controlDiv.style.padding = '0 2vw 2vh 0';

    // Set CSS for the control wrapper
    var controlWrapper = document.createElement('div');
    controlWrapper.style.cursor = 'pointer';
    controlWrapper.style.textAlign = 'center';
    controlWrapper.style.width = '15vw';
    controlWrapper.style.height = '30vw';
    controlDiv.appendChild(controlWrapper);

    // Set CSS for the zoomIn
    var zoomInButton = document.createElement('div');
    zoomInButton.style.width = '15vw';
    zoomInButton.style.height = '15vw';
    zoomInButton.style.backgroundColor = 'rgba(255,215,36,.75)';
    zoomInButton.style.fontWeight = "500";
    zoomInButton.style.fontSize = "64px";
    zoomInButton.style.lineHeight = "54px";
    zoomInButton.style.margin = "auto";
    zoomInButton.innerHTML = '&#43;';
    zoomInButton.style.borderRadius = "4px";

    controlWrapper.appendChild(zoomInButton);

    // Set CSS for the zoomOut
    var zoomOutButton = document.createElement('div');
    zoomOutButton.style.width = '15vw';
    zoomOutButton.style.backgroundColor = 'rgba(255,215,36,.75)';
    zoomOutButton.style.height = '15vw';
    zoomOutButton.innerHTML = '&#45;';
    zoomOutButton.style.fontSize = "64px";
    zoomOutButton.style.lineHeight = "50px";
    zoomOutButton.style.fontWeight = "700";
    zoomOutButton.style.margin = "1vh auto 0px";
    zoomOutButton.style.borderRadius = "4px";
	controlWrapper.appendChild(zoomOutButton);

    // Setup the click event listener - zoomIn
    google.maps.event.addDomListener(zoomInButton, 'click', function() {
        map.setZoom(map.getZoom() + 1);
    });

    // Setup the click event listener - zoomOut
    google.maps.event.addDomListener(zoomOutButton, 'click', function() {
        map.setZoom(map.getZoom() - 1);
    });

}

function myMap() {

  //Polygon parameters
  var poly1 = new google.maps.LatLng(36.743129, -119.800229);
  var poly2 = new google.maps.LatLng(36.742353, -119.803104);
  var poly3 = new google.maps.LatLng(36.743600, -119.801833);
  var poly4 = new google.maps.LatLng(36.728567, -119.787868);
  var poly5 = new google.maps.LatLng(36.740620, -119.782663);
  var poly6 = new google.maps.LatLng(36.735943, -119.777900);
  var poly7 = new google.maps.LatLng(36.743337, -119.789315);



  var mapCenter = new google.maps.LatLng(36.733577, -119.789057);
  var mapCanvas = document.getElementById("map");
  var mapOptions = {
    center: mapCenter,
    zoom: 14,
    styles: styles,
    disableDefaultUI: true
    //disableDefaultUI disables all default map buttons
  };

  //CREATE MAP
  map = new google.maps.Map(mapCanvas, mapOptions);
  var personMarker;
  currentLocation();

  function currentLocation() {
    if (navigator.geolocation) {
      var opt = {
        enableHighAccuary: true,
        timeout: 5000,
        maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(success, error, opt);
    }

    function success(position) {
      coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }

      map.panTo(coords);
      map.setZoom(18);

      personMarker = new google.maps.Marker({
        position: {
          lat: coords.lat,
          lng: coords.lng
        },
        map: map,
        icon: "/images/person.png"
      })
    }

    function error() {
      console.log("Location cannot be used/found");
    }
  }

//Location center button configuration
  var centerControlDiv = document.createElement('div');
  var centerControl = new CenterControl(centerControlDiv, map);
  centerControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(centerControlDiv);
  // Setup the click event listeners: simply set the map to Chicago.
  centerControlDiv.addEventListener('click', function() {
    if (personMarker) {
      personMarker.setMap(null);
    }
    currentLocation();
  });

//Zoom button configuration
// Create the DIV to hold the control and call the ZoomControl() constructor
// passing in this DIV.
var zoomControlDiv = document.createElement('div');
var zoomControl = new ZoomControl(zoomControlDiv, map);

zoomControlDiv.index = 1;
map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(zoomControlDiv);

  // Polygon Construction
  var polyCoords = [poly1, poly3, poly2, poly4, poly6, poly5, poly7];
  var cityPolygon = new google.maps.Polygon({
    paths: polyCoords,
    strokeColor: '#16a085',
    strokeOpacity: 0.4,
    strokeWeight: 2,
    fillColor: '#EAEA10',
    fillOpacity: 0.1
  });

  google.maps.Polygon.prototype.getBounds = function() {
    var bounds = new google.maps.LatLngBounds();
    var paths = this.getPaths();
    var path;
    for (var i = 0; i < paths.getLength(); i++) {
      path = paths.getAt(i);
      for (var ii = 0; ii < path.getLength(); ii++) {
        bounds.extend(path.getAt(ii));
      }
    }
    return bounds;
  }

  map.fitBounds(cityPolygon.getBounds());
  cityPolygon.setMap(map);
  var mapDataObj = new mapData(map);
  mapDataObj.getMarkers();
}
