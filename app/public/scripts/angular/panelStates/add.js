function AddController($http, $scope) {
  var ctrl = this;

  $scope.venue = {}

  ctrl.submitKey = function(name) {
    ctrl.venue.name = name
    $http.post('/venues/verify', ctrl.venue).then(function(data) {
      console.log(data)
    }) 
  }
}

angular.module('arthopMapApp').controller('AddController', AddController);
