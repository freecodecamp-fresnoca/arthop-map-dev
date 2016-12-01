function AddController($http, $scope) {
  var ctrl = this;

  $scope.venue = {}

  ctrl.submitKey = function() {
    $http.post('/venues/verify', ctrl.venue).then(function(res) {
      console.log(res)
      if(res.data.points) {
        $scope.$parent.user.points = res.data.points
      }
    }) 
  }

  ctrl.fireTest = function() {
    $http.get('/auth/logout').then(function(res) {
      console.log(res)
    })
  }
}

angular.module('arthopMapApp').controller('AddController', AddController);
