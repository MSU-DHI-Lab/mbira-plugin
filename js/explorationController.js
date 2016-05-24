mbira.controller("viewExplorationsCtrl", function ($scope, $http, makeArray, explorations, projects){
	explorations.getAll().success(function(data){
		$scope.data = data;
		//Get all projects
		projects.getAll().success(function(data2){
			for(i=0;i<data2.length;i++){
			  	expArray = makeArray.make(data2[i].id, $scope);
			  	data2[i].explorations = expArray;
			}
			$scope.projects = data2;
		})
	})
});
mbira.controller("newExplorationCtrl", function ($scope, $http, $upload, $stateParams, setMap, $state, projects, temporary, explorations){
	$scope.marker = false;
	$scope.places = [];
	$scope.projectId = $stateParams.project;
	$scope.PID = $stateParams.pid;
	$scope.total = 0;
	$scope.images = [];

	projects.get($stateParams.project).success(function(data) {
        $scope.project = data[0][2];
    });

	//new location model
	$scope.newExploration = {
		name: "",
		description: "",
		file: "",
		latitude: '',
		longitude: '',
		toggle_comments: true
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

	//submit new exploration
	$scope.submit = function() {	console.log
		var direction = '';
		for (i=0;i<$scope.places.length; i++){
			direction += $scope.places[i][0] + ",";
			if (i === $scope.places.length-1){
				direction = direction.substr(0,direction.length-1);
			}
		}
		explorations.save($scope.file, {
			task: 'create',
			projectId: $scope.projectId,
			pid: $stateParams.pid,
			name: $scope.newExploration.name,
			description: $scope.newExploration.description,
			direction: direction,
			toggle_comments: $scope.newExploration.toggle_comments
		}).success(function(data) {
			//return to project
			console.log(data)
			$scope.header ? explorations.save($scope.header, {task: 'uploadHeader', id: data, project: $scope.projectId}) : null;
			location.href = "#/viewProject/?project="+$scope.projectId+'&pid='+$scope.PID;
		});
	};

	//<MAP_STUFF>
	//initialize map
	var map = setMap.set(42.723241200224216, -84.47797000408173);
	LatLng=[];
	var locArray=[];
	var areaArray=[]
	var expArray=[];
	$scope.coordinates = []
	var polyline = L.polyline(LatLng, {color: 'red'}).addTo(map);

	var newIcon = L.icon({
		iconUrl: 'js/images/LocationMarker.svg',
		iconSize:     [30, 40], // size of the icon
		iconAnchor:   [13, 38], // point of the icon which will correspond to marker's location
		popupAnchor:  [1, -40]
	});

	var selectedIcon = L.icon({
		iconUrl: 'js/images/LocationMarker.svg',
		iconSize:     [30, 45], // size of the icon
		iconAnchor:   [13, 40], // point of the icon which will correspond to marker's location
		popupAnchor:  [1, -40]
	});

	function removeFromLine(passedArray, objectToCheck) {
		var latslngs=polyline.getLatLngs();
		for(q=0;q<latslngs.length;q++){  																						//for every latitude longitude pair
			if (passedArray.length === 4){																						//if a location array is passed
				if (latslngs[q].lat === parseFloat(passedArray[0]) && latslngs[q].lng === parseFloat(passedArray[1])){			//	find index of coordinates to remove
					latslngs.splice(q,1)																						// remove coordinates from polyline
					for (m=0; m < expArray.length; m++) {
						if(expArray[m][0] === passedArray[2]) {																	//find marker in expArray
							expArray.splice(m, 1);																				// remove marker from expArray
						}
					}
				}
			} else { //an area array is passed
				if (latslngs[q].lat === objectToCheck.getBounds().getCenter().lat && latslngs[q].lng === objectToCheck.getBounds().getCenter().lng){
					latslngs.splice(q,1)																						// remove coordinates from polyline
					for (m=0; m < expArray.length; m++) {
						if(expArray[m][0] === 'A' + passedArray[1]) {																	//find marker in expArray
							expArray.splice(m, 1);																				// remove marker from expArray
						}
					}
				}
			}
		}
		$scope.places = expArray;
		$scope.$apply();
		polyline.setLatLngs(latslngs);
	}

	function createNewLine() {
		console.log(locArray)
		newlatlng= [];
		for(h=0; h<expArray.length; h++){
			if (expArray[h][0].indexOf("A") >=0) {
				for (i=0; i < areaArray.length; i++) {
					if ('A' + areaArray[i][1] === expArray[h][0]){
						newlatlng.push(L.polygon(JSON.parse(areaArray[i][0])).getBounds().getCenter());
					}
				}
			}else {
				for (i=0; i < locArray.length; i++) {
					if (locArray[i][2] === expArray[h][0]){
						newlatlng.push([parseFloat(locArray[i][0]),parseFloat(locArray[i][1])]);
					}
				}
			}
		}
		polyline.setLatLngs(newlatlng);
	}

	function inExpCheck(checkArray, objectToCheck) {
		for(j=0;j<expArray.length;j++){
			if (checkArray.length === 4){				//is a locArray
				if (expArray[j][0] === checkArray[2]) {
					removeFromLine(checkArray, objectToCheck);
					return 0;
				}
			} else {     //is an areaArray
				if (expArray[j][0] === 'A'+checkArray[1]) {
					removeFromLine(checkArray, objectToCheck);
					return 0;
				}
			}
		}
		return 1;
	}

	$http({
		method: 'POST',
		url: "ajax/getLocationsByProjectId.php",
		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		data: $.param({'id': $scope.projectId})
	}).success(function(data){
		$scope.total += data.length;
		for(i=0;i<data.length;i++) {
		  	if (data[i]['project_id'] == $scope.projectId) {
		  		locArray.push([data[i]['latitude'],data[i]['longitude'], data[i]['id'], data[i]['name']]);
				$scope.coordinates.push([data[i]['latitude'],data[i]['longitude']])

				L.marker([data[i]['latitude'], data[i]['longitude']], {icon: newIcon}).addTo(map)
					.bindPopup('<img style="width:50px;height:50px;" src="'+data[i]['thumb_path']+'"></br>' + data[i]['name'])
					.on('mouseover', function(e) {
					  	//open popup;
						this.openPopup();
					})
					.on('mouseout', function(e) {
					  	//close popup;
						this.closePopup();
					})
					.on('click', function(e) {
						if(this.options.icon.options.iconUrl == "js/images/LocationMarker.svg") {
							this.setIcon(selectedIcon);
						} else {
							this.setIcon(newIcon);
						}

					  	//store in exploration;
					  	for (i=0; i < locArray.length; i++) {
					  		//finds the id of the coordinates and checks if it has already been added to exploration..
					  		if (e.latlng.lat == locArray[i][0] && e.latlng.lng == locArray[i][1] && inExpCheck(locArray[i], this)) {

								polyline.addLatLng([parseFloat(locArray[i][0]),parseFloat(locArray[i][1])]);
					  			expArray.push([locArray[i][2],locArray[i][3]]);
							 	$scope.places = expArray;
								$scope.$apply();
								$scope.places.length >= 2 ? $('#done').css('display', 'block') : $('#done').css('display', 'none');
					  		}
					  	}
						this.closePopup();	//makes sure the popup doesn't show on click.
					});
			}
		}
		map.fitBounds($scope.coordinates)
	});

	$http({
		method: 'POST',
		url: "ajax/getAreasByProjectId.php",
		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		data: $.param({'id': $scope.projectId})
	}).success(function(data){
		$scope.total += data.length;
		for(i=0;i<data.length;i++) {
			if (data[i]['project_id'] == $scope.projectId) {
				areaArray.push([data[i]['coordinates'], data[i]['id'], data[i]['name']]);
				//Put area in scope
				$scope.area = data[i];

				//Parse string to get array  of coorinates
				coordinates = JSON.parse(data[i].coordinates);
				$scope.coordinates.push(JSON.parse(data[i].coordinates))

				if(data[i].shape == 'polygon'){
					//Create polygon from array of coordinates
					$scope.polygon = L.polygon(coordinates).addTo(map)
						.bindPopup('<img style="width:50px;height:50px;" src="'+data[i]['thumb_path']+'"></br>' + data[i]['name'])
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
							for (i=0; i < areaArray.length; i++) {
								//finds the id of the coordinates and checks if it has already been added to exploration..
								if (this._latlngs[0].lat == parseFloat((JSON.parse(areaArray[i][0]))[0][0]) && this._latlngs[0].lng == parseFloat((JSON.parse(areaArray[i][0]))[0][1]) && inExpCheck(areaArray[i],this)) {
									polyline.addLatLng(this.getBounds().getCenter());

									expArray.push(['A'+areaArray[i][1],areaArray[i][2]]);
									$scope.places = expArray;
									$scope.$apply();
									console.log($scope.places.length);
									if($scope.places.length >= 2) {
										$('#done').css('display', 'block');
									} else {
										$('#done').css('display', 'none');
									}
								}
							}
							this.closePopup();
						});
				}
			}
		}
		map.fitBounds($scope.coordinates)
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
	$scope.done = function() {
		$('#done').fadeOut('slow', function() {
			$('#done').remove();
			$('.exp_info').fadeIn('slow', function(){
				$('html,body').animate({scrollTop: $('.exp_info').offset().top}, 1500);
			});
		});
	};

	$scope.modalOk = function() {
		$state.go('viewProject',{"project": $scope.projectId, "pid":$scope.PID});
	}

	//</MAP_STUFF>

	$scope.onSort = function(){
		createNewLine();
	};

	$("#editStops").on('click', function(e) {
		$('html,body').animate({scrollTop: $('.header').offset().top}, 1500);
		return false;
	});

	$scope.removeThis = function() {
		for (i=0;i<$scope.places.length;i++) {
			if (this.place[0] == $scope.places[i][0]) {
				$scope.places.splice(i,1)
				break;
			}
		}
		createNewLine();
	}

});
mbira.controller("singleExplorationCtrl", function ($scope, $http, $upload, $stateParams, setMap, $state, timeStamp, projects, temporary, explorations){
	$scope.projectId = $stateParams.project;
	$scope.pid = $stateParams.pid;
	$scope.previous = $stateParams.previous
	$scope.comments = []
	$scope.userData = []

	$scope.marker = false;
	$scope.places = [];
	$scope.coordinates = [];
	var LatLng=[];
	var locArray = [];
	var areaArray = [];
	var expArray=[];

	var map;
	var polyline;

	projects.get($stateParams.project).success(function(data) {
        $scope.project = data[0][2];
    });

	$scope.exploration = {
		name: "",
		descrition: "",
		file: "",
		latitude: '',
		longitude: ''
	}

	function checkIfHasReply(objToPushTo, idToCheck,data){
		for(j=0;j<data.length;j++){
			if (idToCheck == data[j].replyTo) {
				name = idToUser(data[j]);
				date = timeStamp.toDate(data[j].timeStamp) + " | " + timeStamp.toTime(data[j].timeStamp)
				tempObj = {comment_id:data[j].id, user:name, date:date,comment:data[j].comment, replies:[]};
				objToPushTo.replies.push(tempObj);
			}
		}
		for(h=0;h<objToPushTo.replies.length;h++) {
			checkIfHasReply(objToPushTo.replies[h],objToPushTo.replies[h].comment_id,data);
		}
	}

	function idToUser(commentData){
		for(q=0;q<$scope.userData.length;q++){					//match user_id of comment or reply to name
			if ($scope.userData[q].id === commentData.user_id){
				return $scope.userData[q].firstName + " " + $scope.userData[q].lastName;
			}
		}
	}

	function loadComments(userData) {//load comments
		$http({
			method: 'POST',
			url: "ajax/getComments.php",
			data: $.param({
					id: $stateParams.exploration,
					type: 'exploration'
				}),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function(data){
			data.sort(function(x, y){
				if ( x.replyTo - y.replyTo === 0){
					return y.timeStamp - x.timeStamp
				} else {
					return y.replyTo - x.replyTo;
				}
			})
			for(i=0;i<data.length;i++){
				if (data[i].replyTo == 0){
					name = idToUser(data[i]);
					date = timeStamp.toDate(data[i].timeStamp) + " | " + timeStamp.toTime(data[i].timeStamp)
					tempObj = {comment_id:data[i].id, user:name, date:date,comment:data[i].comment, replies:[]}
					$scope.comments.push(tempObj)
				}
			}
			for(i=0;i<$scope.comments.length;i++){
				checkIfHasReply($scope.comments[i], $scope.comments[i].comment_id, data)
			}

		})
	}

	var newIcon = L.icon({
		iconUrl: 'js/images/LocationMarker.svg',
		iconSize:     [30, 40], // size of the icon
		iconAnchor:   [13, 38], // point of the icon which will correspond to marker's location
		popupAnchor:  [1, -40]
	});

	$http({
		method: 'POST',
		url: "ajax/getUsers.php",
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).success(function(data){
		$scope.userData = data;
		loadComments(data);
	})

	//load exploration info
	$http({
		method: 'POST',
		url: "ajax/getExplorationInfo.php",
		data: $.param({
				id: $stateParams.exploration
			}),
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).success(function(data){
		//Put location in scope
		// Caution: The following lines of code are gross
		$scope.exploration = data;
		areaLocArray = data['direction'].split(',');
		$http({
			method: 'GET',
			url: "ajax/getLocations.php",
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function(data2){
			locArray = data2;
			$http({
					method: 'GET',
					url: "ajax/getAreas.php",
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				}).success(function(data3){
					areaArray = data3;
					for(i=0;i<areaLocArray.length;i++){
						if (areaLocArray[i].indexOf("A") >=0) {
							for(j=0;j<data3.length;j++){
								if('A' + data3[j]['id'] == areaLocArray[i]){
									//Set up map
									if (i === 0) {

										map = setMap.set(parseFloat(JSON.parse(data3[j]['coordinates'])[0][0]), parseFloat(JSON.parse(data3[j]['coordinates'])[0][1]));
										polyline = L.polyline([], {color: 'red'}).addTo(map);
									}
									$scope.coordinates.push(L.polygon(JSON.parse(data3[j]['coordinates'])).getBounds().getCenter());
									if(data3[j].shape == 'polygon'){
										polyline.addLatLng(L.polygon(JSON.parse(data3[j]['coordinates'])).getBounds().getCenter())
										L.polygon(JSON.parse(data3[j]['coordinates'])).addTo(map)
											.bindPopup('<img style="width:50px;height:50px;" src="'+data3[j]['thumb_path']+'"></br>' + data3[j]['name'])
											.on('mouseover', function(e) {
												//open popup;
												this.openPopup();
											})
											.on('mouseout', function(e) {
												//close popup;
												this.closePopup();
											})
									}
									expArray.push(['A' + data3[j]['id'],data3[j]['name']]);
									$scope.places = expArray;
									break;
								}
							}
						} else {
							for(j=0;j<data2.length;j++){
								if(data2[j]['id'] == areaLocArray[i]){
									//Set up map
									if (i === 0) {
										map = setMap.set(parseFloat(data2[j]['latitude']), parseFloat(data2[j]['longitude']));
										polyline = L.polyline(LatLng, {color: 'red'}).addTo(map);
									}
									polyline.addLatLng([parseFloat(data2[j]['latitude']),parseFloat(data2[j]['longitude'])])
									$scope.coordinates.push([parseFloat(data2[j]['latitude']),parseFloat(data2[j]['longitude'])])
									L.marker([data2[j]['latitude'], data2[j]['longitude']], {icon: newIcon}).addTo(map)
										.bindPopup('<img style="width:50px;height:50px;" src="'+data2[j]['thumb_path']+'"></br>' + data2[j]['name'])
										.on('mouseover', function(e) {
											//open popup;
											this.openPopup();
										})
										.on('mouseout', function(e) {
											//close popup;
											this.closePopup();
										})
									expArray.push([data2[j]['id'],data2[j]['name']]);
									$scope.places = expArray;
									break;
								}
							}
						}
					}
					map.fitBounds($scope.coordinates)
				});
		});


		//Set switches
		if($scope.exploration.toggle_comments == 'true'){
			$scope.exploration.toggle_comments = true;
		}else{
			$scope.exploration.toggle_comments = false;
		}
	})

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

	//Allow stops to be changed
	$scope.editPosition = function(){
		//Open new position fields
		$scope.active = true;

		//initialize search bar
		$scope.search = new L.Control.GeoSearch({
			provider: new L.GeoSearch.Provider.OpenStreetMap(),
			position: 'topcenter',
			showMarker: true,
			scope: $scope,
			location: $scope.exploration,
			map: map
		}).addTo(map);
	}

	//Handle "save and close"
	$scope.submit = function(){
		var direction = '';
		for (i=0;i<$scope.places.length; i++){
			direction += $scope.places[i][0] + ",";
			if (i === $scope.places.length-1){
				direction = direction.substr(0,direction.length-1);
			}
		}
		//Save
		explorations.save($scope.file, {
		task: 'update',
			eid: $stateParams.exploration,
			project: $scope.projectId,
			name: $scope.exploration.name,
			description: $scope.exploration.description,
			direction: direction,
			toggle_comments: $scope.exploration.toggle_comments
		}).success(function(data){
			console.log(data)
			$scope.header ? explorations.save($scope.header, {task: 'uploadHeader', id: $stateParams.exploration, project: $scope.projectId}) : null;
			// location.href = "javascript:history.back()";
		})
	}

	//Delete exploration
	$scope.delete = function(){
		explorations.delete($stateParams.exploration, $scope.project).success(function(data){
			//return to projecct
			location.href = "javascript:history.back()";
		})
	}

	function createNewLine() {
		console.log(locArray)
		newlatlng= [];
		for(h=0; h<expArray.length; h++){
			if (expArray[h][0].indexOf("A") >=0) {
				for (i=0; i < areaArray.length; i++) {
					if ('A' + areaArray[i]['id'] === expArray[h][0]){
						newlatlng.push(L.polygon(JSON.parse(areaArray[i]['coordinates'])).getBounds().getCenter());
					}
				}
			}else {
				for (i=0; i < locArray.length; i++) {
					if (locArray[i]['id'] === expArray[h][0]){
						newlatlng.push([parseFloat(locArray[i]['latitude']),parseFloat(locArray[i]['longitude'])]);
					}
				}
			}
		}
		polyline.setLatLngs(newlatlng);
	}


	$scope.onSort = function(){
		createNewLine();
	};

	$("#editStops").on('click', function(e) {
		$('html,body').animate({scrollTop: $('.header').offset().top}, 1500);
		return false;
	});

	$scope.removeThis = function() {
		for (i=0;i<$scope.places.length;i++) {
			if (this.place[0] == $scope.places[i][0]) {
				$scope.places.splice(i,1)
				break;
			}
		}
		createNewLine();
	}
});
