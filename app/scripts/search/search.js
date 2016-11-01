'use strict';

(function() {
	angular.module('arthopMapApp')
	.config(['$stateProvider',function($stateProvider) {
	  var helloState = {
	    name: 'user',
	    url: '/user',
	    template: '<h3>This is the user</h3>',
			onEnter: loadModal
	  }

	  var aboutState = {
	    name: 'about',
	    url: '/about',
	    template: '<h3>Its the UI-Router hello world app!</h3>',
			onEnter: loadModal
	  }

	  $stateProvider.state(helloState);
	  $stateProvider.state(aboutState);
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
