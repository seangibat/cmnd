app.controller('CommandsCtrl', ['$scope', 'API', function($scope, API){

  $scope.commands = API.commands.query();
  
}]);