app.controller('AllPluginsCtrl', ['$scope', 'API', function($scope, API){

  API.plugins.query(function(data){
    $scope.plugins = data;
  });
  
}]);