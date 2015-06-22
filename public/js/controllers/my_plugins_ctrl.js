app.controller('MyPluginsCtrl', ['$scope', 'API', function($scope, API){
  
  API.userPlugin.query(function(data){
    $scope.plugins = data;
  });

}]);