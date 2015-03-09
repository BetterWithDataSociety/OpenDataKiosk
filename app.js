angular.module('OpenDataKiosk', ['ui.bootstrap', 'ui.utils', 'ngRoute', 'ngAnimate', 'AirMap', 'KioskMain']);

angular.module('OpenDataKiosk').config(function($routeProvider) {

    /* Add New Routes Above */
    // $routeProvider.otherwise({redirectTo:'/home'});
    $routeProvider.otherwise({ templateUrl: 'home.html' });
    // redirectTo:'/home'});


});

angular.module('OpenDataKiosk').run(function($rootScope) {

    $rootScope.safeApply = function(fn) {
        var phase = $rootScope.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

});


angular.module('OpenDataKiosk')
  .controller('KioskController', function ($scope) {
    $scope.greeting="Hello";
  });

