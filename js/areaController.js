mbira.controller("viewAreasCtrl", function ($scope, $http, makeArray){
	$scope.project
	$scope.pid
	$scope
	//Get all areas
	$http({
		method: 'GET',
		url: "ajax/getAreas.php",
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
			  	areaArray = makeArray.make(data2[i].id, $scope);
			  	data2[i].areas = areaArray;
			}
			$scope.projects = data2;
		})
	})
});	

mbira.controller("newAreaCtrl", function ($scope, $http, $upload, $stateParams, setMap, exhibits, getProject){
	
	$scope.marker = false;
	$scope.mark = '';
	$scope.file;
	$scope.ID = $stateParams.project;
	$scope.PID = $stateParams.pid;
	$scope.markers = [];
	$scope.radius = '300';
	$scope.polygon = '';
	$scope.circle = '';
	var newlatlngs;
	$scope.tmpID = 0;
	$scope.media = [];
	$scope.images = [];
	$scope.done = false;
	
	var success = function(data, status) {
        $scope.project = data[0][2];
    };
	getProject.name($stateParams.project).success(success);
	
	//new area model
	$scope.newArea = {
		name: "",
		description: "",
		dig_deeper: '',
		file:"",
		shape: "",
		radius: "",
		coordinates: [],
		toggle_media: true,
		toggle_dig_deeper: true,
		toggle_comments: true
	}

	$scope.exhibits = [];
	temp=[];

	 $http({
		method: 'POST',
		url: "ajax/getExhibits.php",
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).success(function(data){
		if (!data.length) {
			$scope.exhibits.push({name:'No Exhibits'})
		}else {
			for(i=0;i<data.length;i++){
				//$scope.exhibits.push({name:data[i].name,id:data[i].id, ticked:false})
				temp.push({name:data[i].name,id:data[i].id, ticked:false});
				
			}
			$scope.exhibits=temp;
		}
	})  
	
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
	
	$scope.submitMedia = function($files) {
		console.log($files[0].name);
		if($files.length > 1) {
			alert("Only upload one image at a time.");
		}else{
			$scope.mediaFile = $files[0];
			$scope.upload = $upload.upload({
					// url: 'ajax/saveMedia.php',
					url: 'ajax/tempImg.php',
					method: 'POST',
					headers: {'Content-Type': 'application/x-www-form-urlencoded'},
					data: {id: $scope.tmpID},
					file: $scope.mediaFile
			}).success(function(data, status, headers, config) {
				$scope.media.push({
					originalName: $scope.mediaFile.name,
					tempName: "images/temp"+$scope.tmpID+".jpg"
				});
				$scope.images.push($scope.mediaFile);
				$scope.tmpID++;
			});  
		}
	}
	
	function findByName (array, test) {
        for (var x = 0; x < array.length; x++) {
            if (array[x].name == test) return x;
        }
        return -1;
    }
	
	$scope.deleteMedia = function(m) {
		$scope.media.splice($scope.media.indexOf(m), 1);
		$scope.images.splice(findByName($scope.images, m.originalName), 1);
	}
	
	//submit new area
	$scope.submit = function() {
		geo = $scope.polygon.toGeoJSON()
		$scope.upload = $upload.upload({
			url: 'ajax/saveArea.php',
			method: 'POST',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: {
				task: 'create',
				projectId: $scope.ID,
				name: $scope.newArea.name,
				description: $scope.newArea.description,
				dig_deeper: $scope.newArea.dig_deeper,
				shape: $scope.newArea.shape,
				radius: $scope.newArea.radius,
				coordinates: $scope.newArea.coordinates,
				json : JSON.stringify(geo),
				toggle_media: $scope.newArea.toggle_media,
				toggle_dig_deeper: $scope.newArea.toggle_dig_deeper,
				toggle_comments: $scope.newArea.toggle_comments
			},
			file: $scope.file
		}).success(function(data) {
			//Save media
			for(var i = 0; i < $scope.images.length; i++) {
				$scope.uploadMedia = $upload.upload({				
					url: 'ajax/saveMedia.php',
					method: 'POST',
					headers: {'Content-Type': 'application/x-www-form-urlencoded'},
					data: { 
							type: 'area',
							id: data
						},
					file: $scope.images[i]
				})
			}
			
			//return to project
			exhibits.add(data,$scope.outputExhibits, 'area');
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
		// $scope.markers.forEach(function(mark){
			// map.removeLayer(mark);
		// })
		map.removeLayer($scope.polygon);
		// map.removeLayer($scope.circle);
		// console.log($scope.newArea.coordinates);
		//Create polygon from array of coordinates 
		$scope.polygon = L.polygon($scope.newArea.coordinates).addTo(map);
		$scope.polygon.setStyle({fillColor: '#445963'});
		$scope.polygon.setStyle({color: '#253137'});
		if(!$scope.done){
			$scope.polygon.setStyle({opacity: '.2'});
		} else {
			$scope.polygon.setStyle({opacity: '.8'});
		}
		// $scope.polygon.setStyle({stroke: false});
		newlatlngs = $scope.polygon._latlngs;
		//reset array of markers
		$scope.markers = [];
		
		//set shape
		$scope.newArea.shape = 'polygon';
	}
	/* 
	// //Create polygon out of single marker
	// $scope.createCircle = function(radius){
		// //remove any markers and shapes already there
		// $scope.markers.forEach(function(mark){
			// map.removeLayer(mark);
		// })
		// map.removeLayer($scope.polygon);
		// map.removeLayer($scope.circle);
		
		// //create circle from coordinate
		// $scope.circle = L.circle($scope.newArea.coordinates[0], radius, {
			// color: 'red',
			// fillColor: '#f03',
			// fillOpacity: 0.5
		// }).addTo(map);
		
		// $scope.newArea.radius = radius;
		
		// //reset array of markers
		// $scope.markers = [];
		
		// //set shape
		// $scope.newArea.shape = 'circle';
	// }
	 */
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
	
	var circleIcon = L.icon({
		iconUrl: 'js/images/marker-icon-circle.png',
		iconSize:     [15, 15], // size of the icon
		iconAnchor:   [8, 8], // point of the icon which will correspond to marker's location
	});

	//Click to set marker and save location to scope
	count = 0;
	var id = 0;
	map.on('click', function(e) {
		$scope.newArea.coordinates.push([e.latlng.lat, e.latlng.lng]);	
		var marker = L.marker(e.latlng, {icon: circleIcon, id: id++, draggable: 'true'}).addTo(map)
			.on('drag', function(event){
				var marker = event.target;
				var position = marker.getLatLng();
				newLatLngs = $scope.polygon.getLatLngs();
				newLatLngs[marker.options.id].lat = position.lat;
				newLatLngs[marker.options.id].lng = position.lng;
				latlngArray = []
				for (p=0;p<newLatLngs.length;p++){
					latlngArray.push([newLatLngs[p].lat,newLatLngs[p].lng])
				}
				$scope.polygon.setLatLngs(latlngArray);
				$scope.newArea.coordinates = $scope.polygon.getLatLngs();
				latlngArray = [];
			}).on('click', function(e) {
				if(!$scope.done && id >= 3 && this._latlng.lat == $scope.polygon.getLatLngs()[0].lat && this._latlng.lng == $scope.polygon.getLatLngs()[0].lng) {
					$scope.done = true;
					$scope.polygon.setStyle({opacity: '.8'});
					$scope.polygon.setStyle({dashArray: null});
					if($scope.ghostMarker){
						// map.removeLayer($scope.tooltip);
						map.removeLayer($scope.ghostMarker);
					}	
					if($scope.ghostLine1){
						map.removeLayer($scope.ghostLine1);
						map.removeLayer($scope.ghostLine2);
					}	
					$('#done').fadeIn('slow');
				} else {
					currentlatlng = $scope.polygon._latlngs;
					currentlatlng.splice(this.options.id,1);
					latlngArray = [];
					$scope.newArea.coordinates = [];
					for (p=0; p<currentlatlng.length; p++){
						latlngArray.push([currentlatlng[p].lat,currentlatlng[p].lng]);
					}
					removedEdge = this.options.id;
					map.removeLayer(this);
					
					var highest = 1;
					$.each(map._layers, function (ml) {
						if (map._layers[ml]._icon && map._layers[ml].options.id > removedEdge) {
							this.options.id -= 1;
							id = this.options.id + 1;
							highest = 0;
						}
					})
					
					if (highest) {
						id = id - 1;
					}
				
					$scope.polygon.setLatLngs(currentlatlng);
					$scope.newArea.coordinates = $scope.polygon.getLatLngs();
					latlngArray = [];	
				}
			})
			.on('mouseover', function(e) {
				
				marker.bindPopup('HI', {'offset': L.point(0,-10)}).openPopup();
				if($scope.ghostMarker){
					$scope.onPin = true;
					// map.removeLayer($scope.tooltip);
					map.removeLayer($scope.ghostMarker);
				}	
			})
			.on('mouseout', function(e) {
				marker.closePopup();
				if($scope.ghostMarker){
					$scope.onPin = false;
				}	
			});
		$scope.markers.push(marker);
		$scope.createPolygon();
		$scope.$apply(); 
		// if (id >= 3){
			// $('#done').fadeIn('slow');
		// }
	});
	
	var coords;
	map.on('mousemove', function(e) {
		if(!$scope.done) {
			if ($scope.polygon) {
			
				if($scope.onPin) {
					if($scope.ghostMarker){
						// map.removeLayer($scope.tooltip);
						map.removeLayer($scope.ghostMarker);
					}	
				} else {
					coords = $scope.polygon.getLatLngs();
					if($scope.ghostMarker){
						// map.removeLayer($scope.tooltip);
						map.removeLayer($scope.ghostMarker);
					}	
					if($scope.ghostLine1){
						map.removeLayer($scope.ghostLine1);
						map.removeLayer($scope.ghostLine2);
					}	
					// $scope.tooltip = L.marker(e.latlng, {icon: tooltip, opacity: .85}).addTo(map);
					$scope.ghostMarker = L.marker(e.latlng, {icon: circleIcon, opacity: '.5'}).addTo(map);
					$($scope.ghostMarker._icon).addClass('ghost');
					$scope.ghostLine1 = L.polyline([coords[coords.length-1], e.latlng], {dashArray: "5, 10", color: "#253137"}).addTo(map);
					$scope.ghostLine2 = L.polyline([coords[0], e.latlng], {dashArray: "5, 10", color: "#253137"}).addTo(map);
				}
				
				if($scope.ghostLine1){
					map.removeLayer($scope.ghostLine1);
					map.removeLayer($scope.ghostLine2);
				}	
				// $scope.tooltip = L.marker(e.latlng, {icon: tooltip, opacity: .85}).addTo(map);
				$scope.ghostLine1 = L.polyline([coords[coords.length-1], e.latlng], {dashArray: "5, 10", color: "#253137"}).addTo(map);
				$scope.ghostLine2 = L.polyline([coords[0], e.latlng], {dashArray: "5, 10", color: "#253137"}).addTo(map);
			}
		}		
	});
	
	//Click to set marker and save location to scope
	$("#done").on('click', function(e) {
		e.stopPropagation()
		$scope.done = true;
		$('#done').fadeOut('slow', function() {
			$('#done').remove();
			$('.area_info').fadeIn('slow', function(){
				$('html,body').animate({scrollTop: $('.area_info').offset().top}, 1500);
			});
		});
	});
	
	//</MAP_STUFF>
});

mbira.controller("singleAreaCtrl", function ($scope, $http, $state, $upload, $stateParams, setMap, timeStamp, exhibits, getProject){
	$scope.project = $stateParams.project;
	$scope.pid = $stateParams.pid;
	$scope.previous = $stateParams.previous
	$scope.userData = []
	$scope.comments = []
	latlngArray = []
	removed = 1000;
	
	var success = function(data, status) {
        $scope.project = data[0][2];
    };
	getProject.name($stateParams.project).success(success);
	
	$scope.exhibits = [];
	temp=[];

	$http({
		method: 'POST',
		url: "ajax/inExhibit.php",
		data: $.param({'id': $stateParams.area, 'task': 'area'}),
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).success(function(data){
		ids = []
		for (a=0;a<data.length;a++){
			ids.push(data[a].id);
		}

		 $http({
			method: 'POST',
			url: "ajax/getExhibits.php",
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function(data2){
			//adds checkmark if the area is in an exhibit.
			for(i=0;i<data2.length;i++){
				if ($.inArray(data2[i].id, ids) > -1) {
					temp.push({name:data2[i].name,id:data2[i].id, ticked:true});
				} else {
					temp.push({name:data2[i].name,id:data2[i].id, ticked:false});
				}
			}
			$scope.exhibits=temp;
		})  
	}) 
    
	function getMedia(){
		$http({
			method: 'POST',
			url: "ajax/getMedia.php",
			data: $.param({'id': $stateParams.area, 'type': 'area'}),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function(data){
			$scope.media = data;
		})
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
					id: $stateParams.area,
					type: 'area'
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
	
	var circleIcon = L.icon({
		iconUrl: 'js/images/marker-icon-circle.png',
		iconSize:     [15, 15], // size of the icon
		iconAnchor:   [8, 8], // point of the icon which will correspond to marker's location
	});
	
	$http({
		method: 'POST',
		url: "ajax/getUsers.php",
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).success(function(data){
		$scope.userData = data;
		loadComments(data);
	})	
	
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
		map.fitBounds($scope.coordinates)
		
		if(data.shape == 'polygon'){
			//Create polygon from array of coordinates 
			$scope.polygon = L.polygon($scope.coordinates).addTo(map)
				.on('click', function(e) {
					areaMarkers = []
					$.each(map._layers, function (ml) {
						if (map._layers[ml]._icon) {
							areaMarkers.push(this);
						}
					})
					areaMarkers.splice(areaMarkers.length-1,1)  // removes most recently added marker
					areaMarkers.sort(function(a,b){
						return Math.sqrt(Math.pow((a._latlng.lat-e.latlng.lat),2)+Math.pow((a._latlng.lng-e.latlng.lng),2)) - Math.sqrt(Math.pow((b._latlng.lat-e.latlng.lat),2)+Math.pow((b._latlng.lng-e.latlng.lng),2))
					})
					index = 0;
					areaMarkers[1].options.id > areaMarkers[0].options.id ? index = areaMarkers[1].options.id : index = areaMarkers[0].options.id;
					newMarkerID = index;
					currentlatlng = $scope.polygon._latlngs;
					for (p=0;p<currentlatlng.length;p++){
						latlngArray.push([currentlatlng[p].lat,currentlatlng[p].lng])
					}
					latlngArray.splice(index, 0, [e.latlng.lat, e.latlng.lng]);
					$scope.polygon.setLatLngs(latlngArray);
					newlatlngs = $scope.polygon._latlngs;
					$.each(map._layers, function (ml) {
						if (map._layers[ml]._icon && map._layers[ml].options.id === index) {
							index++;
							this.options.id = index;
						}
					})
					$scope.marker = L.marker([e.latlng.lat, e.latlng.lng],{icon: circleIcon, id:newMarkerID, draggable:'true'}).addTo(map)
						.on('click', function(e) {
							currentlatlng = $scope.polygon._latlngs;
							if ($scope.polygon._latlngs.length === 3){
								alert("You cannot remove this point. To remove this area, scroll down to delete the area.")
							} else {
								
								currentlatlng.splice(this.options.id,1);
								latlngArray = []
								for (p=0;p<currentlatlng.length;p++){
									latlngArray.push([currentlatlng[p].lat,currentlatlng[p].lng])
								}
								removedEdge = this.options.id
								map.removeLayer(this);
								
								$.each(map._layers, function (ml) {
									if (map._layers[ml]._icon && map._layers[ml].options.id > removedEdge) {
										this.options.id -= 1;
									}
								})
							
								$scope.polygon.setLatLngs(currentlatlng);
								latlngArray = [];
							}

						})
						
						.on('drag', function(event){
							var marker = event.target;
							var position = marker.getLatLng();
							newLatLngs = $scope.polygon.getLatLngs();
							newLatLngs[marker.options.id].lat = position.lat;
							newLatLngs[marker.options.id].lng = position.lng;
							latlngArray = []
							for (p=0;p<newLatLngs.length;p++){
								latlngArray.push([newLatLngs[p].lat,newLatLngs[p].lng])
							}
							$scope.polygon.setLatLngs(latlngArray);
							latlngArray = [];
						});
						
					latlngArray = []
				});
				
				$scope.polygon.setStyle({fillColor: '#445963'});
				$scope.polygon.setStyle({color: '#253137'});
				$scope.polygon.setStyle({opacity: '.8'});
				
			for (m=0;m<$scope.polygon._latlngs.length;m++) {
				$scope.marker = L.marker([$scope.polygon._latlngs[m].lat, $scope.polygon._latlngs[m].lng],{icon: circleIcon, id:m, draggable:'true'}).addTo(map)
					.on('click', function(e) {
						currentlatlng = $scope.polygon._latlngs;
						if ($scope.polygon._latlngs.length === 3){
							alert("You cannot remove this point. To remove this area, scroll down to delete the area.")
						} else {
							currentlatlng.splice(this.options.id,1);
							latlngArray = []
							for (p=0;p<currentlatlng.length;p++){
								latlngArray.push([currentlatlng[p].lat,currentlatlng[p].lng])
							}
							removedEdge = this.options.id
							map.removeLayer(this);
							
							$.each(map._layers, function (ml) {
								if (map._layers[ml]._icon && map._layers[ml].options.id > removedEdge) {
									this.options.id -= 1;
								}
							})
							
							$scope.polygon.setLatLngs(currentlatlng);
							latlngArray = [];

						}

					})
					.on('drag', function(event){
						var marker = event.target;
						var position = marker.getLatLng();
						newLatLngs = $scope.polygon.getLatLngs();
						newLatLngs[marker.options.id].lat = position.lat;
						newLatLngs[marker.options.id].lng = position.lng;
						latlngArray = []
						for (p=0;p<newLatLngs.length;p++){
							latlngArray.push([newLatLngs[p].lat,newLatLngs[p].lng])
						}
						$scope.polygon.setLatLngs(latlngArray);
						latlngArray = [];
					});

			}
			
		}// else if(data.shape == 'circle'){
			// //Create circle from coordinates
			// $scope.circle = L.circle($scope.coordinates[0], data.radius, {
				// color: 'red',
				// fillColor: '#f03',
				// fillOpacity: 0.5
			// }).addTo(map);
		// }
		

		//Set switches
		if($scope.area.toggle_comments == 'true'){
			$scope.area.toggle_comments = true;
		}else{
			$scope.area.toggle_comments = false;
		}
		if($scope.area.toggle_media == 'true'){
			$scope.area.toggle_media = true;
		}else{
			$scope.area.toggle_media = false;
		}
		if($scope.area.toggle_dig_deeper == 'true'){
			$scope.area.toggle_dig_deeper = true;
		}else{
			$scope.area.toggle_dig_deeper = false;
		}
		getMedia();
	})
	
	//Handle "save and close"
	$scope.submit = function(){
		//Save
		currentlatlng = $scope.polygon.getLatLngs();
		latlngArray = []
		for (p=0;p<currentlatlng.length;p++){
			latlngArray.push([currentlatlng[p].lat,currentlatlng[p].lng])
		}
		geo = $scope.polygon.toGeoJSON();
		
		$scope.uploadFile = $upload.upload({
			url: "ajax/saveArea.php",
			method:"POST",
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: {
				task: 'update',
				id: $stateParams.area,
				projectId: $stateParams.project,
				name: $scope.area.name,
				description: $scope.area.description,
				dig_deeper: $scope.area.dig_deeper,
				shape: $scope.area.shape,
				radius: $scope.area.radius,
				coordinates: JSON.stringify(latlngArray),
				json : JSON.stringify(geo),
				toggle_media: $scope.area.toggle_media,
				toggle_comments: $scope.area.toggle_comments,
				toggle_dig_deeper: $scope.area.toggle_dig_deeper
			},
			file: $scope.newThumb
		}).success(function(data){
			exhibits.add($stateParams.area,$scope.outputExhibits, 'area')
			//Close (return to project)
			location.href = "javascript:history.back()";
		})

	}
	
	//Save thumbnail
	$scope.onThumbSelect = function($files) {
		if($files.length > 1) {
			alert("Only upload one image for the thumbnail.");
		}else{
			$scope.newThumb = $files[0];
			$scope.uploadFile = $upload.upload({
				url:'ajax/tempImg.php',
				method:"POST",
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				file: $scope.newThumb
			}).success(function(data) {	
				// $('.thumbnail .dropImg').css('display', 'none');
				// $('.thumbnail h5').css('display', 'none');
				// $('.thumbnail .clickAdd').css('display', 'none');
				$scope.showImg = true;
				$('.dropzone img').attr('src', 'images/temp.jpg?' + (new Date).getTime()) // forces img refresh	
			});
		}
	};
	
	//Submit Media
	$scope.onFileSelect = function($files) {
		if($files.length > 1) {
			alert("Only upload one image at a time.");
		}else{
		  	$scope.file = $files[0];
			$scope.upload = $upload.upload({
					url: 'ajax/saveMedia.php',
					method: 'POST',
					headers: {'Content-Type': 'application/x-www-form-urlencoded'},
					data: {'id': $stateParams.area, 'type': 'area'},
					file: $scope.file
			}).success(function(data, status, headers, config) {
				getMedia();
			});  
		}
	};
	
	$scope.deleteMedia = function(m) {
		$http({
		method: 'POST',
		url: "ajax/deleteMedia.php",
		data: $.param({			
				id: m.id,
				type: "area",
				path: "images/"+m.file_path
			}),
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function(data){
			getMedia();
		})
	}

	//Delete area
	$scope.delete = function(){
		$http({
		method: 'POST',
		url: "ajax/saveArea.php",
		data: $.param({
				task: "delete",
				id: $stateParams.area
			}),
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function(data){
			//return to project
			location.href = "javascript:history.back()";
		})
	}
});