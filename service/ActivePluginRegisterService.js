angular.module('OpenDataKiosk').factory('ActivePluginRegisterService',function() {

  var ActivePluginRegisterService = {};
  
  ActivePluginRegisterService.register=[ { category:'test', plugins:['SomeTest']},
                                         { category:'test2', plugins:['someTest21','someTest22']},
                                         { category:'test3', plugins:['someTest31','someTest32']} ];
  // ActivePluginRegisterService.register={};

  return ActivePluginRegisterService;
});
