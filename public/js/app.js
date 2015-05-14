window.app = angular
  .module('cmndApp', ['ngResource', 'ngRoute'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/commands', {
        templateUrl: '/js/templates/commands.html',
        controller: 'CommandsCtrl'
      }).
      when('/myplugins', {
        templateUrl: '/js/templates/my_plugins.html',
        controller: 'MyPluginsCtrl'
      }).
      when('/allplugins', {
        templateUrl: '/js/templates/all_plugins.html',
        controller: 'AllPluginsCtrl'
      }).
      when('/createplugin', {
        templateUrl: '/js/templates/create_plugin.html',
        controller: 'CreatePluginCtrl'
      }).
      when('/api', {
        templateUrl: '/js/templates/api.html',
        controller: 'ApiCtrl'
      }).
      when('/clients', {
        templateUrl: '/js/templates/client.html',
        controller: 'ClientsCtrl'
      }).
      otherwise({
        redirectTo: '/commands'
      });
  }]);