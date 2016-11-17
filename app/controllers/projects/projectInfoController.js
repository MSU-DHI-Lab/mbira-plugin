mbira.controller("projectInfoCtrl", function ($timeout, $scope, $http, $upload, $stateParams, $state, temporary, projects, mediaCreation){
	$scope.pid = $stateParams.pid;
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

		projects.save($scope.file, {
			task: 'thumbnail',
			project: $stateParams.project,
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
			$('.headerImg').attr('src', 'tmp/temp_header.jpg?' + (new Date).getTime()) // forces img refresh	
		});
	};	
	
	//Get Logo 
	$scope.onLogoSelect = function($files) {
		$scope.logo = $files[0];
		temporary.logo($files).success(function() {	
			$('.logoImg').attr('src', 'tmp/temp_logo.jpg?' + (new Date).getTime()) // forces img refresh	
			$('.logoImg').css('object-fit: contain;')
		});
	};

	//Get single project info
	projects.get($stateParams.project).success(function(data){
		//Set to scope
		$scope.project = data[0];
		if ($scope.project.logo_image_path) {
			$('.logoImg').attr('src', $scope.project.logo_image_path )
		}
		if ($scope.project.header_image_path) {
			$('.headerImg').attr('src', $scope.project.header_image_path )
		}
		$('.projectImg').attr('src', $scope.project.image_path )
		setShortDesc();
	})
	
  function setShortDesc() {
    $scope.project.shortDescription_prev = $scope.project.shortDescription
    var div = document.createElement("div");
    div.innerHTML = $scope.project.shortDescription; 

    text = (div.textContent || div.innerText || "")
    $scope.project.shortDescription_length = text.length;
    if (text.length == 1 && $scope.project.shortDescription == "<br>") {
      $scope.project.shortDescription_length = 0
    }
  }

  $scope.getLength = function(element) {
    var div = document.createElement("div");
    div.innerHTML = element; 

    text = (div.textContent || div.innerText || "");
    if (text.length == 1 && element == "<br>") {
      $scope.project.shortDescription_length = 0
    } else if (text.length > 150) {
      $scope.project.shortDescription_length = 150
      $scope.project.shortDescription = $scope.project.shortDescription_prev
    }else {
      $scope.project.shortDescription_length = text.length
    }

    $scope.project.shortDescription_prev = $scope.project.shortDescription
  }

	//Handle "save and close"
	$scope.submit = function(){
		//Save		
		$(".loading-text").html("Saving");
		$(".loading").fadeIn("slow");
		console.log($scope.project)
		projects.save($scope.file, 
			{ 
				task: 'update',
				id: $stateParams.project,
				name: $scope.project.name,
				shortDescription: $scope.project.shortDescription,
				description: $scope.project.description,
				path: $scope.project.image_path,
				file: $scope.file
			}).success(function(data) {
			
				$scope.logo ? projects.save($scope.logo, {task: 'uploadLogo', id: $stateParams.project}) : null;

				//upload header
				$scope.header ? projects.save($scope.header, {task: 'uploadHeader', id: $stateParams.project}) : null;

				// return to project
				$(".loading").fadeOut("slow", function(){location.href = "javascript:history.back()";});
			
		});
	}
	
	//Delete project
	$scope.delete = function(){
		projects.delete($stateParams.project).success(function(data){
			//return to project
			location.href = "#/projects"
		})
	}
	
});