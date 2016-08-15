//viewing a specific location
mbira.controller("singleLocationCtrl", function ($timeout, $scope, $http, $state, $upload, $stateParams, setMap, timeStamp, exhibits, 
	projects, media, locations, temporary, mediaCreation, comments, users){
	var map;
	$scope.newMedia = false;
	$scope.projectId = $stateParams.project;
	$scope.pid = $stateParams.pid;
	$scope.previous = $stateParams.previous;
	$scope.media;
	$scope.comments = [];
	$scope.userData = [];
	$scope.modal = {current: "", type: "", mode: 'new', details: {} };
	$scope.mediaImage;

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

		exhibits.getAll($scope.projectId).success(function(data2){
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
    	$(".loading").fadeOut("slow");
  		media.get($stateParams.location, 'loc').success(function(data){$scope.media = data});
    }


	function checkIfHasReply(objToPushTo, idToCheck,data){
		for(j=0;j<data.length;j++){
			if (idToCheck == data[j].replyTo) {
				name = idToUser(data[j]);
				date = timeStamp.toDate(data[j]['UNIX_TIMESTAMP(created_at)']*1000) + " | " + timeStamp.toTime(data[j]['UNIX_TIMESTAMP(created_at)']*1000)
				tempObj = {comment_id:data[j].id, user:name, date:date,comment:data[j].comment, replies:[], pending:data[j].isPending, deleted:data[j].deleted};
				objToPushTo.replies.push(tempObj);
			}
		}
	}

	function idToUser(commentData){
		for(q=0;q<$scope.userData.length;q++){					//match user_id of comment or reply to name
			if ($scope.userData[q].id === commentData.user_id){
				return $scope.userData[q].firstName + " " + $scope.userData[q].lastName;
			}
		}
	}

	function loadComments() {//load comments
		$scope.comments = [];
		comments.get($stateParams.location, 'location').success(function(data){
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

		})
	}

	$scope.approveComment = function(id) { 
		comments.approve(id, 'location').success(function(){loadComments();});
	}

	$scope.reinstateComment = function(id) { 
		comments.reinstate(id, 'location').success(function(){loadComments();});
	}

	$scope.deleteComment = function(id) { 
		comments.delete(id, 'location').success(function(){loadComments();});
	}

	users.getAll().success(function(data){
		$scope.userData = data;
		loadComments();
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
		$scope.modal.mode = 'new';
		mediaCreation.reset($scope, 'media');
		$scope.mediaFile = $files[0];

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
		$(".overlay").fadeIn('slow');
	}

	$scope.deleteMedia = function(m) {
		media.delete(m).success(function(data){
			getMedia();
		})
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

		if ($scope.modal.type == 'media') {
			$scope.mediaThumbnailCanvasData = $scope.cropper.getCanvasData();
			$scope.mediaThumbnailCropData = $scope.cropper.getCropBoxData();
			$scope.mediaThumbnail = blob;
		} else {
			$scope.thumbnailCanvasData = $scope.cropper.getCanvasData();
			$scope.thumbnailCropData = $scope.cropper.getCropBoxData();
			$scope.fileThumbnail = blob;
			$(".thumbnail-img img").remove();
			$('.thumbnail-img').append("<img src='"+ imgSrc + "'>");
			// var formData = new FormData();
			// formData.append('croppedImage', blob);

		}

		$("#details-thumbnail").attr('src',imgSrc);

		if (command == 'finish') {
			$(".loading-text").html("Uploading");
			$(".loading").fadeIn("slow");

			locations.save($scope.file, {
				task: 'thumbnail',
				lid: $stateParams.location,
				project: $scope.projectId,
				croppedThumbnail: $scope.fileThumbnail,
				thumbCanvasData: $scope.thumbnailCanvasData,
				thumbCropData: $scope.thumbnailCropData,
				type: ($scope.modal.mode == 'edit' ? 'edit' : 'new')
			}).success(getMedia)
			$(".overlay").fadeOut('slow');

		} else {
			mediaCreation.stepInto($scope, "Crop");
			$('.modalCheckbox').slideUp('slow');
			$('.media-modal').css({height: '533px'});
			$timeout(function(){
				$('#crop-submit').animate({width:'0px'}, 500, function() {
					$('#crop-submit').css({display:'none', visibility:'hidden'});
				});
				$('#skip-forward, #step-back').css({visibility:'visible'});
				$('#skip-forward, #step-back').animate({width:'220px'}, 500);
			}, 500)

			$scope.cropper.setAspectRatio(NaN)
			setCropper('media');
		}
	}

	$scope.cropImage = function(type) {
		blob = mediaCreation.dataURLtoBlob( $scope.cropper.getCroppedCanvas().toDataURL() );
		$scope.mediaCanvasData = $scope.cropper.getCanvasData();
		$scope.mediaCropData = $scope.cropper.getCropBoxData();
		$scope.mediaImage = blob;

		$("#details").fadeOut(600, function(){
			mediaCreation.stepInto($scope, "Details")
		})
		
		$timeout(function(){$('.media-modal').css({height: '350px'});},500)
	}

	$scope.editThumbnail = function(m) {
		$scope.modal.type = 'thumbnail'
		$scope.modal.mode = 'edit';
		mediaCreation.stepInto($scope, "Thumbnail")
		$('#skip-forward, #step-back').css({width:'0px', visibility: 'hidden'});
		$('#crop-submit').css({width:'698px', display:'block', visibility:'visible'});
		$('.modalCheckbox').slideDown('fast');
		$('.media-modal').css({height: '571px'});

		m.description == null ? $scope.mediaCheckBox = false : $scope.mediaCheckBox = true;
		$scope.thumbnailCanvasData = JSON.parse(m.thumbCanvasData);
		$scope.thumbnailCropData = JSON.parse(m.thumbCropData);
		$scope.mediaId = m.id;
		$scope.modal.details.title = m.title;
		$scope.modal.details.alt = m.alt_desc;
		$scope.modal.details.desc = m.description;
		$("#details-thumbnail").attr('src',m.thumb_path);

		if (m.cropped_image_path) {
			$scope.mediaCanvasData = JSON.parse(m.imageCanvasData);
			$scope.mediaCropData = JSON.parse(m.imageCropData);
		}
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
		$(".overlay").fadeIn('slow');

	}

	$scope.editMedia = function(m) {
		mediaCreation.reset($scope, 'media')
		$scope.modal.mode = 'edit';
		$('#skip-forward, #step-back').css({width:'0px', visibility: 'hidden'});

		$scope.mediaCheckBox == true;
		$scope.mediaThumbnailCanvasData = JSON.parse(m.thumbCanvasData);
		$scope.mediaThumbnailCropData = JSON.parse(m.thumbCropData);
		$scope.mediaId = m.id;
		$scope.modal.details.title = m.title;
		$scope.modal.details.alt = m.alt_desc;
		$scope.modal.details.desc = m.description;
		$("#details-thumbnail").attr('src',m.thumb_path);

		if (m.cropped_image_path) {
			$scope.mediaCanvasData = JSON.parse(m.imageCanvasData);
			$scope.mediaCropData = JSON.parse(m.imageCropData);
		}
		imgCallback = function(){
			$scope.cropper.setAspectRatio(1/1);
			$scope.cropper.setCanvasData($scope.mediaThumbnailCanvasData);
			$scope.cropper.setCropBoxData($scope.mediaThumbnailCropData);
			document.getElementById('editable').removeEventListener('built', imgCallback);
		}
		document.getElementById('editable').addEventListener('built', imgCallback)

		if ($scope.cropper) {
			$scope.cropper.replace(m.file_path) 
		} else {
			$('#editable').attr('src', m.file_path)
			$scope.cropper = mediaCreation.initializeCropper('editable');
		}
		$(".overlay").fadeIn('slow');
	}

	$scope.viewMedia = function(m) {
		mediaCreation.stepInto($scope, 'ViewImage');
		if (m.cropped_image_path) {
			$('#viewImage').attr("src", m.cropped_image_path);
		} else {
			$('#viewImage').attr("src", m.file_path);
		}
		$('.media-modal').css({height: '533px'});
		$(".overlayViewImage").fadeIn('fast');

	}

	$scope.stepBack = function() {
		if ($scope.modal.current == 'Crop') {
			$scope.modal.type =='media' ? $('.media-modal').css({height: '533px'}) : $('.media-modal').css({height: '571px'});
			setTimeout(function() {
				$('#skip-forward, #step-back').animate({width:'0px', visibility: 'hidden'}, 500, function(){
					$('#skip-forward, #step-back').css({visibility: 'hidden'});
				});
				$('#crop-submit').css({display:'block', visibility:'visible'});
				$('#crop-submit').animate({width:'698px'}, 500);
			}, 500);
			$('.modalCheckbox').slideDown('slow');
			mediaCreation.stepInto($scope, "Thumbnail");
			$scope.cropper.setAspectRatio(1/1);
			setCropper();
		} else {
			setCropper('media');
			$('.media-modal').css({height: '533px'});
			$('#crop-submit').css({width: '0px', visibility:'visible'});
			$timeout(function(){mediaCreation.stepInto($scope, 'Crop')}, 700)
		}
	}

	$scope.stepInto = function(command, height) {
		if (command == 'Crop') {
			$('#crop-submit').animate({width:'0px'}, 500, function() {
				$('#crop-submit').css({display:'none', visibility:'hidden'});
			});
			$('#skip-forward, #step-back').css({visibility:'visible'})
			$('#skip-forward, #step-back').animate({width:'220px'}, 500)	
			$scope.cropper.setAspectRatio(NaN)
			setCropper('media');		
		} else if (command == 'Thumbnail') {
			$scope.stepBack();
		}

		if ($('.media-modal').height() >= height) {
			mediaCreation.stepInto($scope, command);
		} else {
			$timeout(function(){mediaCreation.stepInto($scope, command);},700);
		}
		$('.media-modal').height(height);
	}

	$scope.skipForward = function() {
		$("#details").fadeOut(600, function(){
			mediaCreation.stepInto($scope, "Details")
		})
		
		$timeout(function(){$('.media-modal').css({height: '350px'});},500)
	}

	$scope.saveDetails = function(isEdit) {
		console.log($scope.modal.type)
		$(".loading-text").html("Uploading");
		$(".loading").fadeIn("slow");

		if ($scope.modal.type == 'media') {
			detailsData = { id: $stateParams.location,
				type: 'loc',
				project: $scope.projectId,
				croppedImage: $scope.mediaImage,
				imageCanvasData: $scope.mediaCanvasData,
				imageCropData: $scope.mediaCropData,
				croppedThumbnail: $scope.mediaThumbnail,
				thumbCanvasData: $scope.mediaThumbnailCanvasData,
				thumbCropData: $scope.mediaThumbnailCropData,
				title: $("#details-title").val(),
				altDesc: $("#details-alt").val(),
				description: $("#details-desc").val()
			}
			if( isEdit) {
				detailsData.task = 'update'; 
				detailsData.mid = $scope.mediaId; 
			} else { 
				detailsData.task = 'create'
			}
			media.save($scope.mediaFile, detailsData).success( function() {
				$(".overlay").fadeOut('slow');
				getMedia();

			});
		} else {
			locations.save($scope.file, {
				task: 'thumbmedia',
				lid: $stateParams.location,
				project: $scope.projectId,
				croppedImage: $scope.mediaImage,
				imageCanvasData: $scope.mediaCanvasData,
				imageCropData: $scope.mediaCropData,
				croppedThumbnail: $scope.fileThumbnail,
				thumbCanvasData: $scope.thumbnailCanvasData,
				thumbCropData: $scope.thumbnailCropData,
				title: $("#details-title").val(),
				altDesc: $("#details-alt").val(),
				description: $("#details-desc").val(),
				type: ($scope.modal.mode == 'edit' ? 'edit' : 'new')
			}).success( function() {
				$(".overlay").fadeOut('slow');
				getMedia();

			});
		}
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

	//Delete location
	$scope.delete = function(){
		locations.delete($stateParams.location, $scope.projectId).success(function(data){
			//return to project
			location.href = "javascript:history.back()";
		})
	}

	//Handle "save and close"
	$scope.submit = function(){
		$(".loading-text").html("Saving");
		$(".loading").fadeIn("slow");
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
			$(".loading").fadeOut("fast");
			location.href = "javascript:history.back()";
		})
	}
});