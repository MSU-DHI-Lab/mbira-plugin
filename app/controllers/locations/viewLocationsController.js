//View all locations in the menu
mbira.controller("viewLocationsCtrl", function ($scope, $http, makeArray, locations, projects){

	locations.getAll().success(function(data){
		$scope.data = data;

		//Get all projects
		projects.getAll().success(function(data2){
			for(i=0;i<data2.length;i++){
			  	LocArray = makeArray.make(data2[i].id, $scope);
			  	data2[i].locations = LocArray;
			}
			$scope.projects = data2;
		})

	})

});