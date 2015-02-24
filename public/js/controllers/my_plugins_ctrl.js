app.controller('MyPluginsCtrl', ['$scope', 'API', function($scope, API){
  
  $scope.myplugins = API.userPlugins();
  $scope.plugins = API.plugins;

}]);