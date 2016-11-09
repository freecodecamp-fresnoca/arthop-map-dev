'use strict';
var coords;
var map;

function CenterControl(controlDiv, map) {

  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
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
  controlText.style.fontSize = '16px';
  controlText.style.lineHeight = '38px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = 'Center Map';
  controlUI.appendChild(controlText);

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
    styles: styles
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

  var centerControlDiv = document.createElement('div');
  var centerControl = new CenterControl(centerControlDiv, map);
  centerControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);
  // Setup the click event listeners: simply set the map to Chicago.
  centerControlDiv.addEventListener('click', function() {
    if (personMarker) {
      personMarker.setMap(null);
    }
    currentLocation();
  });

  var infowindow = new google.maps.InfoWindow({
    content: "<h1>Arthop Downtown</h1><p>Interactive Map</p>"
  });

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

