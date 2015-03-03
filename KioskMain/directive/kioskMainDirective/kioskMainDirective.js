angular.module('KioskMain').directive('kioskMainDirective', ['ActivePluginRegisterService',function() {
	return {
		restrict: 'E',
		replace: true,
		scope: {
		},
		templateUrl: 'KioskMain/directive/kioskMainDirective/kioskMainDirective.html',
		link: function(scope, element, attrs, fn) {


		}
	};
}]);
