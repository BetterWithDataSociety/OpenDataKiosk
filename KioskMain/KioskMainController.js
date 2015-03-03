angular.module('KioskMain')
  .controller('kioskMainController', ['$scope','ActivePluginRegisterService',function ($scope, pluginRegister) {
    $scope.greeting="KMHello";
    $scope.plugins = pluginRegister.register;
  }]);

