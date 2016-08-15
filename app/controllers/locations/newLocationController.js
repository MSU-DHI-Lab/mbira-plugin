//creating a new location
mbira.controller("newLocationCtrl", function ($timeout, $scope, $http, $upload, $stateParams, setMap, $state, exhibits, projects, temporary, locations, media, mediaCreation, ip){
	$scope.marker = false;
	$scope.projectId = $stateParams.project;
	$scope.PID = $stateParams.pid;
	$scope.exhibits = [];
	$scope.tmpID = 0;
	$scope.media = [];
	$scope.images = [];
	$scope.modal = {current: "", type: "", mode: 'new', details: {} };
	$scope.mediaImage; 

	projects.get($stateParams.project).success(function(data, status) {
        $scope.project = data[0][2];
    });

	//new location model
	$scope.newLocation = {
		name: "",
		description: "",
		shortDescription: "",
		dig_deeper: "",
		file: "",
		latitude: '',
		longitude: '',
		toggle_comments: true,
		toggle_media: true,
		toggle_dig_deeper: true

	}
	
	temp=[];
	exhibits.getAll($scope.projectId).success(function(data){
		if (!data.length) {
			$scope.exhibits.push({name:'No Exhibits'})
		}else {
			for(i=0;i<data.length;i++){
				temp.push({name:data[i].name,id:data[i].id, ticked:false});
			}
			$scope.exhibits = temp;
		}
	});

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
			$(".thumbnail-img").empty();
			$('.thumbnail-img').append("<img src='"+ imgSrc + "'>");
			// var formData = new FormData();
			// formData.append('croppedImage', blob);

		}

		$("#details-thumbnail").attr('src',imgSrc);

		if (command == 'finish') {
			$scope.thumbSave = []
			$scope.thumbSave = [ 
				$scope.file, 
				{
					task: 'thumbnail',
					lid: $stateParams.location,
					project: $scope.projectId,
					croppedThumbnail: $scope.fileThumbnail,
					thumbCanvasData: $scope.thumbnailCanvasData,
					thumbCropData: $scope.thumbnailCropData,
					type: 'new'
				}
			]

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
														// Find current media in array of media and replace
				// detailsData.task = 'update'; 
				// detailsData.mid = $scope.mediaId; 
			} else { 
				detailsData.task = 'create'
			}

			$scope.media.push([$scope.mediaFile, detailsData, URL.createObjectURL($scope.mediaThumbnail)]);
			$(".overlay").fadeOut('slow');	
		} else {
			$scope.thumbSave = []
			$scope.thumbSave = [ 
				$scope.file, 
				{
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
					type: 'new'
				} 
			]
		}
		$(".overlay").fadeOut('slow');	
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

	$scope.submitMedia = function($files) {
		$scope.mediaFile = $files[0];
		mediaData = temporary.media($files, $scope.tmpID, $scope);
	}

	function findByName (array, test) {
        for (var x = 0; x < array.length; x++) {
            if (array[x].name == test) return x;
        }
        return -1;
    }

	$scope.deleteMedia = function(m) {
		$scope.media.splice($scope.media.indexOf(m), 1);

	}

	//submit new location
	$scope.submit = function() {
		$(".loading-text").html("Saving");
		$(".loading").fadeIn("slow");
		//submit location

		locations.save($scope.file, {
			task: 'create',
			projectId: $scope.projectId,
			pid: $stateParams.pid,
			name: $scope.newLocation.name,
			description: $scope.newLocation.description,
			shortDescription: $scope.newLocation.shortDescription,
			dig_deeper: $scope.newLocation.dig_deeper,
			lat: $scope.newLocation.latitude,
			lon: $scope.newLocation.longitude,
			toggle_media: $scope.newLocation.toggle_media,
			toggle_dig_deeper: $scope.newLocation.toggle_dig_deeper,
			toggle_comments: $scope.newLocation.toggle_comments
		}).success(function(data) {
			//Save media
			if (typeof $scope.media !== "undefined") {
				for(var i = 0; i < $scope.media.length; i++) {
					$scope.media[i][1].id = data;
					media.save($scope.media[i][0], $scope.media[i][1]);
				}
			}

			// upload header
			if (typeof $scope.thumbSave !== "undefined") {
				$scope.thumbSave[1].lid = data;
				locations.save($scope.thumbSave[0], $scope.thumbSave[1]);
			}

			locations.save($scope.header, {task: 'uploadHeader', id: data, project: $scope.projectId});

			exhibits.add(data,$scope.outputExhibits, 'loc');
			// return to project
			$(".loading").fadeOut("slow", function(){
				location.href = "#/viewProject/?project="+$scope.projectId+'&pid='+$scope.PID;
			});
			
		});
	};

	//<MAP_STUFF>
	//initialize map
	// loc = ip.get().success(function(loc) {
		// var map = setMap.set(loc.latitude,loc.longitude);
		var map = setMap.set();

		//initialize search bar
		$scope.search = new L.Control.GeoSearch({
			provider: new L.GeoSearch.Provider.OpenStreetMap(),
			position: 'topcenter',
			showMarker: false,
			scope: $scope,
			location: $scope.newLocation,
			map: map
		}).addTo(map);	
		
		var newIcon = L.icon({
			iconUrl: 'js/images/LocationMarker.svg',
			iconSize:     [30, 40], // size of the icon
			iconAnchor:   [13, 38], // point of the icon which will correspond to marker's location
		});

		var tooltip = L.icon({
			iconUrl: 'js/images/marker-tooltip.png',
			iconSize:     [196, 40], // size of the icon
			iconAnchor:   [-10, 20], // point of the icon which will correspond to marker's location
		});

		//Click to set marker and save location to scope
		map.on('click', function(e) {
			$scope.selected = true;
			map.removeLayer($scope.ghostMarker);
			map.removeLayer($scope.tooltip);
			if($scope.marker != false){
				map.removeLayer($scope.marker);
				$scope.marker = false;
			}
			// if($scope.search._positionMarker){
				// map.removeLayer($scope.search._positionMarker);
			// }
			$scope.newLocation.latitude = e.latlng.lat;
			$scope.newLocation.longitude = e.latlng.lng;

			$scope.marker = L.marker(e.latlng, {icon: newIcon, draggable:true}).addTo(map);
			$scope.$apply();
			$('#done').fadeIn('slow');
		});

		map.on('mousemove', function(e) {
			if ($scope.marker == false) {
				if($scope.ghostMarker){
					map.removeLayer($scope.tooltip);
					map.removeLayer($scope.ghostMarker);
				}
				$scope.tooltip = L.marker(e.latlng, {icon: tooltip, opacity: 1}).addTo(map);
				$scope.ghostMarker = L.marker(e.latlng, {icon: newIcon, opacity: .5}).addTo(map);
				$scope.$apply();
			}
		});	
	// })

	//Click to set marker and save location to scope
	$("#done").on('click', function(e) {
		e.stopPropagation()
		$('#done').fadeOut('slow', function() {
			$('#done').remove();
			$('.loc_info').fadeIn('slow', function(){
				$('html,body').animate({scrollTop: $('.loc_info').offset().top}, 1500);
			});
		});
	});
	//</MAP_STUFF>
});