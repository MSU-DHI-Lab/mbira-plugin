var mbira  = angular.module('mbira', ['ui.router', 'angularFileUpload']);

mbira.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise("/projects");

	$stateProvider
	  .state('projects', {
	    url: "/projects",
	    templateUrl: "menu_project_all.php"
	  })
	  .state('viewProject', {
	    url: "/viewProject",
	    templateUrl: "project_single.php"
	  })	  
	  .state('newProject', {
	    url: "/newProject",
	    templateUrl: "menu_project_new.php"
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

mbira.factory('projectID', function(){
	var ID = ''
	
	return {
		getID: function () {
			return ID;
		},
		setID: function (newID) {
			ID = newID;
		}
	};
});

mbira.controller("singleLocationCtrl", function ($scope, $http, $state, $upload, projectID){
	var app = this;
	
	$scope.ID = projectID.getID();
	console.log($scope.ID);
	// $http({
		// method: 'POST',
		// url: "ajax/getLocationInfo.php",
		// data: $.param({
				// id: $scope.ID
			// }),
		// headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	// }).success(function(data){
		  // $scope.project = data;
	// })
});

mbira.controller("singleProjectCtrl", function ($scope, $http, projectID){
	var app = this;
	
	$scope.ID = projectID.getID();
	
	$http({
		method: 'POST',
		url: "ajax/getProjectInfo.php",
		data: $.param({
				id: $scope.ID
			}),
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).success(function(data){
		  $scope.project = data[0];
		  $scope.locations = data[1];
	})
});

mbira.controller("viewProjectsCtrl", function ($scope, $http, projectID){
	var app = this;
	
	$http({
		method: 'GET',
		url: "ajax/getProjects.php",
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).success(function(data){
		  $scope.projects = data;
	})
	
	$scope.toProject = function(ID){
		projectID.setID(ID);	
	}
});

mbira.controller("newProjectCtrl", function ($scope, $http, $upload){
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
				data: {id: data, name_kora: $scope.newProject.name, description: $scope.newProject.description, admin: 'koraadmin'},
				file: $scope.file
			  }).success(function(data, status, headers, config) {
					location.reload();
			  });
	    })
	}
});
	
mbira.controller("newLocationCtrl", function ($scope, $http, $upload, projectID){
	var app = this;
	$scope.marker = false;
	$scope.file;
	$scope.ID = projectID.getID();

	$scope.newLocation = {
		name: "",
		descrition: "",
		file: "",
		lat: '',
		lon: ''
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
			url: "ajax/saveLocation.php",
			data: $.param({
						projectId: $scope.ID,
						name: $scope.newLocation.name,
						description: $scope.newLocation.description,
						lat: $scope.newLocation.lat,
						lon: $scope.newLocation.lon
					}),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function(data){
			  $scope.upload = $upload.upload({
				url: 'ajax/saveLocation.php',
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: {id: data},
				file: $scope.file
			  }).success(function(data, status, headers, config) {
					location.reload();
			  });
		})
	};
	
	//<MAP_STUFF>
	var map = L.map('map').setView([42.7404566603398, -84.5452880859375], 13);

	L.tileLayer('https://{s}.tiles.mapbox.com/v3/austintruchan.jb1pjhel/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		maxZoom: 18
	}).addTo(map);

	$scope.search = new L.Control.GeoSearch({
		provider: new L.GeoSearch.Provider.OpenStreetMap(),
		position: 'topcenter',
		showMarker: true,
		scope: $scope,
		map: map
	}).addTo(map);
	
	map.invalidateSize(false);

	map.on('click', function(e) {
		if($scope.marker != false){
			map.removeLayer($scope.marker);
			$scope.marker = false;
		}
		if($scope.search._positionMarker){
			map.removeLayer($scope.search._positionMarker);
		}
		$scope.newLocation.lat = e.latlng.lat;
		$scope.newLocation.lon = e.latlng.lng;
		
		$scope.marker = L.marker(e.latlng).addTo(map);
		console.log($scope.marker);
		$scope.$apply();
	});
	//</MAP_STUFF>
});