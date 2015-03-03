angular.module('OpenDataKiosk').factory('ActivePluginRegisterService',function() {

  var ActivePluginRegisterService = {};
  
  // ActivePluginRegisterService.register=[ { category:'test', plugins:['SomeTest']},
  //                                        { category:'test2', plugins:['someTest21','someTest22']},
  //                                        { category:'test3', plugins:['someTest31','someTest32']} ];
  ActivePluginRegisterService.register=[];

  ActivePluginRegisterService.registerPlugin = function(category, name) {
    var selected_category = null;
    for (var i=0, iLen=ActivePluginRegisterService.register.length; i<iLen; i++) {
      if (ActivePluginRegisterService.register[i].category == category)
        selected_category =  ActivePluginRegisterService.register[i];
    }

    if ( selected_category == null ) {
      selected_category = { category: category, plugins:[name] };
      ActivePluginRegisterService.register.push(selected_category);
    }
    else {
      selected_category.plugins.push(name);
    }

  };

  return ActivePluginRegisterService;
});
