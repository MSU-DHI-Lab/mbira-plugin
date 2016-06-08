mbira.controller("mediaLibrary", function ($scope, $http, media, mediaCreation){
	$scope.modal = {current: "", type: "", mode: 'new', details: {} };
	$scope.mediaImage;

	//Get all media
	function getMedia(){
  		media.getAll().success(function(data){
  			$scope.media = data
  		});

    }

    getMedia();

	function setCropper(type) {	
		// $scope.modal.type == 'media' ? mediaCreation.srcFromFile($scope.mediaFile) : mediaCreation.srcFromFile($scope.file);
		if (type == 'media') {
			$scope.cropper.setCanvasData($scope.modal.type == 'media' ? $scope.mediaCanvasData : $scope.thumbnailImageCanvasData);
			$scope.cropper.setCropBoxData($scope.modal.type == 'media' ? $scope.mediaCropData : $scope.thumbnailImageCropData);
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
		if ($scope.modal.type == 'media') {
			$scope.mediaCanvasData = $scope.cropper.getCanvasData();
			$scope.mediaCropData = $scope.cropper.getCropBoxData();
			$scope.mediaImage = blob;
		} else {
			$scope.thumbnailMediaCanvasData = $scope.cropper.getCanvasData();
			$scope.thumbnailMediaCropData = $scope.cropper.getCropBoxData();
			$scope.fileThumbnailImage = blob;
		}

		$("#details").fadeOut(600, function(){
			mediaCreation.stepInto($scope, "Details")
		})
		
		$timeout(function(){$('.media-modal').css({height: '350px'});},500)
	}

	$scope.editThumbnail = function() {
		$scope.modal.type = 'thumbnail'
		mediaCreation.stepInto($scope, "Thumbnail")
		$('#skip-forward, #step-back').css({width:'0px', visibility: 'hidden'});
		$('#crop-submit').css({width:'698px'});
		$('.modalCheckbox').slideDown('fast');
		$('.media-modal').css({height: '571px'});
		mediaCreation.stepInto($scope, "Thumbnail")
		$scope.cropper.setAspectRatio(1/1);
		setCropper();
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
		console.log(m)

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
		$scope.thumbnailMediaCanvasData = null;
		$scope.thumbnailMediaCropData = null;
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
				detailsData.task = 'update'; 
				detailsData.mid = $scope.mediaId; 
			} else { 
				detailsData.task = 'create'
			}
			media.save($scope.mediaFile, detailsData).success(getMedia);
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

	$scope.multiselect = function() {
		$('#select').toggleClass("active");
		$scope.multiselect = true;
	}

	$scope.addToMultiselect = function(m, $event) {
		$($event.target).toggleClass('selected')
		console.log(m);
	}

});	