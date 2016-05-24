//creating a new location
mbira.controller("newLocationCtrl", function ($scope, $http, $upload, $stateParams, setMap, $state, exhibits, projects, temporary, locations, media, ip){
	$scope.marker = false;
	$scope.projectId = $stateParams.project;
	$scope.PID = $stateParams.pid;
	$scope.exhibits = [];
	$scope.tmpID = 0;
	$scope.media = [];
	$scope.images = [];

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
	exhibits.getAll().success(function(data){
		if (!data.length) {
			$scope.exhibits.push({name:'No Exhibits'})
		}else {
			for(i=0;i<data.length;i++){
				temp.push({name:data[i].name,id:data[i].id, ticked:false});
			}
			$scope.exhibits = temp;
		}
	});

	//Get file to be uploaded
	$scope.onFileSelect = function($files) { 
		$scope.file = $files[0];
		temporary.thumbnail($files).success(function(data) {
			// $scope.images.unshift($scope.file);
			$('.thumbnail img').attr('src', 'tmp/temp.jpg?' + (new Date).getTime()) // forces img refresh
		});
	};

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
		$scope.images.splice(findByName($scope.images, m.originalName), 1);
	}

	//submit new location
	$scope.submit = function() {
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
			console.log(data);
			//Save media
			for(var i = 0; i < $scope.images.length; i++) {
				media.save($scope.images[i], data, 'loc', $scope.projectId);
			}

			// upload header
			locations.save($scope.header, {task: 'uploadHeader', id: data, project: $scope.projectId});

			exhibits.add(data,$scope.outputExhibits, 'loc');
			// return to project
			location.href = "#/viewProject/?project="+$scope.projectId+'&pid='+$scope.PID;
		});
	};

	//<MAP_STUFF>
	//initialize map
	loc = ip.get().success(function(loc) {
		var map = setMap.set(loc.latitude,loc.longitude);

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
	})

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