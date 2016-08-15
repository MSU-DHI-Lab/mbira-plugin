mbira.controller("exhibitInfoCtrl", function ($timeout, $scope, $http, $upload, $stateParams, $state, temporary, exhibits, mediaCreation){
	$scope.project = $stateParams.project;
	$scope.pid = $stateParams.pid;
	$scope.id = $stateParams.exhibit;
	$scope.exhibit = {};
	$scope.file;
	$scope.modal = {current: "", type: "", mode: 'new', details: {}, place: "Exp"};
	$scope.mediaImage;

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

		exhibits.save($scope.file, {
			task: 'thumbnail',
			eid: $stateParams.exhibit,
			project: $scope.project,
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

	//load exhibit info
	exhibits.get($stateParams.exhibit).success(function(data){
		console.log(data)
		//Put exhibit in scope
		$scope.exhibit = data;
		$('.thumbnail img').attr('src', $scope.exhibit.thumb_path )
		$('.thumbnail-header img').attr('src', $scope.exhibit.header_image_path )
	})

	//Handle "save and close"
	$scope.submit = function(){
		//Save
		$(".loading-text").html("Saving");
		$(".loading").fadeIn("slow");
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
			$(".loading").fadeOut("slow", function(){location.href = "javascript:history.back()";});
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
