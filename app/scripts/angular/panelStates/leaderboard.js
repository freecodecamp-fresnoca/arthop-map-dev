function LeaderboardController($http) {
  var ctrl = this;

  $http.get('/users')
  .then(function(response){
    ctrl.users = response.data.users;
  });
}

angular.module('arthopMapApp').controller('LeaderboardController', LeaderboardController);
