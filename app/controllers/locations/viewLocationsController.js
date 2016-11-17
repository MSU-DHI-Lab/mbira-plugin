//View all locations in the menu
mbira.controller("viewLocationsCtrl", function ($scope, $http, makeArray, locations, projects){

	locations.getAll().success(function(data){
		$scope.data = data;

		//Get all projects
		projects.getAll().success(function(data2){
			for(i=0;i<data2.length;i++){
			  	locArray = makeArray.make(data2[i].id, $scope);
			  	for (j=0; j < locArray.length; j++) {
				    var div = document.createElement("div");
				    div.innerHTML = locArray[j].description; 

				    locArray[j].description = (div.textContent || div.innerText || "")
			  	}
			  	data2[i].locations = locArray;
			}
			$scope.projects = data2;
		})

	})

});