app.controller('CommandsCtrl', ['$scope', 'API', function($scope, API){

  API.commands.query(function(data){
    $scope.commands = data;
  });
  
}]);