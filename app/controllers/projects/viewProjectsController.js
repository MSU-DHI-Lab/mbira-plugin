mbira.controller("viewProjectsCtrl", function ($scope, $http, projects){
	//Get all projects
	projects.getAll().success(function(data){
		  $scope.projects = data;
	})
});