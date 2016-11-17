mbira.controller("viewAreasCtrl", function ($scope, $http, makeArray, areas, projects){
	$scope.project
	$scope.pid
	$scope
	//Get all areas
	areas.getAll().success(function(data){
		$scope.data = data;
		//Get all projects
		projects.getAll().success(function(data2){
			for(i=0;i<data2.length;i++){
			  	areaArray = makeArray.make(data2[i].id, $scope);
			  	for (j=0; j < areaArray.length; j++) {
				    var div = document.createElement("div");
				    div.innerHTML = areaArray[j].description; 

				    areaArray[j].description = (div.textContent || div.innerText || "")
			  	}
			  	data2[i].areas = areaArray;
			}
			$scope.projects = data2;
		})
	})
});