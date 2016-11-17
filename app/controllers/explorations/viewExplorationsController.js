mbira.controller("viewExplorationsCtrl", function ($scope, $http, makeArray, explorations, projects){
	explorations.getAll().success(function(data){
		$scope.data = data;
		//Get all projects
		projects.getAll().success(function(data2){
			for(i=0;i<data2.length;i++){
			  	expArray = makeArray.make(data2[i].id, $scope);
			  	for (j=0; j < expArray.length; j++) {
				    var div = document.createElement("div");
				    div.innerHTML = expArray[j].description; 

				    expArray[j].description = (div.textContent || div.innerText || "")
			  	}
			  	data2[i].explorations = expArray;
			}
			$scope.projects = data2;
		})
	})
});