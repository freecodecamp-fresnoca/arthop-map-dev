function AddController($http, $scope) {
  var ctrl = this;

  $scope.venue = {}

  ctrl.submitKey = function(name) {
    $http.post('/venues/verify', ctrl.venue).then(function(res) {
      console.log(res)
      if(res.data.points) {
        $scope.$parent.user.points = res.data.points
        $scope.$parent.user.locations.push(name);
        console.log($scope.$parent.user.locations);
      }
    })
  }
  ctrl.visited = function(name){
    console.log('User locations: ', $scope.$parent.user.locations);
    if ($scope.$parent.user.locations.includes(name)){return true;}
    else {return false;}
  }


  ctrl.fireTest = function() {
    $http.get('/auth/logout').then(function(res) {
      console.log(res)
    })
  }
}

angular.module('arthopMapApp').controller('AddController', AddController);
