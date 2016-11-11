'use strict';

(function() {
	angular.module('arthopMapApp')
	.config(['$stateProvider',function($stateProvider) {
	  var userState = {
	    name: 'user',
	    url: '/user',
	    templateUrl: '/views/panelStates/user.html',
			onEnter: loadModal,
			controller: 'UserController as ctrl'
	  }

	  var leaderboardState = {
	    name: 'leaderboard',
	    url: '/leaderboard',
	    templateUrl: '/views/panelStates/leaderboard.html',
			onEnter: loadModal,
			controller: 'LeaderboardController as ctrl'
	  }

		var visitedState = {
			name: 'visited',
	    url: '/visited',
	    templateUrl: '/views/panelStates/visited.html',
			onEnter: loadModal,
			controller: 'VisitedController as ctrl'
		}

		var addState = {
			name: 'add',
	    url: '/add',
	    templateUrl: '/views/panelStates/add.html',
			onEnter: loadModal,
			controller: 'AddController as ctrl'
		}

	  $stateProvider.state(userState);
	  $stateProvider.state(leaderboardState);
		$stateProvider.state(visitedState);
		$stateProvider.state(addState);
	}])




		.directive("searchButton", function() {
			return {
				restrict: "E",
				templateUrl: "views/panel/panel-button.html",
                controller: "panelCtrl"

			};
		})
		.directive("searchModal", function() {
			return {
				restrict: "E",
				templateUrl: "views/panel/panel-modal.html",
                controller: "panelCtrl"

			};
		})
    .controller( 'panelCtrl', ['$scope', '$http', function( $scope, $http ) {
      $http.get('/venues').success(function(data) {
        $scope.venues = data
      })     
    }]);
})(window.angular);

function loadModal(){
	setTimeout(function(){
		$('#searchIt').modal('show');
	}, 1000);
}