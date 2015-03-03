angular.module('KioskMain').directive('kioskMainDirective', [function($scope) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
                  'plugins':'='
		},
		templateUrl: 'KioskMain/directive/kioskMainDirective/kioskMainDirective.html',
		link: function(scope, element, attrs, fn) {
		}
	};
}]);
