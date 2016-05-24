//viewing a specific location
mbira.controller("singleLocationCtrl", function ($timeout, $scope, $http, $state, $upload, $stateParams, setMap, timeStamp, exhibits, 
	projects, media, locations, temporary, mediaCreation){
	var map;
	$scope.newMedia = false;
	$scope.projectId = $stateParams.project;
	$scope.pid = $stateParams.pid;
	$scope.previous = $stateParams.previous;
	$scope.media;
	$scope.comments = [];
	$scope.userData = [];
	$scope.modal = {current: ""};

	projects.get($stateParams.project).success(function(data, status) {
        $scope.project = data[0][2];
    });

	$scope.exhibits = [];
	temp=[];

	exhibits.inExhibit($stateParams.location, 'loc').success(function(data){
		ids = []
		for (a=0;a<data.length;a++){
			ids.push(data[a].id);
		}

		exhibits.getAll().success(function(data2){
			//adds checkmark if the location is in an exhibit.
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
  		media.get($stateParams.location, 'loc').success(function(data){$scope.media = data;});
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
					id: $stateParams.location,
					type: 'location'
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



	$http({
		method: 'POST',
		url: "ajax/getUsers.php",
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).success(function(data){
		$scope.userData = data;
		loadComments(data);
	})

	//load location info
	locations.get($stateParams.location).success(function(data){
		//Put location in scope
		$scope.location = data;

		var newIcon = L.icon({
			iconUrl: 'js/images/LocationMarker.svg',
			iconSize:     [30, 40], // size of the icon
			iconAnchor:   [13, 38], // point of the icon which will correspond to marker's location
		});

		//Set up map
		map = setMap.set(data.latitude, data.longitude);
		$scope.marker = L.marker([data.latitude, data.longitude],{icon: newIcon, draggable:'true'}).addTo(map);
		$scope.marker.on('dragend', function(event){
				var marker = event.target;
				var position = marker.getLatLng();
				$scope.location.latitude = position.lat;
				$scope.location.longitude = position.lng;
				marker.setLatLng([position.lat,position.lng],{draggable:'true'}).update();
		});

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

		getMedia();
	})

	$scope.onMediaSelect = function($files) {
		$scope.mediaFile = $files[0];
		mediaData = media.save($files[0], $stateParams.location, 'loc', $scope.projectId).success(getMedia);
	}

	$scope.deleteMedia = function(m) {
		media.delete(m).success(function(data){
			getMedia();
		})
	}

	//Save thumbnail
	$scope.onThumbSelect = function($files) { 
		mediaCreation.stepInto($scope, "Thumbnail")
		$('#modalCheckboxInput').removeAttr('checked');
		$scope.mediaCheckBox = false

		$scope.file = $files[0];
		console.log($files)
		temporary.thumbnail($files).success(function(data) {
			// $scope.images.unshift($scope.file);
			$("#editable").attr('src', 'tmp/temp.jpg?' + (new Date).getTime()) // forces img refresh
			$(".overlay").fadeIn('slow');

			cropper ? cropper.destroy(): null;
			cropper = mediaCreation.initializeCropper('editable');
		});
	};

	function setCropper(type) {
		if (type == 'media') {
			cropper.setCanvasData($scope.thumbnailImageCanvasData);
			cropper.setCropBoxData($scope.thumbnailImageCropData);
		} else {
			console.log("hellos")
			cropper.setCanvasData($scope.thumbnailCanvasData);
			cropper.setCropBoxData($scope.thumbnailCropData);
		}

	}

	$scope.saveThumbnail = function(command) {
		$scope.thumbnailCanvasData = cropper.getCanvasData();
		$scope.thumbnailCropData = cropper.getCropBoxData();
		blob = mediaCreation.dataURLtoBlob( cropper.getCroppedCanvas().toDataURL() );
		$scope.file_thumbnail = blob;
		imgSrc = URL.createObjectURL(blob);
		$(".thumbnail-img img").remove();
		$('.thumbnail-img').append("<img src='"+ imgSrc + "'>");
		$("#details-thumbnail").attr('src',imgSrc);
		// var formData = new FormData();
		// formData.append('croppedImage', blob);

		if (command == 'finish') {
			$(".overlay").fadeOut('slow');
		} else {
			mediaCreation.stepInto($scope, "Crop")
			$('.modalCheckbox').slideUp('slow');
			$('.popup').css({height: '533px'});
			$timeout(function(){
				$('#crop-submit').animate({width:'220px'}, 500);
				$('#skip-forward, #step-back').animate({width:'220px'}, 500)
			}, 500)

			cropper.setAspectRatio(NaN)
		}
	}

	$scope.cropImage = function() {
		$scope.thumbnailMediaCanvasData = cropper.getCanvasData();
		$scope.thumbnailMediaCropData = cropper.getCropBoxData();
		blob = mediaCreation.dataURLtoBlob( cropper.getCroppedCanvas().toDataURL() );
		$scope.file_thumbnail_image = blob;

		$("#details").fadeOut(600, function(){
			mediaCreation.stepInto($scope, "Details")
		})
		
		$timeout(function(){$('.popup').css({height: '350px'});},500)
	}

	$scope.editThumbnail = function() {
		mediaCreation.stepInto($scope, "Thumbnail")
		$('#skip-forward, #step-back').css({width:'0px'});
		$('#crop-submit').css({width:'698px'});
		$('.modalCheckbox').slideDown('fast');
		$('.popup').css({height: '571px'});
		mediaCreation.stepInto($scope, "Thumbnail")
		cropper.setAspectRatio(1/1);
		setCropper();
		$(".overlay").fadeIn('slow');

	}

	$scope.stepBack = function() {
		if ($scope.modal.current == 'Crop') {
			$('.popup').css({height: '571px'});
			setTimeout(function() {
				$('#skip-forward, #step-back').animate({width:'0px'}, 500);
				$('#crop-submit').animate({width:'698px'}, 500);
			}, 500);
			$('.modalCheckbox').slideDown('slow', function(){
				cropper.setAspectRatio(1/1);
				setCropper();
			});
			mediaCreation.stepInto($scope, "Thumbnail")
		} else {
			setCropper('media');
			$('.popup').css({height: '533px'});
			$timeout(function(){mediaCreation.stepInto($scope, 'Crop')}, 700)
		}
	}

	$scope.skipForward = function() {
		$scope.thumbnailMediaCanvasData = null;
		$scope.thumbnailMediaCropData = null;
		$("#details").fadeOut(600, function(){
			mediaCreation.stepInto($scope, "Details")
		})
		
		$timeout(function(){$('.popup').css({height: '350px'});},500)
	}

	$scope.resetCropper = function() {
		$('.overlay').fadeOut('slow', function() {
			if ($scope.thumbnailCanvasData) {  
				setCropper();
			} else {
				cropper.reset();
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

	//Delete location
	$scope.delete = function(){
		locations.delete($stateParams.location, $scope.projectId).success(function(data){
			//return to project
			location.href = "javascript:history.back()";
		})
	}

	//Handle "save and close"
	$scope.submit = function(){
		//Save
		locations.save($scope.file, {
			task: 'update',
			lid: $stateParams.location,
			project: $scope.projectId,
			name: $scope.location.name,
			description: $scope.location.description,
			shortDescription: $scope.location.short_description,
			dig_deeper: $scope.location.dig_deeper,
			latitude: $scope.location.latitude,
			longitude: $scope.location.longitude,
			toggle_media: $scope.location.toggle_media,
			toggle_dig_deeper: $scope.location.toggle_dig_deeper,
			toggle_comments: $scope.location.toggle_comments
		}).success(function(data){
			$scope.header ? locations.save($scope.header, {task: 'uploadHeader', id: $stateParams.location, project: $scope.projectId}) : null ;
			exhibits.add($stateParams.location,$scope.outputExhibits, 'loc')
			//Close (return to project)
			location.href = "javascript:history.back()";
		})
	}
});