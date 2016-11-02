'use strict';

(function() {
	angular.module('arthopMapApp')
	.config(['$stateProvider',function($stateProvider) {
	  var userState = {
	    name: 'user',
	    url: '/user',
	    template: '<h3>This is the user</h3>',
			onEnter: loadModal
	  }

	  var leaderboardState = {
	    name: 'leaderboard',
	    url: '/leaderboard',
	    template: '<h3>This is the leaderboard</h3>',
			onEnter: loadModal
	  }

		var visitedState = {
			name: 'visited',
	    url: '/visited',
	    template: '<h3>This is the visited state.</h3>',
			onEnter: loadModal
		}

		var addedState = {
			name: 'added',
	    url: '/added',
	    template: '<h3>This is where dreams are made added. </h3>',
			onEnter: loadModal
		}

	  $stateProvider.state(userState);
	  $stateProvider.state(leaderboardState);
		$stateProvider.state(visitedState);
		$stateProvider.state(addedState);
	}])




		.directive("searchButton", function() {
			return {
				restrict: "E",
				templateUrl: "scripts/search/search-button.html",
                controller: "searchCtrl"

			};
		})
		.directive("searchModal", function() {
			return {
				restrict: "E",
				templateUrl: "scripts/search/search-modal.html",
                controller: "searchCtrl"

			};
		})
    .controller( 'searchCtrl', ['$scope', '$http', function( $scope, $http ) {
      var p1 = new Promise(function(resolve, reject) {
        var attemptsLeft = 20;
        function check() {
          if(window.artHop && window.artHop.venues.length !== 0) {
            resolve(window.artHop.venues);
          } else {
            setTimeout(check, 1000);
          }
        }
        check();
      });

      p1.then(function(val) {
        $scope.locations = val;
      }).catch(function(error) {
        console.log(error, 'is the error(s)');
      })
     }]);
})(window.angular);
function loadModal(){
	setTimeout(function(){
		$('#searchIt').modal('show');
	}, 1000);
}
