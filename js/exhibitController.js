mbira.controller("viewExhibitsCtrl", function ($scope, $http, makeArray){
	//Get all exhibits
	$http({
		method: 'GET',
		url: "ajax/getExhibits.php",
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).success(function(data){
		$scope.data = data;
		
		//Get all projects
		$http({
			method: 'GET',
			url: "ajax/getProjects.php",
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function(data2){
			for(i=0;i<data2.length;i++){
			  	exhArray = makeArray.make(data2[i].id, $scope);
			  	data2[i].exhibits = exhArray;
			}
			$scope.projects = data2;
			console.log($scope.projects);
		})
	})
});	

mbira.controller("newExhibitCtrl", function ($scope, $http, $upload, $stateParams, setMap, $state){
	$scope.ID = $stateParams.project;
	$scope.PID = $stateParams.pid;
	$scope.param = $stateParams.project;

	//new location model
	$scope.newExhibit = {
		name: "",
		descrition: "",
		file: "",
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
	
	//submit new exhibit
	$scope.submit = function() {
		$scope.upload = $upload.upload({				
			url: 'ajax/saveExhibit.php',
			method: 'POST',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: { 
					task: 'create',
					projectId: $scope.ID,
					pid: $stateParams.pid,
					name: $scope.newExhibit.name,
					description: $scope.newExhibit.description,
				},
			file: $scope.file
		}).success(function(data) {
			// return to project
			location.href = "#/viewProject/?project="+$scope.ID+'&pid='+$scope.PID;
		});
	};
	
});

mbira.controller("singleExhibitCtrl", function ($scope, $http, $upload, $stateParams, setMap, $state){
	$scope.newMedia = false;
	$scope.ID = $stateParams.project;
	$scope.PID = $stateParams.pid;
	$scope.EXHIBITID = $stateParams.exhibit
	$scope.exhibit = {};
	$scope.previous = $stateParams.previous
	$scope.locations;

	$scope.marker = false;

	$scope.places = [];
	var LatLng=[];
	var mapPoints = [];
	var map;
	
	$scope.exhibit = {
		name: "",
		descrition: "",
		file: "",
	}	

	//load exhibit info
	$http({
		method: 'POST',
		url: "ajax/getExhibitInfo.php",
		data: $.param({
				id: $stateParams.exhibit
			}),
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).success(function(data){
		//Put exhibit in scope
		$scope.exhibit = data;
	})
	
	//Set up map
	map = setMap.set(42.7404566603398, -84.5452880859375);

	$http({
		method: 'POST',
		url: "ajax/inExhibit.php",
		data: $.param({
					task: 'getAll',
					exhibit: $stateParams.exhibit,
				}),
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).success(function(data){
		$scope.locations = data[0];
		for(i=0;i<$scope.locations.length;i++) {
			mapPoint = [$scope.locations[i]['latitude'], $scope.locations[i]['longitude']];
			mapPoints.push(mapPoint)
			L.marker(mapPoint).addTo(map)
				.bindPopup('<img style="width:50px;height:50px;" src="images/'+$scope.locations[i]['thumb_path']+'"></br>' + $scope.locations[i]['name'])
				.on('mouseover', function(e) {
					//open popup;
					this.openPopup();	
				})
				.on('mouseout', function(e) {
					//close popup;
					this.closePopup();	
				})
				.on('click', function(e) {
					thisID = '';
					for(i=0;i<$scope.locations.length;i++) {
						if (this._latlng.lat === parseFloat($scope.locations[i]['latitude']) && this._latlng.lng === parseFloat($scope.locations[i]['longitude'])){
							thisID = $scope.locations[i]['id']
						}
					}
					
					location.href = "#/viewLocation/?project="+$scope.ID+'&pid='+$scope.PID+'&location='+thisID+'&previous=EXHIBIT';
				});
		}

		$scope.areas = data[1];
		console.log(data[1])
		for(i=0;i<$scope.areas.length;i++) {
				//Put area in scope
				
				//Parse string to get array  of coorinates
				areaCoordinates = JSON.parse($scope.areas[i].coordinates);
				for(j=0;j<areaCoordinates.length;j++){
					mapPoints.push(areaCoordinates[j])
				}

				if($scope.areas[i].shape == 'polygon'){
					//Create polygon from array of coordinates 
					$scope.polygon = L.polygon(areaCoordinates).addTo(map)
						.bindPopup('<img style="width:50px;height:50px;" src="images/'+$scope.areas[i]['thumb_path']+'"></br>' + $scope.areas[i]['name'])
						.on('mouseover', function(e) {
							//open popup;
							this.openPopup();	
						})
						.on('mouseout', function(e) {
							//close popup;
							this.closePopup();	
						})
						.on('click', function(e) {
							thisID = '';
							console.log(this._latlngs)
							for(i=0;i<$scope.areas.length;i++) {
								if (this._latlngs[0].lat === parseFloat(JSON.parse($scope.areas[i].coordinates)[0][0]) && this._latlngs[0].lng === parseFloat(JSON.parse($scope.areas[i].coordinates)[0][1])){
									thisID = $scope.areas[i]['id']
								}
							}
							
							location.href = "#/viewArea/?project="+$scope.ID+'&pid='+$scope.PID+'&area='+thisID+'&previous=EXHIBIT';
						});
				}else if($scope.areas[i].shape == 'circle'){
					//Create circle from coordinates
					$scope.circle = L.circle(areaCoordinates[0], $scope.areas[i].radius, {
						color: 'red',
						fillColor: '#f03',
						fillOpacity: 0.5
					}).addTo(map)
						.bindPopup('<img style="width:50px;height:50px;" src="images/'+$scope.areas[i]['thumb_path']+'"></br>' + $scope.areas[i]['name'])
						.on('mouseover', function(e) {
							//open popup;
							this.openPopup();	
						})
						.on('mouseout', function(e) {
							//close popup;
							this.closePopup();	
						})
						.on('click', function(e) {
							thisID = '';
							console.log(this._latlngs)
							for(i=0;i<$scope.areas.length;i++) {
								if (this._latlng.lat === parseFloat(JSON.parse($scope.areas[i].coordinates)[0][0]) && this._latlng.lng === parseFloat(JSON.parse($scope.areas[i].coordinates)[0][1])){
									thisID = $scope.areas[i]['id']
								}
							}
							
							location.href = "#/viewArea/?project="+$scope.ID+'&pid='+$scope.PID+'&area='+thisID+'&previous=EXHIBIT';
						});
				}
		}
		map.fitBounds(mapPoints);

	})
	
	$scope.subview = "before";
	$scope.toggleSubview = function() {
		if ( $scope.subview === "before" ) {
			$scope.subview = "after";
		} else {
			$scope.subview = "before";
		}
	}

	
});

mbira.controller("exhibitInfoCtrl", function ($scope, $http, $upload, $stateParams, $state){
	$scope.project = $stateParams.project;
	$scope.pid = $stateParams.pid;
	$scope.id = $stateParams.exhibit;
	$scope.exhibit = {};
	$scope.file;
	
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
				$('.dropzone img').attr('src', 'images/temp.jpg?' + (new Date).getTime()) // forces img refresh	
			});
		}
	};

	//load exhibit info
	$http({
		method: 'POST',
		url: "ajax/getExhibitInfo.php",
		data: $.param({
				id: $stateParams.exhibit
			}),
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).success(function(data){
		//Put exhibit in scope
		$scope.exhibit = data;
		$('.dropzone img').attr('src', 'images/'+ $scope.exhibit.thumb_path )
	})
	
	//Handle "save and close"
	$scope.submit = function(){
		//Save		
		$scope.upload = $upload.upload({				
			url: 'ajax/saveExhibit.php',
			method: 'POST',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: { 
					task: 'update',
					id: $stateParams.exhibit,
					name: $scope.exhibit.name,
					description: $scope.exhibit.description,
					path: $scope.exhibit.thumb_path
				},
			file: $scope.file
		}).success(function(data) {
			// return to project
			location.href = "javascript:history.back()";
		});
	}
	
	//Delete exhibit
	$scope.delete = function(){
		$http({
		method: 'POST',
		url: "ajax/saveExhibit.php",
		data: $.param({
				task: "delete",
				id: $stateParams.exhibit
			}),
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function(data){
			//return to projecct
			location.href = "#/viewProject/?project="+$scope.project+'&pid='+$scope.pid;
		})
	}

});