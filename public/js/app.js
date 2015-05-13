window.app = angular
  .module('cmndApp', ['ngResource', 'ngRoute'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/commands', {
        templateUrl: '/js/templates/commands.html',
        controller: 'CommandsCtrl'
      }).
      when('/myplugins', {
        templateUrl: '/js/templates/myplugins.html',
        controller: 'MyPluginsCtrl'
      }).
      when('/allplugins', {
        templateUrl: '/js/templates/allplugins.html',
        controller: 'AllPluginsCtrl'
      }).
      when('/createplugin', {
        templateUrl: '/js/templates/createplugin.html',
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