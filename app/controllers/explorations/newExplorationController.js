mbira.controller("newExplorationCtrl", function ($timeout, $scope, $http, $upload, $stateParams, setMap, $state, projects, temporary, explorations, mediaCreation, locations, areas){
	$scope.marker = false;
	$scope.places = [];
	$scope.projectId = $stateParams.project;
	$scope.PID = $stateParams.pid;
	$scope.total = 0;
	$scope.images = [];
	$scope.modal = {current: "", type: "", mode: 'new', details: {}, place: "Exp"};
	$scope.mediaImage;

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

	//Save thumbnail
	$scope.onThumbSelect = function($files) { 
		$scope.modal.mode = 'new';
		mediaCreation.reset($scope);
		$scope.file = $files[0];

		imgCallback = function(){
			$scope.cropper.setAspectRatio(1/1);
			document.getElementById('editable').removeEventListener('built', imgCallback);
		}
		document.getElementById('editable').addEventListener('built', imgCallback)

		if ($scope.cropper) {
			$scope.cropper.replace(URL.createObjectURL($files[0])) 
		} else {
			$('#editable').attr('src', URL.createObjectURL($files[0]))
			$scope.cropper = mediaCreation.initializeCropper('editable');
		}
		$scope.mediaCheckBox = false;
		$('.media-modal').css({height: '533px'});
		$(".overlay").fadeIn('slow');
	};

	function setCropper(type) {	
		// $scope.modal.type == 'media' ? mediaCreation.srcFromFile($scope.mediaFile) : mediaCreation.srcFromFile($scope.file);
		if (type == 'media') {
			$scope.cropper.setCanvasData($scope.mediaCanvasData);
			$scope.cropper.setCropBoxData($scope.mediaCropData);
		} else {
			$scope.cropper.setCanvasData($scope.modal.type == 'media' ? $scope.mediaThumbnailCanvasData : $scope.thumbnailCanvasData);
			$scope.cropper.setCropBoxData($scope.modal.type == 'media' ? $scope.mediaThumbnailCropData : $scope.thumbnailCropData);
		}

	}

	$scope.saveThumbnail = function(command) {
		blob = mediaCreation.dataURLtoBlob( $scope.cropper.getCroppedCanvas().toDataURL() );
		imgSrc = URL.createObjectURL(blob);

		$scope.thumbnailCanvasData = $scope.cropper.getCanvasData();
		$scope.thumbnailCropData = $scope.cropper.getCropBoxData();
		$scope.fileThumbnail = blob;
		$('.media-modal').css({height: '533px'});

		$(".thumbnail-img").empty();
		$('.thumbnail-img').append("<img src='"+ imgSrc + "'>");
		// var formData = new FormData();
		// formData.append('croppedImage', blob);

		$("#details-thumbnail").attr('src',imgSrc);

		$scope.thumbSave = []
		$scope.thumbSave = [ 
			$scope.file, 
			{
				task: 'thumbnail',
				project: $scope.projectId,
				croppedThumbnail: $scope.fileThumbnail,
				thumbCanvasData: $scope.thumbnailCanvasData,
				thumbCropData: $scope.thumbnailCropData,
				type: 'new'
			}
		]
		$(".overlay").fadeOut('slow');
	}

	$scope.editThumbnail = function(m) {
		$scope.modal.type = 'thumbnail'
		$scope.modal.mode = 'edit';
		mediaCreation.stepInto($scope, "Thumbnail")
		$('#skip-forward, #step-back').css({width:'0px', visibility: 'hidden'});
		$('#crop-submit').css({width:'698px', display:'block', visibility:'visible'});
		$('#modalCheckboxInput').remove();
		$('.media-modal').css({height: '571px'});

		m.description == null ? $scope.mediaCheckBox = false : $scope.mediaCheckBox = true;
		$scope.thumbnailCanvasData = JSON.parse(m.thumbCanvasData);
		$scope.thumbnailCropData = JSON.parse(m.thumbCropData);
		$scope.mediaId = m.id;

		$("#details-thumbnail").attr('src',m.thumb_path);

		imgCallback = function(){
			$scope.cropper.setAspectRatio(1/1);
			$scope.cropper.setCanvasData($scope.thumbnailCanvasData);
			$scope.cropper.setCropBoxData($scope.thumbnailCropData);
			document.getElementById('editable').removeEventListener('built', imgCallback);
		}
		document.getElementById('editable').addEventListener('built', imgCallback)

		if ($scope.cropper) {
			$scope.cropper.replace(m.file_path) 
		} else {
			$('#editable').attr('src', m.file_path)
			$scope.cropper = mediaCreation.initializeCropper('editable');
		}
		$scope.mediaCheckBox = false;
		$(".overlay").fadeIn('slow');

	}

	$scope.resetCropper = function() {
		$('.overlay').fadeOut('slow', function() {
			if ($scope.thumbnailCanvasData) {  
				setCropper();
			} else {
				$scope.cropper.reset();
			}
		});
	}

	//Get header to be uploaded
	$scope.onHeaderSelect = function($files) {
		$scope.header = $files[0];
		temporary.header($files).success(function(data) {
			// $scope.images.unshift($scope.file);
			$('.thumbnail-header img').attr('src', 'tmp/temp_header.jpg?' + (new Date).getTime()) // forces img refresh
		});
	};

	//submit new exploration
	$scope.submit = function() {	
		$(".loading-text").html("Saving");
		$(".loading").fadeIn("slow");
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
			$scope.thumbSave[1].eid = data;
			explorations.save($scope.thumbSave[0], $scope.thumbSave[1]);
			$scope.header ? explorations.save($scope.header, {task: 'uploadHeader', id: data, project: $scope.projectId}) : null;
			$(".loading").fadeOut("slow", function(){
				location.href = "#/viewProject/?project="+$scope.projectId+'&pid='+$scope.PID;
			});
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

	locations.byProj($scope.projectId).success(function(data){
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

	areas.byProj($scope.projectId).success(function(data){
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
								if (this._latlngs[0].lat == parseFloat((JSON.parse(areaArray[i][0]))[0].lat) && this._latlngs[0].lng == parseFloat((JSON.parse(areaArray[i][0]))[0].lng) && inExpCheck(areaArray[i],this)) {
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