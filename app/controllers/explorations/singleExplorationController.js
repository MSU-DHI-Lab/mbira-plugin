mbira.controller("singleExplorationCtrl", function ($timeout, $scope, $http, $upload, $stateParams, setMap, $state, timeStamp, projects, temporary, explorations, locations, areas, users, 
	comments, mediaCreation){
	$scope.projectId = $stateParams.project;
	$scope.pid = $stateParams.pid;
	$scope.previous = $stateParams.previous
	$scope.comments = []
	$scope.userData = []
	$scope.modal = {current: "", type: "", mode: 'new', details: {}, place: "Exp"};
	$scope.mediaImage;

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
			console.log(idToCheck)
			if (parseInt(idToCheck) == data[j].replyTo) {
				name = idToUser(data[j]);
				date = timeStamp.toDate(data[j]['UNIX_TIMESTAMP(created_at)']*1000) + " | " + timeStamp.toTime(data[j]['UNIX_TIMESTAMP(created_at)']*1000)
				tempObj = {comment_id:data[j].id, user:name, date:date,comment:data[j].comment, replies:[], pending:data[j].isPending, deleted:data[j].deleted};
				objToPushTo.replies.push(tempObj);
			}
		}
	}

	function idToUser(commentData){
		for(q=0;q<$scope.userData.length;q++){					//match user_id of comment or reply to name
			if (parseInt($scope.userData[q].id) === parseInt(commentData.user_id)){
				return $scope.userData[q].firstName + " " + $scope.userData[q].lastName;
			}
		}
	}

	function loadComments() {//load comments
		$scope.comments = [];
		comments.get($stateParams.exploration, 'exploration').success(function(data){
			data.sort(function(x, y){
				if ( x.replyTo - y.replyTo === 0){
					return y['UNIX_TIMESTAMP(created_at)']*1000 - x['UNIX_TIMESTAMP(created_at)']*1000
				} else {
					return y.replyTo - x.replyTo;
				}
			})

			for(i=0;i<data.length;i++){
				if (data[i].replyTo == 0 || data[i].replyTo == null){
					name = idToUser(data[i]);
					date = timeStamp.toDate(data[i]['UNIX_TIMESTAMP(created_at)']*1000) + " | " + timeStamp.toTime(data[i]['UNIX_TIMESTAMP(created_at)']*1000)
					tempObj = {comment_id:data[i].id, user:name, date:date,comment:data[i].comment, replies:[], pending:data[i].isPending, deleted:data[i].deleted}
					$scope.comments.push(tempObj)
				}
			}
			for(i=0;i<$scope.comments.length;i++){
				checkIfHasReply($scope.comments[i], $scope.comments[i].comment_id, data)
			}
			console.log($scope.comments)

		})
	}

	$scope.approveComment = function(id) { 
		comments.approve(id, 'exploration').success(function(){loadComments();});
	}

	$scope.reinstateComment = function(id) { 
		comments.reinstate(id, 'exploration').success(function(){loadComments();});
	}

	$scope.deleteComment = function(id) { 
		comments.delete(id, 'exploration').success(function(){loadComments();});
	}

	users.getAll().success(function(data){
		$scope.userData = data;
		loadComments();
	})

	var newIcon = L.icon({
		iconUrl: 'js/images/LocationMarker.svg',
		iconSize:     [30, 40], // size of the icon
		iconAnchor:   [13, 38], // point of the icon which will correspond to marker's location
		popupAnchor:  [1, -40]
	});

	//load exploration info
	explorations.get($stateParams.exploration).success(function(data){
		//Put location in scope
		// Caution: The following lines of code are gross
		$scope.exploration = data;
		areaLocArray = data['direction'].split(',');
		locations.getAll().success(function(data2){
			locArray = data2;
			areas.getAll().success(function(data3){
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
		$(".loading-text").html("Uploading");
		$(".loading").fadeIn("slow");
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

		explorations.save($scope.file, {
			task: 'thumbnail',
			eid: $stateParams.exploration,
			project: $scope.projectId,
			croppedThumbnail: $scope.fileThumbnail,
			thumbCanvasData: $scope.thumbnailCanvasData,
			thumbCropData: $scope.thumbnailCropData,
			type: ($scope.modal.mode == 'edit' ? 'edit' : 'new')
		}).success(function() {
			$(".overlay").fadeOut('slow');
			$(".loading").fadeOut("slow");
		})
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
		$(".loading-text").html("Saving");
		$(".loading").fadeIn("slow");
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
			$(".loading").fadeOut("slow", function(){location.href = "javascript:history.back()";});
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
