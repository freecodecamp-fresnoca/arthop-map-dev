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
        $http.get("scripts/location.json").success(function(data) {
          $scope.locations = data.venues;
        });
     }]);
})(window.angular);
