mbira.controller("newAreaCtrl", function ($timeout, $scope, $http, $upload, $stateParams, setMap, projects, exhibits, temporary, areas, mediaCreation, media){
	$scope.marker = false;
	$scope.mark = '';
	$scope.file;
	$scope.ID = $stateParams.project;
	$scope.PID = $stateParams.pid;
	$scope.markers = [];
	$scope.radius = '300';
	$scope.polygon = '';
	var newlatlngs;
	$scope.tmpID = 0;
	$scope.media = [];
	$scope.images = [];
	$scope.modal = {current: "", type: "", mode: 'new', details: {} };
	$scope.mediaImage; 
	$scope.done = false;

	projects.get($stateParams.project).success(function(data) {
        $scope.project = data[0][2];
    });

	//new area model
	$scope.newArea = {
		name: "",
		description: "",
		shortDescription: "",
		dig_deeper: '',
		file:"",
		shape: "",
		radius: "",
		coordinates: [],
		toggle_media: true,
		toggle_dig_deeper: true,
		toggle_comments: true
	}

	$scope.exhibits = [];
	temp=[];

	exhibits.getAll($scope.ID).success(function(data){
		if (!data.length) {
			$scope.exhibits.push({name:'No Exhibits'})
		}else {
			for(i=0;i<data.length;i++){
				temp.push({name:data[i].name,id:data[i].id, ticked:false});

			}
			$scope.exhibits=temp;
		}
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
					project: $scope.ID,
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
			detailsData = {
				type: 'area',
				project: $scope.ID,
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
					project: $scope.ID,
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

	//submit new area
	$scope.submit = function() {
		$(".loading-text").html("Saving");
		$(".loading").fadeIn("slow");
		geo = $scope.polygon.toGeoJSON()
		areas.save($scope.file, {
				task: 'create',
				projectId: $scope.ID,
				name: $scope.newArea.name,
				description: $scope.newArea.description,
				shortDescription: $scope.newArea.shortDescription,
				dig_deeper: $scope.newArea.dig_deeper,
				shape: $scope.newArea.shape,
				radius: $scope.newArea.radius,
				coordinates: $scope.newArea.coordinates,
				json : JSON.stringify(geo),
				toggle_media: $scope.newArea.toggle_media,
				toggle_dig_deeper: $scope.newArea.toggle_dig_deeper,
				toggle_comments: $scope.newArea.toggle_comments
		}).success(function(data) {
			console.log(data);
			//Save media
			if (typeof $scope.media !== "undefined") {
				for(var i = 0; i < $scope.media.length; i++) {
					$scope.media[i][1].id = data;
					media.save($scope.media[i][0], $scope.media[i][1]);
				}
			}

			// upload header
			if (typeof $scope.thumbSave !== "undefined") {
				$scope.thumbSave[1].aid = data;
				areas.save($scope.thumbSave[0], $scope.thumbSave[1]);
			}
			areas.save($scope.header, {task: 'uploadHeader', id: data, project: $scope.ID});

			exhibits.add(data,$scope.outputExhibits, 'area');

			$(".loading").fadeOut("slow", function(){
				location.href = "#/viewProject/?project="+$scope.ID+'&pid='+$scope.PID;
			});
		});
	};

	//Reset markers on map
	$scope.clearMarkers = function(){
		$scope.markers.forEach(function(mark){
			map.removeLayer(mark);
		})
		$scope.newArea.coordinates = [];
		$scope.markers = [];

		$scope.newArea.shape = '';

		map.removeLayer($scope.polygon);
	}

	//Create polygon out of multiple markers
	$scope.createPolygon = function(){
		//remove any markers and shapes already there
		// $scope.markers.forEach(function(mark){
			// map.removeLayer(mark);
		// })
		map.removeLayer($scope.polygon);
		//Create polygon from array of coordinates
		$scope.polygon = L.polygon($scope.newArea.coordinates).addTo(map);
		$scope.polygon.setStyle({fillColor: '#0A263D'});
		$scope.polygon.setStyle({color: '#FFF'});
		if(!$scope.done){
			$scope.polygon.setStyle({opacity: '1'});
		} else {
			$scope.polygon.setStyle({opacity: '1'});
		}
		// $scope.polygon.setStyle({stroke: false});
		newlatlngs = $scope.polygon._latlngs;
		//reset array of markers
		$scope.markers = [];

		//set shape
		$scope.newArea.shape = 'polygon';
	}

	//<MAP_STUFF>
	//initialize map
	var map = setMap.set(42.7404566603398, -84.54528808595);

	//initialize search bar
	$scope.search = new L.Control.GeoSearch({
		provider: new L.GeoSearch.Provider.OpenStreetMap(),
		position: 'topcenter',
		showMarker: false,
		scope: $scope,
		location: $scope.mark,
		map: map
	}).addTo(map);

	var circleIcon = L.icon({
		iconUrl: 'js/images/marker-icon-circle.svg',
		iconSize:     [20, 20], // size of the icon
		iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
	});

	//Click to set marker and save location to scope
	count = 0;
	var id = 0;
	map.on('click', function(e) {
		$scope.newArea.coordinates.push({lat: e.latlng.lat, lng: e.latlng.lng});
		var marker = L.marker(e.latlng, {icon: circleIcon, id: id++, draggable: 'true'}).addTo(map)
			.on('drag', function(event){
				var marker = event.target;
				var position = marker.getLatLng();
				newLatLngs = $scope.polygon.getLatLngs();
				newLatLngs[marker.options.id].lat = position.lat;
				newLatLngs[marker.options.id].lng = position.lng;
				latlngArray = []
				for (p=0;p<newLatLngs.length;p++){
					latlngArray.push([newLatLngs[p].lat,newLatLngs[p].lng])
				}
				$scope.polygon.setLatLngs(latlngArray);
				$scope.newArea.coordinates = $scope.polygon.getLatLngs();
				console.log($scope.newArea.coordinates)
				latlngArray = [];
			}).on('click', function(e) {
				if(!$scope.done && id >= 3 && this._latlng.lat == $scope.polygon.getLatLngs()[0].lat && this._latlng.lng == $scope.polygon.getLatLngs()[0].lng) {
					$scope.done = true;
					$scope.polygon.setStyle({opacity: '1'});
					$scope.polygon.setStyle({dashArray: null});
					if($scope.ghostMarker){
						// map.removeLayer($scope.tooltip);
						map.removeLayer($scope.ghostMarker);
					}
					if($scope.ghostLine1){
						map.removeLayer($scope.ghostLine1);
						map.removeLayer($scope.ghostLine2);
					}
					$('#done').fadeIn('slow');
				} else {
					currentlatlng = $scope.polygon._latlngs;
					currentlatlng.splice(this.options.id,1);
					latlngArray = [];
					$scope.newArea.coordinates = [];
					for (p=0; p<currentlatlng.length; p++){
						latlngArray.push([currentlatlng[p].lat,currentlatlng[p].lng]);
					}
					removedEdge = this.options.id;
					map.removeLayer(this);

					var highest = 1;
					$.each(map._layers, function (ml) {
						if (map._layers[ml]._icon && map._layers[ml].options.id > removedEdge) {
							this.options.id -= 1;
							id = this.options.id + 1;
							highest = 0;
						}
					})

					if (highest) {
						id = id - 1;
					}

					$scope.polygon.setLatLngs(currentlatlng);
					$scope.newArea.coordinates = $scope.polygon.getLatLngs();
					latlngArray = [];
				}
			})
			.on('mouseover', function(e) {

				// marker.bindPopup('HI', {'offset': L.point(0,-10)}).openPopup();
				if($scope.ghostMarker){
					$scope.onPin = true;
					// map.removeLayer($scope.tooltip);
					map.removeLayer($scope.ghostMarker);
				}
			})
			.on('mouseout', function(e) {
				marker.closePopup();
				if($scope.ghostMarker){
					$scope.onPin = false;
				}
			});
		$scope.markers.push(marker);
		$scope.createPolygon();
		$scope.$apply();
		// if (id >= 3){
			// $('#done').fadeIn('slow');
		// }
	});

	var coords;
	map.on('mousemove', function(e) {
		if(!$scope.done) {
			if ($scope.polygon) {

				if($scope.onPin) {
					if($scope.ghostMarker){
						// map.removeLayer($scope.tooltip);
						map.removeLayer($scope.ghostMarker);
					}
				} else {
					coords = $scope.polygon.getLatLngs();
					if($scope.ghostMarker){
						// map.removeLayer($scope.tooltip);
						map.removeLayer($scope.ghostMarker);
					}
					if($scope.ghostLine1){
						map.removeLayer($scope.ghostLine1);
						map.removeLayer($scope.ghostLine2);
					}
					// $scope.tooltip = L.marker(e.latlng, {icon: tooltip, opacity: .85}).addTo(map);
					$scope.ghostMarker = L.marker(e.latlng, {icon: circleIcon, opacity: '.5'}).addTo(map);
					$($scope.ghostMarker._icon).addClass('ghost');
					$scope.ghostLine1 = L.polyline([coords[coords.length-1], e.latlng], {dashArray: "5, 10", color: "#0A263D"}).addTo(map);
					$scope.ghostLine2 = L.polyline([coords[0], e.latlng], {dashArray: "5, 10", color: "#0A263D"}).addTo(map);
				}

				if($scope.ghostLine1){
					map.removeLayer($scope.ghostLine1);
					map.removeLayer($scope.ghostLine2);
				}
				// $scope.tooltip = L.marker(e.latlng, {icon: tooltip, opacity: .85}).addTo(map);
				$scope.ghostLine1 = L.polyline([coords[coords.length-1], e.latlng], {dashArray: "5, 10", color: "#0A263D"}).addTo(map);
				$scope.ghostLine2 = L.polyline([coords[0], e.latlng], {dashArray: "5, 10", color: "#0A263D"}).addTo(map);
			}
		}
	});

	//Click to set marker and save location to scope
	$("#done").on('click', function(e) {
		e.stopPropagation()
		$scope.done = true;
		$('#done').fadeOut('slow', function() {
			$('#done').remove();
			$('.area_info').fadeIn('slow', function(){
				$('html,body').animate({scrollTop: $('.area_info').offset().top}, 1500);
			});
		});
	});

	//</MAP_STUFF>
});