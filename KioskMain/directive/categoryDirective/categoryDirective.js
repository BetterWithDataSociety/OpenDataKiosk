angular.module('KioskMain').directive('categoryDirective', function() {
	return {
		restrict: 'E',
		replace: true,
		scope: {
                  plugins:'='
		},
		templateUrl: 'KioskMain/directive/categoryDirective/categoryDirective.html',
		link: function(scope, element, attrs, fn) {


		}
	};
});
