'use strict';

(function() {
	angular.module('arthopMapApp')
	.config(['$stateProvider', '$authProvider',function($stateProvider, $authProvider) {
    console.log({$authProvider})
    $authProvider.httpInterceptor = function() { return true; },
    $authProvider.withCredentials = false;
    $authProvider.tokenRoot = null;
    $authProvider.baseUrl = 'http://localhost:3333'
    $authProvider.loginUrl = '/auth/login';
    $authProvider.unlinkUrl = '/auth/unlink/';
    $authProvider.tokenName = 'token';
    $authProvider.tokenPrefix = 'satellizer';
    $authProvider.tokenHeader = 'Authorization';
    $authProvider.tokenType = 'Bearer';
    $authProvider.storageType = 'localStorage';

    // Google
    $authProvider.google({
      clientId: '754975649922-j1anol2frgcnoqp2tb0m8l7sc5i17puo.apps.googleusercontent.com',
      url: '/auth/google',
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
      redirectUri: window.location.origin,
      requiredUrlParams: ['scope'],
      optionalUrlParams: ['display'],
      scope: ['profile', 'email'],
      scopePrefix: 'openid',
      scopeDelimiter: ' ',
      display: 'popup',
      oauthType: '2.0',
      popupOptions: { width: 452, height: 633 } //maybe change due to mobile screen size
    });
     
    console.log($authProvider)

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
    .controller( 'panelCtrl', ['$scope', '$http', '$auth', function( $scope, $http, $auth ) {
      $http.get('/venues').success(function(data) {
        $scope.venues = data
        $scope.authenticate = function(provider) {
          $auth.authenticate(provider);
        }
      })     
    }])
})(window.angular);

function loadModal(){
	setTimeout(function(){
		$('#searchIt').modal('show');
	}, 1000);
}
