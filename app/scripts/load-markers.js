function mapData(map) {
  var markers = [];

  var icons = {
          lens: {
            icon: 'images/lens.png'
          },
          mall: {
            icon: 'images/mall.png'
          },
          yeo: {
            icon: 'images/yeoman.png'
          }
        };

  this.getMarkers = function() {
    //Marker placement with Json
    $.getJSON("./scripts/location.json", function(locations) {
      var venues = locations["venues"];
      var largeInfowindow = new google.maps.InfoWindow();
      venues.forEach(function(venue) {
        var position = venue.location;
        var title = venue.name;
        var address = venue.address;
        var marker = new google.maps.Marker({
          map: map,
          position: position,
          title: title,
          animation: google.maps.Animation.BOUNCE
        });

        markers.push(marker);
        marker.addListener('click', function() {
          var infowindow = new google.maps.InfoWindow({
            content: '<div><strong>' + this.title + '</strong><p>' + address + '</p></div>'
          });
          infowindow.open(map, marker);
        });
      });
    });
  };
}
