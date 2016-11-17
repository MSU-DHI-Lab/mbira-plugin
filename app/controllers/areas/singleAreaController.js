mbira.controller("singleAreaCtrl", function ($timeout, $scope, $http, $state, $upload, $stateParams, setMap, timeStamp, exhibits, media, mediaCreation,
	projects, comments, temporary, users, areas){
	$scope.project = $stateParams.project;
	$scope.pid = $stateParams.pid;
	$scope.previous = $stateParams.previous
	$scope.userData = []
	$scope.comments = []
	$scope.modal = {current: "", type: "", mode: 'new', details: {} };
	$scope.mediaImage;
	latlngArray = []
	removed = 1000;

	projects.get($stateParams.project).success(function(data) {
        $scope.project = data[0][2];
    });

	$scope.exhibits = [];
	temp=[];

	exhibits.inExhibit($stateParams.area, 'area').success(function(data){
		ids = []
		for (a=0;a<data.length;a++){
			ids.push(data[a].id);
		}

		exhibits.getAll($scope.project).success(function(data2){
			//adds checkmark if the area is in an exhibit.
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
		$(".loading").fadeOut("slow", function(){
			media.get($stateParams.area, 'area').success(function(data){$scope.media = data});
		});

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
		comments.get($stateParams.area, 'area').success(function(data){
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
		comments.approve(id, 'area').success(function(){loadComments();});
	}

	$scope.reinstateComment = function(id) {
		comments.reinstate(id, 'area').success(function(){loadComments();});
	}

	$scope.deleteComment = function(id) {
		comments.delete(id, 'area').success(function(){loadComments();});
	}

	users.getAll().success(function(data){
		$scope.userData = data;
		loadComments();
	})

	var circleIcon = L.icon({
		iconUrl: 'js/images/marker-icon-circle.svg',
		iconSize:     [20, 20], // size of the icon
		iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
	});

	//load area info
	areas.get($stateParams.area).success(function(data){
		//Put area in scope
		$scope.area = data;
		setShortDesc()


		//Parse string to get array  of coorinates
		$scope.coordinates = JSON.parse(data.coordinates);

		//Set up map
		map = setMap.set($scope.coordinates[0].lat, $scope.coordinates[0].lng);
		map.fitBounds($scope.coordinates)

		if(data.shape == 'polygon'){
			//Create polygon from array of coordinates
			$scope.polygon = L.polygon($scope.coordinates).addTo(map)
				.on('click', function(e) {
					areaMarkers = []
					$.each(map._layers, function (ml) {
						if (map._layers[ml]._icon) {
							areaMarkers.push(this);
						}
					})
					areaMarkers.splice(areaMarkers.length-1,1)  // removes most recently added marker
					areaMarkers.sort(function(a,b){
						return Math.sqrt(Math.pow((a._latlng.lat-e.latlng.lat),2)+Math.pow((a._latlng.lng-e.latlng.lng),2)) - Math.sqrt(Math.pow((b._latlng.lat-e.latlng.lat),2)+Math.pow((b._latlng.lng-e.latlng.lng),2))
					})
					index = 0;
					areaMarkers[1].options.id > areaMarkers[0].options.id ? index = areaMarkers[1].options.id : index = areaMarkers[0].options.id;
					newMarkerID = index;
					currentlatlng = $scope.polygon._latlngs;
					for (p=0;p<currentlatlng.length;p++){
						latlngArray.push([currentlatlng[p].lat,currentlatlng[p].lng])
					}
					latlngArray.splice(index, 0, [e.latlng.lat, e.latlng.lng]);
					$scope.polygon.setLatLngs(latlngArray);
					newlatlngs = $scope.polygon._latlngs;
					$.each(map._layers, function (ml) {
						if (map._layers[ml]._icon && map._layers[ml].options.id === index) {
							index++;
							this.options.id = index;
						}
					})
					$scope.marker = L.marker([e.latlng.lat, e.latlng.lng],{icon: circleIcon, id:newMarkerID, draggable:'true'}).addTo(map)
						.on('click', function(e) {
							currentlatlng = $scope.polygon._latlngs;
							if ($scope.polygon._latlngs.length === 3){
								alert("You cannot remove this point. To remove this area, scroll down to delete the area.")
							} else {

								currentlatlng.splice(this.options.id,1);
								latlngArray = []
								for (p=0;p<currentlatlng.length;p++){
									latlngArray.push([currentlatlng[p].lat,currentlatlng[p].lng])
								}
								removedEdge = this.options.id
								map.removeLayer(this);

								$.each(map._layers, function (ml) {
									if (map._layers[ml]._icon && map._layers[ml].options.id > removedEdge) {
										this.options.id -= 1;
									}
								})

								$scope.polygon.setLatLngs(currentlatlng);
								latlngArray = [];
							}

						})

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
							latlngArray = [];
						});

					latlngArray = []
				});

				$scope.polygon.setStyle({fillColor: '#0A263D'});
				$scope.polygon.setStyle({color: '#FFF'});
				$scope.polygon.setStyle({opacity: '1'});

			for (m=0;m<$scope.polygon._latlngs.length;m++) {
				$scope.marker = L.marker([$scope.polygon._latlngs[m].lat, $scope.polygon._latlngs[m].lng],{icon: circleIcon, id:m, draggable:'true'}).addTo(map)
					.on('click', function(e) {
						currentlatlng = $scope.polygon._latlngs;
						if ($scope.polygon._latlngs.length === 3){
							alert("You cannot remove this point. To remove this area, scroll down to delete the area.")
						} else {
							currentlatlng.splice(this.options.id,1);
							latlngArray = []
							for (p=0;p<currentlatlng.length;p++){
								latlngArray.push([currentlatlng[p].lat,currentlatlng[p].lng])
							}
							removedEdge = this.options.id
							map.removeLayer(this);

							$.each(map._layers, function (ml) {
								if (map._layers[ml]._icon && map._layers[ml].options.id > removedEdge) {
									this.options.id -= 1;
								}
							})

							$scope.polygon.setLatLngs(currentlatlng);
							latlngArray = [];

						}

					})
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
						latlngArray = [];
					});

			}

		}

		//Set switches
		if($scope.area.toggle_comments == 'true'){
			$scope.area.toggle_comments = true;
		}else{
			$scope.area.toggle_comments = false;
		}
		if($scope.area.toggle_media == 'true'){
			$scope.area.toggle_media = true;
		}else{
			$scope.area.toggle_media = false;
		}
		if($scope.area.toggle_dig_deeper == 'true'){
			$scope.area.toggle_dig_deeper = true;
		}else{
			$scope.area.toggle_dig_deeper = false;
		}
		getMedia();
	})

  function setShortDesc() {
    $scope.area.short_description_prev = $scope.area.short_description
    var div = document.createElement("div");
    div.innerHTML = $scope.area.short_description; 

    text = (div.textContent || div.innerText || "")
    $scope.area.short_description_length = text.length;
    if (text.length == 1 && $scope.area.short_description == "<br>") {
      $scope.area.short_description_length = 0
    }
  }

  $scope.getLength = function(element) {
    var div = document.createElement("div");
    div.innerHTML = element; 

    text = (div.textContent || div.innerText || "");
    if (text.length == 1 && element == "<br>") {
      $scope.area.short_description_length = 0
    } else if (text.length > 400) {
      $scope.area.short_description_length = 400
      $scope.area.short_description = $scope.area.short_description_prev
    }else {
      $scope.area.short_description_length = text.length
    }

    $scope.area.short_description_prev = $scope.area.short_description
  }

	//Handle "save and close"
	$scope.submit = function(){
		$(".loading-text").html("Saving");
		$(".loading").fadeIn("slow");
		//Save
		currentlatlng = $scope.polygon.getLatLngs();
		latlngArray = []
		for (p=0;p<currentlatlng.length;p++){
			latlngArray.push({lat: currentlatlng[p].lat, lng: currentlatlng[p].lng})
		}
		geo = $scope.polygon.toGeoJSON();

		areas.save($scope.newThumb, {
				task: 'update',
				id: $stateParams.area,
				projectId: $stateParams.project,
				name: $scope.area.name,
				description: $scope.area.description,
				shortDescription: $scope.area.short_description,
				dig_deeper: $scope.area.dig_deeper,
				shape: $scope.area.shape,
				radius: $scope.area.radius,
				coordinates: JSON.stringify(latlngArray),
				json : JSON.stringify(geo),
				toggle_media: $scope.area.toggle_media,
				toggle_comments: $scope.area.toggle_comments,
				toggle_dig_deeper: $scope.area.toggle_dig_deeper
		}).success(function(data){
			$scope.header ? areas.save($scope.header, {task: 'uploadHeader', id: $stateParams.area, project: $stateParams.project}) : null ;
			exhibits.add($stateParams.area,$scope.outputExhibits, 'area')
			//Close (return to project)
			$(".loading").fadeOut("fast", function() {
				// location.href = "javascript:history.back()";
			});
		})

	}

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
			$(".loading-text").html("Uploading");
			$(".loading").fadeIn("slow");

			areas.save($scope.file, {
				task: 'thumbnail',
				aid: $stateParams.area,
				project: $stateParams.project,
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
		$(".loading-text").html("Uploading");
		$(".loading").fadeIn("slow");
		if ($scope.modal.type == 'media') {
			detailsData = { id: $stateParams.area,
				type: 'area',
				project: $stateParams.project,
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
			areas.save($scope.file, {
				task: 'thumbmedia',
				aid: $stateParams.area,
				project: $stateParams.project,
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
			}).success(getMedia)
				$(".overlay").fadeOut('slow');
				getMedia();
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

	//Delete area
	$scope.delete = function() {areas.delete($stateParams.area).success(function(data){
			//return to project
			location.href = "javascript:history.back()";
		})
	}
});
