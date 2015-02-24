app.factory('API', function ($resource) {
  var commands = $resource('/commands', {id:'@id'}, {update: {method: 'PATCH'}});
  var plugins = $resource('/plugins', {id:'@id'}, {update: {method: 'PATCH'}});
  var userPlugins = $resource('/user/plugins', {id:'@id'}, {update: {method: 'PATCH'}});
  
  return {
    commands    : commands,
    plugins     : plugins,
    userPlugins : userPlugins
  };
});