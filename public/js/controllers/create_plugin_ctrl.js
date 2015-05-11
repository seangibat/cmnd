app.controller('CreatePluginCtrl', ['$scope', 'API', function($scope, API){
  $scope.plugin = new API.plugin();
  $scope.submitForm = function(){
    API.plugin.$save($scope.plugin, function(){
      console.log("Plugin saved!");
    });
  };
}]);