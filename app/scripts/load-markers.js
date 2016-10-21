function mapData(mapo) {
    this.getMarkers = function(){
        console.log(mapo);
//Marker placement with Json
    var markers = [];
    $.getJSON("./scripts/location.json", function(locations){
    var venues = locations["venues"];
    var largeInfowindow = new google.maps.InfoWindow();
    venues.forEach(function(x){
      var position = x.location;
      var title = x.name;
      var address = x.address;
      var marker = new google.maps.Marker({
        map: mapo,
        position: position,
        title: title
      });

        console.log(x.name);
      markers.push(marker);
      marker.addListener('click',function(){
        populateInfoWindow(this , largeInfowindow);
      });

//Info window populater
      function populateInfoWindow(marker, infowindow) {
            // Check to make sure the infowindow is not already opened on this marker.
            if (infowindow.marker != marker) {
              infowindow.marker = marker;
              infowindow.setContent('<div><strong>' + marker.title + '</strong><p>'+ address +'</p></div>');
              infowindow.open(mapo, marker);
              // Make sure the marker property is cleared if the infowindow is closed.
              infowindow.addListener('closeclick',function(){
                infowindow.setMarker(null);
              });
            }
          }
    });
  });    
    
    
    
    
    
    };
}
