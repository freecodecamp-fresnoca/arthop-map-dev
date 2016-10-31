'use strict';

(function() {
	angular.module('arthopMapApp', [])

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
            console.log('LOOPING')
            setTimeout(check, 1000);
          } 
        }
        check();
      });

      p1.then(function(val) {
        $scope.locations = val;
        console.log($scope)
      })
     }]);
})(window.angular);

function loadVenues() {
    if(window.artHop && window.artHop.venues.length !== 0){
      console.log('artHop is now accessible')
    } else {
     setTimeout(loadVenues, 500);
    }
}
