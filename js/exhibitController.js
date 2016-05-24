mbira.controller("viewExhibitsCtrl", function ($scope, $http, makeArray, projects, exhibits){
	//Get all exhibits
	exhibits.getAll().success(function(data){
		$scope.data = data
		//Get all projects
		projects.getAll().success(function(data2){
			for(i=0;i<data2.length;i++){
			  	exhArray = makeArray.make(data2[i].id, $scope);
			  	data2[i].exhibits = exhArray;
			}
			$scope.projects = data2;
		})
	})
});

mbira.controller("newExhibitCtrl", function ($scope, $http, $upload, $stateParams, setMap, $state, projects, temporary, exhibits){
	$scope.projectId = $stateParams.project;
	$scope.PID = $stateParams.pid;

	projects.get($stateParams.project).success(function(data) {
        $scope.project = data[0][2];
    });

	//new location model
	$scope.newExhibit = {
		name: "",
		description: "",
		file: "",
	}

	//Get file to be uploaded
	$scope.onFileSelect = function($files) {
		$scope.file = $files[0];
		temporary.thumbnail($files).success(function(data) {
			$('.thumbnail .dropImg, .thumbnail h5, .thumbnail .clickAdd').css('display', 'none');
			$('.thumbnail img').attr('src', 'tmp/temp.jpg?' + (new Date).getTime()) // forces img refresh
		});
	};

	//Get header to be uploaded
	$scope.onHeaderSelect = function($files) {
		$scope.header = $files[0];
		temporary.header($files).success(function(data) {
			// $scope.images.unshift($scope.file);
			$('.thumbnail-header img').attr('src', 'tmp/temp_header.jpg?' + (new Date).getTime()) // forces img refresh
		});
	};

	//submit new exhibit
	$scope.submit = function() {
		exhibits.save($scope.file, {
			task: 'create',
			projectId: $scope.projectId,
			pid: $stateParams.pid,
			name: $scope.newExhibit.name,
			description: $scope.newExhibit.description,
		}).success(function(data) {
			// return to project
			exhibits.save($scope.header, {task: 'uploadHeader', id: data, project: $scope.projectId});
			location.href = "#/viewProject/?project="+$scope.projectId+'&pid='+$scope.PID;
		});
	};

});

mbira.controller("singleExhibitCtrl", function ($scope, $http, $upload, $stateParams, setMap, $state, projects, exhibits, ip){
	$scope.newMedia = false;
	$scope.projectId = $stateParams.project;
	$scope.PID = $stateParams.pid;
	$scope.EXHIBITID = $stateParams.exhibit
	$scope.exhibit = {};
	$scope.previous = $stateParams.previous
	$scope.locations;

	projects.get($stateParams.project).success(function(data) {
        $scope.project = data[0][2];
    });

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
	exhibits.get($stateParams.exhibit).success(function(data){
		//Put exhibit in scope
		$scope.exhibit = data;
	})

	var newIcon = L.icon({
		iconUrl: 'js/images/LocationMarker.svg',
		iconSize:     [30, 40], // size of the icon
		iconAnchor:   [13, 38], // point of the icon which will correspond to marker's location
		popupAnchor:  [1, -40]
	});

	//Set up map
	ip.get().success(function(loc) {
		map = setMap.set(loc.latitude, loc.longitude);

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
				L.marker(mapPoint, {icon: newIcon}).addTo(map)
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

						location.href = "#/viewLocation/?project="+$scope.projectId+'&pid='+$scope.PID+'&location='+thisID+'&previous=EXHIBIT';
					});
			}

			$scope.areas = data[1];
			// console.log(data[1])
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

								location.href = "#/viewArea/?project="+$scope.projectId+'&pid='+$scope.PID+'&area='+thisID+'&previous=EXHIBIT';
							});
					}
			}
			mapPoints.length > 0 ? map.fitBounds(mapPoints) : null;
			

		})
	});

	$scope.subview = "before";
	$scope.toggleSubview = function() {
		$scope.subview === "before" ? $scope.subview = "after" : $scope.subview = "before";
	}
});

mbira.controller("exhibitInfoCtrl", function ($scope, $http, $upload, $stateParams, $state, temporary, exhibits){
	$scope.project = $stateParams.project;
	$scope.pid = $stateParams.pid;
	$scope.id = $stateParams.exhibit;
	$scope.exhibit = {};
	$scope.file;

	//Get file to be uploaded
	$scope.onFileSelect = function($files) {
		$scope.file = $files[0];
		temporary.thumbnail($files).success(function(data) {
			$('.thumbnail img').attr('src', 'tmp/temp.jpg?' + (new Date).getTime()) // forces img refresh
		});
	};

	//Get header to be uploaded
	$scope.onHeaderSelect = function($files) {
		$scope.header = $files[0];
		temporary.header($files).success(function(data) {
			// $scope.images.unshift($scope.file);
			$('.thumbnail-header img').attr('src', 'tmp/temp_header.jpg?' + (new Date).getTime()) // forces img refresh
		});
	};

	//load exhibit info
	exhibits.get($stateParams.exhibit).success(function(data){
		//Put exhibit in scope
		$scope.exhibit = data;
		$('.thumbnail img').attr('src', $scope.exhibit.thumb_path )
		$('.thumbnail-header img').attr('src', $scope.exhibit.header_image_path )
	})

	//Handle "save and close"
	$scope.submit = function(){
		//Save
		exhibits.save($scope.file , {
			task: 'update',
			id: $stateParams.exhibit,
			project: $scope.project,
			name: $scope.exhibit.name,
			description: $scope.exhibit.description,
			path: $scope.exhibit.thumb_path
		}).success(function(data) {
			// return to project
			$scope.header ? exhibits.save($scope.header, {task: 'uploadHeader', id: $stateParams.exhibit, project: $scope.project}) : null;
			location.href = "javascript:history.back()";
		});
	}

	//Delete exhibit
	$scope.delete = function(){
		exhibits.delete($stateParams.exhibit, $scope.project).success(function(data){
			//return to projecct
			location.href = "#/viewProject/?project="+$scope.project+'&pid='+$scope.pid;
		})
	}

});
