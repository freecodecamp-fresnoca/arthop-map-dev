function AddController($http, $scope) {
  var ctrl = this;

  $scope.venue = {}

  ctrl.submitKey = function(name) {
    ctrl.venue.name = name
    $http.post('/venues/verify', ctrl.venue).then(function(res) {
      console.log(res)
      $scope.$parent.user.points = res.data.points
    }) 
  }
}

angular.module('arthopMapApp').controller('AddController', AddController);
