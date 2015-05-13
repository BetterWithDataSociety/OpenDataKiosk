angular.module('AirMap2', ['ui.bootstrap','ui.utils','ngRoute','ngAnimate']);

angular.module('AirMap2').config(function($routeProvider) {

    $routeProvider.when('/AirMap2/{{sensor}}',{templateUrl: 'AirMap2/partial/AirMap2/AirMap2.html', reloadOnSearch: false});
    $routeProvider.when('/AirMap2',{templateUrl: 'AirMap2/partial/AirMap2/AirMap2.html', reloadOnSearch: false});
    /* Add New Routes Above */

});

angular.module('AirMap2').run(function(ActivePluginRegisterService) {
    ActivePluginRegisterService.registerPlugin('environment','AirMap2', 'Air Map 2', {});
});
