mbira.controller("newProjectCtrl", function ($timeout, $scope, $http, $upload, $state, temporary, projects, mediaCreation){
	$scope.file;
	$scope.modal = {current: "", type: "", mode: 'new', details: {}, place: "Exp"};
	$scope.mediaImage;
	
	//model for new project
	$scope.newProject = {
	    name: "",
		shortDescription: "",
		shortDescription_prev: "",
		shortDescription_length: 0,
		description: "",
		file: "",
		logo: ""
	}
	setShortDesc();
	
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
			$scope.cropper.replace(m.image_path) 
		} else {
			$('#editable').attr('src', m.image_path)
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

  function setShortDesc() {
    $scope.newProject.shortDescription_prev = $scope.newProject.shortDescription
    var div = document.createElement("div");
    div.innerHTML = $scope.newProject.shortDescription; 

    text = (div.textContent || div.innerText || "")
    $scope.newProject.shortDescription_length = text.length;
    if (text.length == 1 && $scope.newProject.shortDescription == "<br>") {
      $scope.newProject.shortDescription_length = 0
    }
  }

  $scope.getLength = function(element) {
    var div = document.createElement("div");
    div.innerHTML = element; 
    text = (div.textContent || div.innerText || "");
    if (text.length == 1 && element == "<br>") {
      $scope.newProject.shortDescription_length = 0
    } else if (text.length > 150) {
      $scope.newProject.shortDescription_length = 150
      $scope.newProject.shortDescription = $scope.newProject.shortDescription_prev
    }else {
      $scope.newProject.shortDescription_length = text.length
    }

    $scope.newProject.shortDescription_prev = $scope.newProject.shortDescription
  }	
	
	//Submit new project
	$scope.submit = function() {
		$(".loading-text").html("Saving");
		$(".loading").fadeIn("slow");
		//$files1 = [$scope.file, $scope.logo];
		projects.save($scope.file, {
			task: 'create', 
			name: $scope.newProject.name, 
			shortDescription: $scope.newProject.shortDescription, 
			description: $scope.newProject.description}
		).success(function(data) {	
			//upload logo
			projID = data;

			if (typeof $scope.thumbSave !== "undefined") {
				$scope.thumbSave[1].project = projID;
				projects.save($scope.thumbSave[0], $scope.thumbSave[1]);
			}
			
			projects.save($scope.logo,{task: 'uploadLogo', id: projID}).success(function(){
				projects.save($scope.header,{task: 'uploadHeader', id: projID}).success(function() {
					$(".loading").fadeOut("slow", function(){
						location.href = "javascript:history.back()";
					});
				});

			});

			//upload header
			

			// return to project

			
		});
	}
});
