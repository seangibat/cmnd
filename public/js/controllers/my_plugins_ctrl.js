app.controller('MyPluginsCtrl', ['$scope', 'API', function($scope, API){
  
  $scope.userPlugins = API.userPlugins();

}]);