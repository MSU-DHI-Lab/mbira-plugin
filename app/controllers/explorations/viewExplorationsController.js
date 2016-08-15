mbira.controller("viewExplorationsCtrl", function ($scope, $http, makeArray, explorations, projects){
	explorations.getAll().success(function(data){
		$scope.data = data;
		//Get all projects
		projects.getAll().success(function(data2){
			for(i=0;i<data2.length;i++){
			  	expArray = makeArray.make(data2[i].id, $scope);
			  	data2[i].explorations = expArray;
			}
			$scope.projects = data2;
		})
	})
});