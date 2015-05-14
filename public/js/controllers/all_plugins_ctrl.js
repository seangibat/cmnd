app.controller('AllPluginsCtrl', ['$scope', 'API', function($scope, API){

  API.plugin.query(function(data){
    $scope.plugins = data;
  });
  
}]);