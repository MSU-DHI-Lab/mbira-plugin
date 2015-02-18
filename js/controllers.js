var mbira  = angular.module('mbira', ['ui.router', 'angularFileUpload', 'angular-sortable-view']);

mbira.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise("/projects");

	$stateProvider
	  .state('projects', {
	    url: "/projects",
	    templateUrl: "menu_project_all.php"
	  })
	  .state('viewProject', {
	    url: "/viewProject/?project&pid",
	    templateUrl: "project_single.php"
	  })
	  .state('newProject', {
	    url: "/newProject",
	    templateUrl: "menu_project_new.php"
	  })
	  .state('thumbnail', {
	    url: "/thumbnail",
	    templateUrl: "thumbnail.php"
	  })
	  .state('viewExhibit', {
	    url: "/viewExhibit",
	    templateUrl: "exhibit_single.html"
	  })
	  .state('newExhibit', {
	    url: "/newExhibit",
	    templateUrl: "exhibit_new.html"
	  })
	   .state('locations', {
	    url: "/locations",
	    templateUrl: "menu_location_all.php"
	  })
	  .state('viewLocation', {
	    url: "/viewLocation/?project&location",
	    templateUrl: "location_single.html"
	  })
	  .state('newLocation', {
	    url: "/newLocation/?project&pid",
	    templateUrl: "location_new.html"
	  })
	  .state('viewArea', {
	    url: "/viewArea/?project&area",
	    templateUrl: "area_single.html"
	  })
	  .state('newArea', {
	    url: "/newArea/?project&pid",
	    templateUrl: "area_new.html"
	  })
	   .state('explorations', {
	    url: "/explorations",
	    templateUrl: "menu_exploration_all.php"
	  })
	  .state('viewExploration', {
	    url: "/viewExploration",
	    templateUrl: "exploration_single.html"
	  })
	  .state('newExploration', {
	    url: "/newExploration/?project&pid",
	    templateUrl: "exploration_new.html"
	  })
});

mbira.factory('setMap', function(){	
	//initialize map
	return {
		set: function(lat, lon){
			var map = L.map('map').setView([lat, lon], 14);

			L.tileLayer('https://{s}.tiles.mapbox.com/v3/austintruchan.jb1pjhel/{z}/{x}/{y}.png', {
				attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery � <a href="http://mapbox.com">Mapbox</a>',
				maxZoom: 18
			}).addTo(map);
			
			map.invalidateSize(false);
			return map;
		}
	}
	
});

mbira.controller("singleLocationCtrl", function ($scope, $http, $state, $upload, $stateParams, setMap){
	var map;
	$scope.newMedia = false;
	
	//todo when exhibits are ready --- populates exhibits dropdown
	$scope.exhibits = [
      {name:'EXHIBIT 1'},
      {name:'EXHIBIT 2'},
      {name:'EXHIBIT 3'},
      {name:'EXHIBIT 4'},
      {name:'EXHIBIT 5'}
    ];
    $scope.selectedExhibit = $scope.exhibits[0]; 
	$scope.project = $stateParams.project;
	
	//load location info
	$http({
		method: 'POST',
		url: "ajax/getLocationInfo.php",
		data: $.param({
				id: $stateParams.location
			}),
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).success(function(data){
		//Put location in scope
		$scope.location = data;
		
		//Set up map
		map = setMap.set(data.latitude, data.longitude);
		$scope.marker = L.marker([data.latitude, data.longitude]).addTo(map);
	
		//Set switches
		if($scope.location.toggle_comments == 'true'){
			$scope.location.toggle_comments = true;
		}else{
			$scope.location.toggle_comments = false;
		}
		if($scope.location.toggle_media == 'true'){
			$scope.location.toggle_media = true;
		}else{
			$scope.location.toggle_media = false;
		}
		if($scope.location.toggle_dig_deeper == 'true'){
			$scope.location.toggle_dig_deeper = true;
		}else{
			$scope.location.toggle_dig_deeper = false;
		}
		
		//Get media from mbira_media table --- nesting this probably not the best way to do it
		$http({
			method: 'POST',
			url: "ajax/getMedia.php",
			data: $.param({
						location_id: $stateParams.location
					}),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function(data){
			$scope.media = data;
		})
	})
	
	//Get file to be uploaded
	$scope.onFileSelect = function($files) {
		if($files.length > 1) {
			alert("Only upload one image for the thumbnail.");
		}else{
		  $scope.file = $files[0];		  
		}
	};
	
	//Submit media
	$scope.submitMedia = function(){
		$scope.upload = $upload.upload({
				url: 'ajax/saveMedia.php',
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: {location_id: $stateParams.location},
				file: $scope.file
			  }).success(function(data, status, headers, config) {
					//Get media from mbira_media table --- nesting this probably not the best way to do it
					$http({
						method: 'POST',
						url: "ajax/getMedia.php",
						data: $.param({
									location_id: $stateParams.location
								}),
						headers: {'Content-Type': 'application/x-www-form-urlencoded'}
					}).success(function(data){
						$scope.media = data;
					})
			  });
	}
	
	//Allow position to be changed
	$scope.editPosition = function(){
		//Open new position fields
		$scope.active = true;
		
		//Setup location search bar on map
		$scope.search = new L.Control.GeoSearch({
			provider: new L.GeoSearch.Provider.OpenStreetMap(),
			position: 'topcenter',
			showMarker: true,
			scope: $scope,
			location: $scope.location,
			map: map
		}).addTo(map);

		//Allow clicking to set marker and save location from click in scope
		map.on('click', function(e) {
			if($scope.marker != false){
				map.removeLayer($scope.marker);
				$scope.marker = false;
			}
			if($scope.search._positionMarker){
				map.removeLayer($scope.search._positionMarker);
			}
			$scope.location.latitude = e.latlng.lat;
			$scope.location.longitude = e.latlng.lng;
			
			$scope.marker = L.marker(e.latlng).addTo(map);
			$scope.$apply();
		});
	}
	
	//Handle "save and close"
	$scope.submit = function(){
		//Save
		$http({
			method: 'POST',
			url: "ajax/saveLocation.php",
			data: $.param({
						task: 'update',
						projectId: $scope.project,
						name: $scope.location.name,
						description: $scope.location.description,
						dig_deeper: $scope.location.dig_deeper,
						latitude: $scope.location.latitude,
						longitude: $scope.location.longitude,
						toggle_media: $scope.location.toggle_media,
						toggle_dig_deeper: $scope.location.toggle_dig_deeper,
						toggle_comments: $scope.location.toggle_comments
					}),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function(data){
			//Close (return to project)
			location.href = "#/viewProject/?project="+$stateParams.project;
		})
	}
	
	//Delete location
	$scope.delete = function(){
		$http({
		method: 'POST',
		url: "ajax/saveLocation.php",
		data: $.param({
				task: "delete",
				id: $stateParams.location
			}),
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function(data){
			//return to projecct
			location.href = "#/viewProject/?project="+$stateParams.project;
		})
	}
});

mbira.controller("singleAreaCtrl", function ($scope, $http, $state, $upload, $stateParams, setMap){

	//Copied form singleLocationCtrl but not done yet!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//Use singleLocationCtrl as a model for this

	var map;

	//load area info
	$http({
		method: 'POST',
		url: "ajax/getAreaInfo.php",
		data: $.param({
				id: $stateParams.area
			}),
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).success(function(data){
		//Put area in scope
		$scope.area = data;
		
		//Parse string to get array  of coorinates
		$scope.coordinates = JSON.parse(data.coordinates);
		
		//Set up map
		map = setMap.set($scope.coordinates[0][0], $scope.coordinates[0][1]);
		
		if(data.shape == 'polygon'){
			//Create polygon from array of coordinates 
			$scope.polygon = L.polygon($scope.coordinates).addTo(map);
		}else if(data.shape == 'circle'){
			//Create circle from coordinates
			$scope.circle = L.circle($scope.coordinates[0], data.radius, {
				color: 'red',
				fillColor: '#f03',
				fillOpacity: 0.5
			}).addTo(map);
		}
	})
	
	//Handle "save and close"
	$scope.submit = function(){
		//Save
		$http({
			method: 'POST',
			//saveArea.php only creates row, doesn't update or delete yet!!!!!
			url: "ajax/saveArea.php",
			data: $.param({
						task: 'update',
						projectId: $scope.project,
						name: $scope.area.name,
						description: $scope.area.description,
					}),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function(data){
			//Close (return to project)
			location.href = "#/viewProject/?project="+$stateParams.project;
		})
	}
	
	//Allow area to be changed --- NOT DONE!!!!!
	$scope.editArea = function(){
		//Open new position fields
		$scope.active = true;
		
		//Setup location search bar on map
		$scope.search = new L.Control.GeoSearch({
			provider: new L.GeoSearch.Provider.OpenStreetMap(),
			position: 'topcenter',
			showMarker: true,
			scope: $scope,
			location: $scope.location,
			map: map
		}).addTo(map);
	}
});

mbira.controller("singleProjectCtrl", function ($scope, $http, $stateParams){
	$scope.pid = $stateParams.pid;
	
	//Get single project info
	$http({
		method: 'POST',
		url: "ajax/getProjectInfo.php",
		data: $.param({
				id: $stateParams.project
			}),
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).success(function(data){
		//Set to scope
		$scope.project = data[0];
		$scope.locations = data[1];
		$scope.areas = data[2];
		$scope.explorations = data[3];
		console.log($scope.explorations);
	})
});

mbira.controller("viewProjectsCtrl", function ($scope, $http){
	//Get all projects
	$http({
		method: 'GET',
		url: "ajax/getProjects.php",
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).success(function(data){
		  $scope.projects = data;
	})
});

mbira.controller("newProjectCtrl", function ($scope, $http, $upload, $state){
	$scope.file;
	
	//model for new project
	$scope.newProject = {
	    name: "",
		descrition: "",
		file: ""
	}
	
	//Get file to be uploaded
	$scope.onFileSelect = function($files) {
		if($files.length > 1) {
			alert("Only upload one image for the thumbnail.");
		}else{
			$scope.file = $files[0];

			$scope.uploadFile = $upload.upload({
				url:'ajax/tempImg.php',
				method:"POST",
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				file: $scope.file
			}).success(function(data) {	
				$('.thumbnail .dropImg').css('display', 'none');
				$('.thumbnail h5').css('display', 'none');
				$('.thumbnail .clickAdd').css('display', 'none');
				$('.dropzone img').attr('src', 'images/temp.jpg?' + (new Date).getTime()) // forces img refresh	
			});
		}
	};
	
	//Submit new project
	$scope.submit = function() {
		$scope.upload = $upload.upload({
			url: 'ajax/saveProject.php',
			method: 'POST',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: {name: $scope.newProject.name, description: $scope.newProject.description},
			file: $scope.file
		}).success(function(data) {	
			//return to all projects page
			$state.go("projects");
		});
	}
});
mbira.controller("viewLocationsCtrl", function ($scope, $http){
	//Get all projects
	$http({
		method: 'GET',
		url: "ajax/getLocations.php",
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).success(function(data){
		  $scope.locations = data;
	})
});	
mbira.controller("newLocationCtrl", function ($scope, $http, $upload, $stateParams, setMap, $state){
	$scope.marker = false;
	$scope.ID = $stateParams.project;
	$scope.PID = $stateParams.pid;
	$scope.param = $stateParams.project;

	//new location model
	$scope.newLocation = {
		name: "",
		descrition: "",
		file: "",
		latitude: '',
		longitude: ''
	}
	
	//Get file to be uploaded
	$scope.onFileSelect = function($files) {
		if($files.length > 1) {
			alert("Only upload one image for the thumbnail.");
		}else{
		  $scope.file = $files[0];		  
		}
	};
	
	//submit new location
	$scope.submit = function() {		
		$scope.upload = $upload.upload({				
			url: 'ajax/saveLocation.php',
			method: 'POST',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: { 
					task: 'create',
					projectId: $scope.ID,
					pid: $stateParams.pid,
					name: $scope.newLocation.name,
					description: $scope.newLocation.description,
					lat: $scope.newLocation.latitude,
					lon: $scope.newLocation.longitude
				},
			file: $scope.file
		}).success(function(data) {
			//return to project
			location.href = "#/viewProject/?project="+$scope.ID+'&pid='+$scope.PID;
		});
	};
	
	//<MAP_STUFF>
	//initialize map
	var map = setMap.set(42.7404566603398, -84.5452880859375);

	//initialize search bar
	$scope.search = new L.Control.GeoSearch({
		provider: new L.GeoSearch.Provider.OpenStreetMap(),
		position: 'topcenter',
		showMarker: true,
		scope: $scope,
		location: $scope.newLocation,
		map: map
	}).addTo(map);

	//Click to set marker and save location to scope
	map.on('click', function(e) {
		if($scope.marker != false){
			map.removeLayer($scope.marker);
			$scope.marker = false;
		}
		if($scope.search._positionMarker){
			map.removeLayer($scope.search._positionMarker);
		}
		$scope.newLocation.latitude = e.latlng.lat;
		$scope.newLocation.longitude = e.latlng.lng;
		
		$scope.marker = L.marker(e.latlng).addTo(map);
		$scope.$apply();
	});
	//</MAP_STUFF>
});

mbira.controller("newAreaCtrl", function ($scope, $http, $upload, $stateParams, setMap){
	
	$scope.marker = false;
	$scope.mark = '';
	$scope.file;
	$scope.ID = $stateParams.project;
	$scope.PID = $stateParams.pid;
	$scope.markers = [];
	$scope.radius = '300';
	$scope.polygon = '';
	$scope.circle = '';

	//new area model
	$scope.newArea = {
		name: "",
		descrition: "",
		file:"",
		shape: "",
		radius: "",
		coordinates: []
	}
	
	//Get file to be uploaded
	$scope.onFileSelect = function($files) {
		if($files.length > 1) {
			alert("Only upload one image for the thumbnail.");
		}else{
			$scope.file = $files[0];

			$scope.uploadFile = $upload.upload({
				url:'ajax/tempImg.php',
				method:"POST",
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				file: $scope.file
			}).success(function(data) {	
				$('.thumbnail .dropImg').css('display', 'none');
				$('.thumbnail h5').css('display', 'none');
				$('.thumbnail .clickAdd').css('display', 'none');
				$('.dropzone img').attr('src', 'images/temp.jpg?' + (new Date).getTime()) // forces img refresh	
			});
		}
	};
	
	//submit new area
	$scope.submit = function() {
		$scope.upload = $upload.upload({
			url: 'ajax/saveArea.php',
			method: 'POST',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: {
				task: 'create',
				projectId: $scope.ID,
				name: $scope.newArea.name,
				description: $scope.newArea.description,
				shape: $scope.newArea.shape,
				radius: $scope.newArea.radius,
				coordinates: $scope.newArea.coordinates
			},
			file: $scope.file
		}).success(function(data, status, headers, config) {
			//return to project
			location.href = "#/viewProject/?project="+$scope.ID+'&pid='+$scope.PID;
		});
	};
	
	//Reset markers on map
	$scope.clearMarkers = function(){
		$scope.markers.forEach(function(mark){
			map.removeLayer(mark);
		})
		$scope.newArea.coordinates = [];
		$scope.markers = [];
		
		$scope.newArea.shape = '';
		
		map.removeLayer($scope.polygon);
		map.removeLayer($scope.circle);
	}
	
	//Create polygon out of multiple markers
	$scope.createPolygon = function(){
		//remove any markers and shapes already there
		$scope.markers.forEach(function(mark){
			map.removeLayer(mark);
		})
		map.removeLayer($scope.polygon);
		map.removeLayer($scope.circle);
		
		//Create polygon from array of coordinates 
		$scope.polygon = L.polygon($scope.newArea.coordinates).addTo(map);
		
		//reset array of markers
		$scope.markers = [];
		
		//set shape
		$scope.newArea.shape = 'polygon';
	}
	
	//Create polygon out of single marker
	$scope.createCircle = function(radius){
		//remove any markers and shapes already there
		$scope.markers.forEach(function(mark){
			map.removeLayer(mark);
		})
		map.removeLayer($scope.polygon);
		map.removeLayer($scope.circle);
		
		//create circle from coordinate
		$scope.circle = L.circle($scope.newArea.coordinates[0], radius, {
			color: 'red',
			fillColor: '#f03',
			fillOpacity: 0.5
		}).addTo(map);
		
		$scope.newArea.radius = radius;
		
		//reset array of markers
		$scope.markers = [];
		
		//set shape
		$scope.newArea.shape = 'circle';
	}
	
	//<MAP_STUFF>
	//initialize map
	var map = setMap.set(42.7404566603398, -84.5452880859375);

	//initialize search bar
	$scope.search = new L.Control.GeoSearch({
		provider: new L.GeoSearch.Provider.OpenStreetMap(),
		position: 'topcenter',
		showMarker: false,
		scope: $scope,
		location: $scope.mark,
		map: map
	}).addTo(map);

	//Click to set marker and save location to scope
	map.on('click', function(e) {
		$scope.newArea.coordinates.push([e.latlng.lat, e.latlng.lng]);
		var marker = L.marker(e.latlng).addTo(map);
		marker.bindPopup(e.latlng.lat+", "+e.latlng.lng);
		$scope.markers.push(marker);
		$scope.$apply(); 
	});
	
	//</MAP_STUFF>
});

mbira.controller("viewExplorationsCtrl", function ($scope, $http){
	//Get all projects
	$http({
		method: 'GET',
		url: "ajax/getExplorations.php",
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).success(function(data){
		  $scope.explorations = data;
	})
});	
mbira.controller("newExplorationCtrl", function ($scope, $http, $upload, $stateParams, setMap, $state){
	$scope.marker = false;
	$scope.places = [];
	$scope.ID = $stateParams.project;
	$scope.PID = $stateParams.pid;
	$scope.param = $stateParams.project;

	//new location model
	$scope.newExploration = {
		name: "",
		descrition: "",
		file: "",
		latitude: '',
		longitude: ''
	}
	
	//Get file to be uploaded
	$scope.onFileSelect = function($files) {
		if($files.length > 1) {
			alert("Only upload one image for the thumbnail.");
		}else{
			$scope.file = $files[0];

			$scope.uploadFile = $upload.upload({
				url:'ajax/tempImg.php',
				method:"POST",
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				file: $scope.file
			}).success(function(data) {	
				$('.thumbnail .dropImg').css('display', 'none');
				$('.thumbnail h5').css('display', 'none');
				$('.thumbnail .clickAdd').css('display', 'none');
				$('.dropzone img').attr('src', 'images/temp.jpg?' + (new Date).getTime()) // forces img refresh	
			});
		}
	};
	
	//submit new exploration
	$scope.submit = function() {		
		var direction = '';
		for (i=0;i<$scope.places.length; i++){
			direction += $scope.places[i][0] + ",";
			if (i === $scope.places.length-1){
				direction = direction.substr(0,direction.length-1);
			}
		}
		console.log(direction);
		$scope.upload = $upload.upload({				
			url: 'ajax/saveExploration.php',
			method: 'POST',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: { 
					task: 'create',
					projectId: $scope.ID,
					pid: $stateParams.pid,
					name: $scope.newExploration.name,
					description: $scope.newExploration.description,
					direction: direction,
				},
			file: $scope.file
		}).success(function(data) {
			//return to project
			console.log("horray");
			location.href = "#/viewProject/?project="+$scope.ID+'&pid='+$scope.PID;
		});
	};
	
	//<MAP_STUFF>
	//initialize map
	var map = setMap.set(42.723241200224216, -84.47797000408173);
	LatLng=[];
	var locArray=[];
	var expArray=[];
	var polyline = L.polyline(LatLng, {color: 'red'}).addTo(map);
	
	function removeFromLine(passedArray) {
		var latslngs=polyline.getLatLngs();
		var newlatlng=[];
		var newExpArray = [];
		for(q=0;q<latslngs.length;q++){
			if (latslngs[q].lat !== parseFloat(passedArray[0]) && latslngs[q].lng !== parseFloat(passedArray[1])){
				newlatlng.push([latslngs[q].lat,latslngs[q].lng]);
				for (m=0; m < locArray.length; m++) {
					if(latslngs[q].lat === parseFloat(locArray[m][0]) && latslngs[q].lng === parseFloat(locArray[m][1])) {
						newExpArray.push([locArray[m][2],locArray[m][3]]);
					}
				}
			} 
		}
		expArray = newExpArray;
		$scope.places = expArray;
		$scope.$apply();
		polyline.setLatLngs(newlatlng);
	}
	
	function createNewLine() {
		newlatlng= [];
		for(h=0; h<expArray.length; h++){
			for (i=0; i < locArray.length; i++) {
				if (locArray[i][2] === expArray[h][0]){
					newlatlng.push([parseFloat(locArray[i][0]),parseFloat(locArray[i][1])]);
				}
			}
		}
		polyline.setLatLngs(newlatlng);
	}
	
	function inExpCheck(checkArray) {
		for(j=0;j<expArray.length;j++){
			if (expArray[j][0] === checkArray[2]) {
				removeFromLine(checkArray);
				return 0;
			} 
		}
		return 1;
	}

	$http({
		method: 'GET',
		url: "ajax/getLocations.php",
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).success(function(data){
		for(i=0;i<data.length;i++) {
		  	if (data[i]['project_id'] == $scope.param) {
		  		locArray.push([data[i]['latitude'],data[i]['longitude'], data[i]['id'], data[i]['name']]);

				L.marker([data[i]['latitude'], data[i]['longitude']]).addTo(map)
					.bindPopup('<img style="width:50px;height:50px;" src="images/'+data[i]['file_path']+'"></br>' + data[i]['name'])
					.on('mouseover', function(e) {
					  	//open popup;
						this.openPopup();	
					})
					.on('mouseout', function(e) {
					  	//close popup;
						this.closePopup();	
					})
					.on('click', function(e) {
					  	//store in exploration;
					  	for (i=0; i < locArray.length; i++) {
					  		//finds the id of the coordinates and checks if it has already been added to exploration..
					  		if (e.latlng.lat == locArray[i][0] && e.latlng.lng == locArray[i][1] && inExpCheck(locArray[i])) {
								polyline.addLatLng([parseFloat(locArray[i][0]),parseFloat(locArray[i][1])]);
					  			expArray.push([locArray[i][2],locArray[i][3]]);
							 	$scope.places = expArray;
								$scope.$apply();
								$('#done').css('display', 'block');
					  		}
					  	}
						this.closePopup();	//makes sure the popup doesn't show on click.
					});
			}
		}
	});
	
	$http({
		method: 'GET',
		url: "ajax/getAreas.php",
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).success(function(data){
		for(i=0;i<data.length;i++) {
			if (data[i]['project_id'] == $scope.param) {

				//Put area in scope
				$scope.area = data[i];
				
				//Parse string to get array  of coorinates
				$scope.coordinates = JSON.parse(data[i].coordinates);
				
				if(data[i].shape == 'polygon'){
					//Create polygon from array of coordinates 
					$scope.polygon = L.polygon($scope.coordinates).addTo(map)
						.bindPopup('<img style="width:50px;height:50px;" src="images/'+data[i]['file_path']+'"></br>' + data[i]['name'])
						.on('mouseover', function(e) {
							//open popup;
							this.openPopup();	
						})
						.on('mouseout', function(e) {
							//close popup;
							this.closePopup();	
						})
						.on('click', function(e) {
							//store in exploration;
							console.log("At least I have something");
							this.closePopup();	//makes sure the popup doesn't show on click.
						});
				}else if(data[i].shape == 'circle'){
					//Create circle from coordinates
					$scope.circle = L.circle($scope.coordinates[0], data[i].radius, {
						color: 'red',
						fillColor: '#f03',
						fillOpacity: 0.5
					}).addTo(map)
						.bindPopup('<img style="width:50px;height:50px;" src="images/'+data[i]['file_path']+'"></br>' + data[i]['name'])
						.on('mouseover', function(e) {
							//open popup;
							this.openPopup();	
						})
						.on('mouseout', function(e) {
							//close popup;
							this.closePopup();	
						});
				}
			}
		}
	});
	
	
	
	
	
	

	//initialize search bar
	$scope.search = new L.Control.GeoSearch({
		provider: new L.GeoSearch.Provider.OpenStreetMap(),
		position: 'topcenter',
		showMarker: true,
		scope: $scope,
		location: $scope.newExploration,
		map: map
	}).addTo(map);
	
	//Click to set marker and save location to scope
	$("#done").on('click', function(e) {
		$('#done').fadeOut('slow', function() {
			$('#done').remove();
			$('.exp_info').fadeIn('slow', function(){
				$('html,body').animate({scrollTop: $('.exp_info').offset().top}, 1500);
			});
		});
	});
	//</MAP_STUFF>

	$scope.onSort = function(){
		createNewLine();
	};


});