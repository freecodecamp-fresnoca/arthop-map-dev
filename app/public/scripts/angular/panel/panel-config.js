'use strict';

(function() {
	angular.module('arthopMapApp')
	.config(['$stateProvider', '$authProvider',function($stateProvider, $authProvider) {
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

    var loginState = {
      name: 'login',
      url: '/login',
      templateUrl: '/views/panelStates/login.html',
      onEnter: loadModal,
      controller: 'UserController as ctrl'
    }

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

    $stateProvider.state(loginState);
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
    .controller( 'panelCtrl', ['$scope', '$http', '$auth', '$state', function( $scope, $http, $auth, $state ) {
      $scope.authenticate = function(provider) {
        $auth.authenticate(provider).then(function(data) {
          $http.get('/api/me').then(function(res) {
            $scope.user = res.data
            $state.go('user')
          }, function(err) {
            console.log('Sorry could\'t retrieve user information', err)
          })
        })       
      }

      $scope.isAuthenticated = function() {
        return $auth.isAuthenticated();
      }

      $http.get('/venues').success(function(data) {
        $scope.venues = data
      })         

      if($scope.isAuthenticated())
      $http.get('/api/me').then(function (res) {
        console.log('user....', res)
        $scope.user = res.data
        $state.go('user')
      }, function (err) {
        console.log("Sorry couldn't retrieve user information", err)
        $state.go('login')
      })

      $scope.logout = function() {
        $auth.unlink('google')
          .then(function(response) {
            $auth.removeToken()
            $state.go('login')
          })
          .catch(function(response) {
            // Handle errors here.
            console.log('Error with loggin you out.')
          }); 
      }
    }])
})(window.angular);

function loadModal(){
	setTimeout(function(){
		$('#searchIt').modal('show');
	}, 1000);
}
