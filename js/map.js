function myMap() {
  //Corners
  var topLeft = new google.maps.LatLng(36.743434, -119.801146);

  //Locations
  var communityReginal = new google.maps.LatLng(52.395715,4.888916);
  var motivePower = new google.maps.LatLng(36.743099, -119.800406);

  var mapCenter = new google.maps.LatLng(36.733577, -119.789057);
  var mapCanvas = document.getElementById("map");
  var mapOptions = {center: mapCenter, zoom: 14};
  var map = new google.maps.Map(mapCanvas, mapOptions);
  var fultonMall = new google.maps.Marker({
      position:mapCenter,
      icon: "img/mall.png"
      });

  fultonMall.setMap(map);

  var myCity = new google.maps.Circle({
    center: topLeft,
    radius: 25,
    strokeColor: "#0000FF",
    strokeOpacity: 1,
    strokeWeight: 1,
    fillColor: "#0000FF",
    fillOpacity: 1
  });
  myCity.setMap(map);

  var infowindow = new google.maps.InfoWindow({
  content: "<h1>Arthop Downtown</h1><p>Interactive Map</p>"
  });
infowindow.open(map,fultonMall);
}
