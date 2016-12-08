function AddController($http, $scope) {
  var ctrl = this;

  $scope.venue = {}

  ctrl.submitKey = function(venue) {
    if(nearby(venue, $scope.$parent.userLocation) && navigator.geolocation) {
      $http.post('/venues/verify', ctrl.venue).then(function(res) {
        if(res.data.points) {
          $scope.$parent.user.points = res.data.points
          $scope.$parent.user.locations.push(venue.name);
          console.log($scope.$parent.user.locations);
        } else {
          console.log("Sorry wrong code.")
        }
      })
    } else {
      console.log("Sorry not close enough")
    }
  }

  ctrl.visited = function(name){
    if ($scope.$parent.user.locations.includes(name)){return true;}
    else {return false;}
  }
}

angular.module('arthopMapApp').controller('AddController', AddController);

function deg2rad(deg) {
  rad = deg * Math.PI/180; // radians = degrees * pi/180
  return rad;
}


// round to the nearest 1/1000
function round(x) {
  return Math.round( x * 1000) / 1000;
}

function nearby(venue, userLocation) {
  var mi;
  var t1, n1, t2, n2, lat1, lon1, lat2, lon2, dlat, dlon, a, c, dm, dk
  var Rm = 3961; // mean radius of the earth (miles) at 39 degrees from the equat

  t1 = userLocation.coords.latitude
  t2 = venue.location.lat
  n1 = userLocation.coords.longitude
  n2 = venue.location.lng
  // convert coordinates to radians
  lat1 = deg2rad(t1);
  lon1 = deg2rad(n1);
  lat2 = deg2rad(t2);
  lon2 = deg2rad(n2);
  
  // find the differences between the coordinates
  dlat = lat2 - lat1;
  dlon = lon2 - lon1;
  
  // here's the heavy lifting
  a  = Math.pow(Math.sin(dlat/2),2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon/2),2);
  c  = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a)); // great circle distance in radians
  dm = c * Rm; // great circle distance in miles
  
  // round the results down to the nearest 1/1000
  mi = round(dm);

  return mi < 0.085 
}
