mbira.controller("settingsCtrl", function ($scope, $http){
	var path

	$http({
		method: 'GET',
		url: "ajax/getProjects.php",
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).success(function(data){
		$scope.projects = data;
	})
	
	$http({
		method: 'GET',
		url: "ajax/getBasePath.php",
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).success(function(data){
		path = window.location.pathname.split('/');
		$scope.url = data + "plugins/" + path[path.length-2] + "/";
	})
});	