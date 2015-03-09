angular.module('AirMap', ['ui.bootstrap','ui.utils','ngRoute','ngAnimate','OpenDataKiosk']);

angular.module('AirMap').config(function($routeProvider) {

    $routeProvider.when('/airMap',{templateUrl: 'AirMap/partial/airMap/airMap.html'});
    /* Add New Routes Above */

});

angular.module('AirMap').run(function(ActivePluginRegisterService) {
    // ActivePluginRegisterService.register['environment']=['AirMap'];
    ActivePluginRegisterService.registerPlugin('environment','airMap', {});
});
