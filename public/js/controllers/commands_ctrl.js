app.controller('CommandsCtrl', ['$scope', 'API', function($scope, API){

  API.command.query(function(data){
    $scope.commands = data;
  });
  
}]);