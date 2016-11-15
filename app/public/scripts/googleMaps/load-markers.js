'use strict';

function mapData(map) {

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

  this.getMarkers = loadMarkers;
}

function loadMarkers() {
  var markers = [];
  var venues = [];
  $.get('/venues',function(data) {
    venues = data
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
      setTimeout(function(){ marker.setAnimation(null); }, 1600);

      markers.push(marker);
      marker.addListener('click', function() {
        var infowindow = new google.maps.InfoWindow({
          content: '<div><strong>' + this.title + '</string><p>' + address + '</p></div'
        });
        infowindow.open(map, marker);
      });
    });
  })
}
