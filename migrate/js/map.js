function myMap() {
  //Corners
  var topLeft = new google.maps.LatLng(36.743434, -119.801146);

  //Polygon
  /*
      Top left 3 => 36.743129, -119.800229
      Top right 1 > 36.742353, -119.803104
      Top right corner 2 => 36.743600, -119.801833
      Bottom left 36.728567, -119.787868
  */

  var poly1 = new google.maps.LatLng(36.743129, -119.800229);
  var poly2 = new google.maps.LatLng(36.742353, -119.803104);
  var poly3 = new google.maps.LatLng(36.743600, -119.801833);
  var poly4 = new google.maps.LatLng(36.728567, -119.787868);
  var poly5 = new google.maps.LatLng(36.740620, -119.782663);
  var poly6 = new google.maps.LatLng(36.735943, -119.777900);
  var poly7 = new google.maps.LatLng(36.743337, -119.789315);



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

  // Polygon Construction
  var polyCoords = [poly1 , poly3 , poly2 , poly4 , poly6 , poly5 ,poly7 ];
  var cityPolygon = new google.maps.Polygon({
    paths: polyCoords,
    strokeColor: '#16a085',
    strokeOpacity: 0.4,
    strokeWeight: 2,
    fillColor: '#EAEA10',
    fillOpacity: 0.1
  });

  cityPolygon.setMap(map);


infowindow.open(map,fultonMall);
}
