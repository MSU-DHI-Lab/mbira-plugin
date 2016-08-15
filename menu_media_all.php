<!DOCTYPE html>
<html>
    <head>
    	<link rel="stylesheet" type="text/css" href="app/assets/stylesheets/media.css"/>
    </head>
	<body ng-app="mbira">		
		<div class="library" ng-controller='mediaLibrary'>
			<div id="media-modal-1" class="overlay" ng-click="resetCropper()">
				<div class="media-modal">
					<div class="media-modal-header">
						<div ng-show="mediaCheckBox" class="crop-steps animate-show flex wrap-row space-between">
							<span class="modal-step" ng-class="{'current-step': modal.current == 'Thumbnail', 'pointer': modal.mode == 'edit'}" ng-click="modal.mode == 'edit' ? stepInto('Thumbnail', 533) : null">1. Thumbnail</span> 
							<span class="modal-step" ng-class="{'current-step': modal.current == 'Crop', 'pointer': modal.mode == 'edit'}" ng-click="modal.mode == 'edit' ? stepInto('Crop', 533) : null">2. Crop</span> 
							<span class="modal-step" ng-class="{'current-step': modal.current == 'Details', 'pointer': modal.mode == 'edit'}" ng-click="modal.mode == 'edit' ? stepInto('Details', 350) : null">3. Details</span>
						</div>
						<div class="close" ng-click="resetCropper()">&times;</div>
					</div>
					<div ng-show="modal.current == 'Thumbnail' || modal.current == 'Crop'" ng-include src="'app/views/media/partials/_thumbnail_image_crop.html'"></div>
					<div class="animate-hide" id="details" ng-show="modal.current == 'Details'" ng-include src="'app/views/media/partials/_image_details.html'"></div>
				</div>
			</div> 

			<div ng-show="modal.current == 'ViewImage'" ng-include src="'app/views/media/partials/_view_image.html'"></div>

			<div class="header">
				<h1>MEDIA LIBRARY</h1>
			</div>

			<div id="subheader" class="remove-outline flex space-between align-center">
				<input id="search" placeholder="SEARCH"></input>
				<!-- <div>UPLOADED BY&nbsp;<i class="fa fa-chevron-down fa-1" aria-hidden="true"></i></div> -->
				<div>TYPE&nbsp;<i class="fa fa-chevron-down fa-1" aria-hidden="true"></i></div>
				<div>DATE&nbsp;<i class="fa fa-chevron-down fa-1" aria-hidden="true"></i></div>
				<div>PROJECT&nbsp;<i class="fa fa-chevron-down fa-1" aria-hidden="true"></i></div>
				<div id="select" ng-click="multiselect()">SELECT</div>
			</div>
			<div class="medias">	
				<div class='media' ng-repeat='m in media' ng-if="(m.description != null) && m.file_path != 'app/assets/images/Default.png'" ng-click="multiselect == true ? addToMultiselect(m, $event) : null">
					<img ng-src='{{m.thumb_path}}' height="127" width="127">
					<div class="deleteMedia" ng-click="deleteMedia(m)"><i class="fa fa-trash-o fa-1" aria-hidden="true"></i></div>
					<div class="editMedia" ng-click="editMedia(m)"><i class="fa fa-pencil fa-1" aria-hidden="true"></i></div>
					<div class="viewMedia" ng-click="viewMedia(m)"><i class="fa fa-arrows-alt fa-1" aria-hidden="true"></i></div>
				</div>
			</div>
	
		</div>

		<script type='text/javascript'>

			$(".overlay *").click(function(e) {
			    e.stopPropagation();
			});

			var cropper;

			var vtoggle = -1
			var htoggle = -1

			function toggleFlip(type) {
				if (type == "vertical") {
					cropper.scaleY(vtoggle)
					vtoggle == -1 ? vtoggle = 1 : vtoggle = -1;
				} else {
					cropper.scaleX(htoggle)
					htoggle == -1 ? htoggle = 1 : htoggle = -1;
				}
			}

		</script>

	</body>
</html>