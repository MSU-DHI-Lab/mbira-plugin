mbira.controller("viewExhibitsCtrl", function ($scope, $http, makeArray, projects, exhibits){
	//Get all exhibits
	exhibits.getAll().success(function(data){
		$scope.data = data
		//Get all projects
		projects.getAll().success(function(data2){
			for(i=0;i<data2.length;i++){
			  	exhArray = makeArray.make(data2[i].id, $scope);
			  	for (j=0; j < exhArray.length; j++) {
				    var div = document.createElement("div");
				    div.innerHTML = exhArray[j].description; 

				    exhArray[j].description = (div.textContent || div.innerText || "")
			  	}
			  	data2[i].exhibits = exhArray;
			}
			$scope.projects = data2;

		})
	})
});