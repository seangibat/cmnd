app.factory('API', function ($resource) {
  var command = $resource('/api/commands', {id:'@id'}, {update: {method: 'PATCH'}});
  var plugin = $resource('/api/plugins', {id:'@id'}, {update: {method: 'PATCH'}});
  var userPlugin = $resource('/api/user/plugins', {id:'@id'}, {update: {method: 'PATCH'}});
  
  return {
    command    : command,
    plugin     : plugin,
    userPlugin : userPlugin
  };
});