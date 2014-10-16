var mbira  = angular.module('mbira', ['ui.router', 'angularFileUpload']);

mbira.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise("/projects");

	$stateProvider
	  .state('projects', {
	    url: "/projects",
	    templateUrl: "project_all.php"
	  })
	  .state('viewProject', {
	    url: "/viewProject",
	    templateUrl: "project_single.php"
	  })	  
	  .state('newProject', {
	    url: "/newProject",
	    templateUrl: "project_new.php"
	  })
	  .state('viewExhibit', {
	    url: "/viewExhibit",
	    templateUrl: "exhibit_single.html"
	  })
	  .state('newExhibit', {
	    url: "/newExhibit",
	    templateUrl: "exhibit_new.html"
	  })
	  .state('viewLocation', {
	    url: "/viewLocation",
	    templateUrl: "location_single.html"
	  })
	  .state('newLocation', {
	    url: "/newLocation",
	    templateUrl: "location_new.html"
	  })
	  .state('viewArea', {
	    url: "/viewArea",
	    templateUrl: "area_single.html"
	  })
	  .state('newArea', {
	    url: "/newArea",
	    templateUrl: "area_new.html"
	  })
	  .state('viewExploration', {
	    url: "/viewExploration",
	    templateUrl: "exploration_single.html"
	  })
	  .state('newExploration', {
	    url: "/newExploration",
	    templateUrl: "exploration_new.html"
	  })
});

mbira.controller("viewProjectsCtrl", function ($scope, $http, $state, $upload){
	var app = this;
	
	$http({
		method: 'GET',
		url: "ajax/getProjects.php",
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).success(function(data){
	console.log(data);
		  $scope.projects = data;
	})
});

mbira.controller("newProjectCtrl", function ($scope, $http, $state, $upload){
	var app = this;
	$scope.file;
	
	$scope.newProject = {
	    name: "",
		descrition: "",
		file: ""
	}
	
	$scope.onFileSelect = function($files) {
		if($files.length > 1) {
			alert("Only upload one image for the thumbnail.");
		}else{
		  $scope.file = $files[0];		  
		}
	};
	
	$scope.submit = function() {
		$http({
		    method: 'POST',
		    url: "ajax/process.php",
		    data: $.param({
		    			name: $scope.newProject.name,
		    			description: $scope.newProject.description,
		    		}),
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	    }).success(function(data){
			  $scope.upload = $upload.upload({
				url: 'ajax/process.php',
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: {id: data},
				file: $scope.file
			  }).success(function(data, status, headers, config) {
					location.reload();
			  });
	    })
	};
});