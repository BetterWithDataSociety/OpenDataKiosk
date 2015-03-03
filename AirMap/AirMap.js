angular.module('AirMap', ['ui.bootstrap','ui.utils','ngRoute','ngAnimate','OpenDataKiosk']);

angular.module('AirMap').config(function($routeProvider) {

    /* Add New Routes Above */
    // ActivePluginRegisterService.register.push({module:'AirMap'});

});

angular.module('AirMap').run(function(ActivePluginRegisterService) {
    // ActivePluginRegisterService.register['environment']=['AirMap'];
    ActivePluginRegisterService.registerPlugin('environment','AirMap');
});
