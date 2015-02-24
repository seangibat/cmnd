app.controller('AllPluginsCtrl', ['$scope', 'API', function($scope, API){

  $scope.myplugins = API.userPlugins();
  $scope.plugins = API.plugins;
  
}]);