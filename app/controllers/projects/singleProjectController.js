mbira.controller("singleProjectCtrl", function ($scope, $http, $stateParams, projects){
	$scope.pid = $stateParams.pid;
	
	//Get single project info
	projects.get($stateParams.project).success(function(data){
		//Set to scope
		$scope.project = data[0];
		$scope.locations = data[1];
		$scope.areas = data[2];
		$scope.explorations = data[3];
		$scope.exhibits = data[4];
	})
});