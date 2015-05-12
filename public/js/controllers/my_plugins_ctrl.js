app.controller('MyPluginsCtrl', ['$scope', 'API', function($scope, API){
  
  API.userPlugins().query(function(data){
    $scope.plugins = data;
  });

}]);