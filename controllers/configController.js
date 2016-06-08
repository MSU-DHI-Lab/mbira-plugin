var mbira  = angular.module('mbira', ['ui.router', 'angularFileUpload', 'angular-sortable-view', 'isteven-multi-select', 'ngAnimate']);

mbira.config(function($stateProvider, $urlRouterProvider) {
	
	$urlRouterProvider.otherwise("/projects");
	
	$stateProvider
	  .state('mediaLibrary', {
	    url: "/media",
	    templateUrl: "menu_media_all.php"
	  })
	  .state('projects', {
	    url: "/projects",
	    templateUrl: "menu_project_all.php"
	  })
	  .state('viewProject', {
	    url: "/viewProject/?project&pid",
	    templateUrl: "project_single.php"
	  })
	  .state('projectInfo', {
	    url: "/projectInfo/?project&pid",
	    templateUrl: "project_info.html"
	  })
	  .state('newProject', {
	    url: "/newProject",
	    templateUrl: "menu_project_new.php"
	  })
	   .state('users', {
	    url: "/users",
	    templateUrl: "menu_user_all.php"
	  })
	  .state('addUsers', {
	    url: "/addUser?project&pid&previous",
	    templateUrl: "project_add_users.html"
	  })
	  .state('newUser', {
	    url: "/newUser",
	    templateUrl: "new_user.html"
	  })
	   .state('exhibits', {
	    url: "/exhibits",
	    templateUrl: "menu_exhibit_all.php"
	  })
	  .state('viewExhibit', {
	    url: "/viewExhibit?project&exhibit&pid&previous",
	    templateUrl: "exhibit_single.html"
	  })
	  .state('newExhibit', {
	    url: "/newExhibit/?project&pid",
	    templateUrl: "exhibit_new.html"
	  })
	  .state('exhibitInfo', {
	    url: "/exhibitInfo/?project&exhibit&pid",
	    templateUrl: "exhibit_info.html"
	  })
	   .state('locations', {
	    url: "/locations",
	    templateUrl: "menu_location_all.php"
	  })
	  .state('viewLocation', {
	    url: "/viewLocation/?project&location&pid&previous",
	    templateUrl: "views/locations/location_single.html"
	  })
	  .state('newLocation', {
	    url: "/newLocation/?project&pid",
	    templateUrl: "location_new.html"
	  })
	   .state('areas', {
	    url: "/areas",
	    templateUrl: "menu_area_all.php"
	  })
	  .state('viewArea', {
	    url: "/viewArea/?project&area&pid&previous",
	    templateUrl: "area_single.html"
	  })
	  .state('newArea', {
	    url: "/newArea/?project&pid",
	    templateUrl: "area_new.html"
	  })
	   .state('explorations', {
	    url: "/explorations",
	    templateUrl: "menu_exploration_all.php"
	  })
	  .state('viewExploration', {
	    url: "/viewExploration/?project&exploration&pid&previous",
	    templateUrl: "exploration_single.html"
	  })
	  .state('newExploration', {
	    url: "/newExploration/?project&pid",
	    templateUrl: "exploration_new.html"
	  })
	  .state('notifications', {
	    url: "/notifications",
	    templateUrl: "menu_notification_all.php"
	  })
	  .state('deviceSettings', {
	    url: "/settings",
	    templateUrl: "device_settings.html"
	  })
});

mbira.directive('matchPassword', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            // ctrl.$parsers.unshift(function (viewValue, $scope) {
                // var noMatch = viewValue != scope.newUserForm.pass1.$viewValue
                // ctrl.$setValidity('noMatch', !noMatch)
            // });
			
			ctrl.$parsers.push(function (value) {
				if(value == scope.newUserForm.pass1.$viewValue) {
					return value;
				}
				
                return undefined;
            });
        }
    }
});

mbira.factory('ip', function () {
	return {
		get: function () {
		    return $.ajax({
		        url: '//freegeoip.net/json/',
		        type: 'POST',
		        dataType: 'jsonp',
		    });		
		}
	}
});

mbira.factory('setMap', function(){	
	//initialize map
	return {
		set: function(lat, lon){
			var map = L.map('map').setView([lat, lon], 14);
            
            var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
                maxZoom: 18
            });

            var mqosm = L.tileLayer('http://otile1.mqcdn.com//tiles/1.0.0/map/{z}/{x}/{y}.jpg', {
                attribution: 'Map data &copy; <a href="http://developer.mapquest.com/web/products/open/map">MapQuest-OSM</a>',
                maxZoom: 18
            });

            var mqoa = L.tileLayer('http://otile1.mqcdn.com//tiles/1.0.0/sat/{z}/{x}/{y}.jpg', {
                attribution: 'Map data &copy; <a href="http://developer.mapquest.com/web/products/open/map">MapQuest Open Aerial</a>',
                maxZoom: 18
            });
                        
            var mbsat = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                maxZoom: 18,
                id: 'matrix-msu.m7d03jfe',
                accessToken: 'pk.eyJ1IjoibWF0cml4LW1zdSIsImEiOiJmU1NPbUFjIn0.MWCWCMSJ8Ar-6KZtNPzy4w'
            });
                        
            var baseMaps = {
                'OpenStreetMap': osm,
                'MapQuest OpenStreetMap': mqosm,
                'MapQuest Open Aerial': mqoa,
                'Mapbox Satellite': mbsat
            };
            
            osm.addTo(map);
            
            L.control.layers(baseMaps).addTo(map);
			
			map.invalidateSize(false);
			return map;
		}
	}
});

mbira.factory('getProject', function ($http) {
	return {
		name: function (id) {
			return $http({
				method: 'POST',
				url: "ajax/getProjectInfo.php",
				data: $.param({
						id: id
					}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
		}
	}
});

mbira.factory('projects', function ($upload, $http) {
	return {
		get: function(id){
			return $http({
				method: 'POST',
				url: "ajax/getProjectInfo.php",
				data: $.param({
						id: id
					}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
		},
		getAll: function() {
			return $http({
				method: 'GET',
				url: "ajax/getProjects.php",
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
		},
	    save: function(file, data) {
	    	return 	$upload.upload({
				url: 'ajax/saveProject.php',
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: data,
				file:  file

			})
	    },
		delete: function(id) {
			return 	$http({
				method: 'POST',
				url: "ajax/saveProject.php",
				data: $.param({
						task: "delete",
						id: id
					}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
		}
	}
});

mbira.factory('exhibits', function($http, $upload){	
	//initialize map
	return {
		add: function(id, exhibits, pieceType){
			$.ajax({
				url: "ajax/addToExhibit.php",
				data: {'piece':id,'type':pieceType, 'exhibits':JSON.stringify(exhibits)},
				type: "POST",
				dataType: 'JSON',
			}); 
		},
		getAll: function($scope){
			return $http({
				method: 'POST',
				url: "ajax/getExhibits.php",
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
		},
		inExhibit: function(id, type) {
			return $http({
				method: 'POST',
				url: "ajax/inExhibit.php",
				data: $.param({'id': id, 'task': type}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
		},
		get: function(id) {
			return $http({
				method: 'POST',
				url: "ajax/getExhibitInfo.php",
				data: $.param({
						id: id
					}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})

		},
	    delete: function(id, proj) {
	    	return $http({
				method: 'POST',
				url: "ajax/saveExhibit.php",
				data: $.param({
						task: "delete",
						id: id,
						project: proj
					}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
	    },
	    save: function(newThumb, data) {
	    	return 	$upload.upload({
				url: 'ajax/saveExhibit.php',
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: data,
				file: newThumb
			})
	    }
	}
	
});

mbira.factory('locations', function($http, $upload){	
	//initialize map
	return {
		getAll: function(){
			return 	$http({
				method: 'POST',
				url: "models/location.php",
				data: $.param({
						task: 'all'
					}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
		},
		get: function(id) {
			return $http({
				method: 'POST',
				url: "models/location.php",
				data: $.param({
						id: id,
						task: 'info'
					}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
		},
	    delete: function(id, proj) {
	    	return $http({
				method: 'POST',
				url: "models/location.php",
				data: $.param({
						task: "delete",
						id: id,
						project: proj,
					}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
	    },
	    save: function(newThumb, data) {
	    	return 	$upload.upload({
				url: "models/location.php",
				method:"POST",
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: data,
				file: newThumb
			})
	    }
	}
	
});

mbira.factory('areas', function($http, $upload){	
	//initialize map
	return {
		getAll: function(){
			return 	$http({
				method: 'GET',
				url: "ajax/getAreas.php",
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
		},
		get: function(id) {
			// return $http({
			// 	method: 'POST',
			// 	url: "ajax/getLocationInfo.php",
			// 	data: $.param({
			// 			id: id
			// 		}),
			// 	headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			// })
		},
	    delete: function(id, proj) {
	  //   	return $http({
			// 	method: 'POST',
			// 	url: "ajax/saveLocation.php",
			// 	data: $.param({
			// 			task: "delete",
			// 			id: id,
			// 			project: proj
			// 		}),
			// 	headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			// })
	    },
	    save: function(newThumb, data) {
	  //   	return 	$upload.upload({
			// 	url: "ajax/saveLocation.php",
			// 	method:"POST",
			// 	headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			// 	data: data,
			// 	file: newThumb
			// })
	    }
	}
	
});

mbira.factory('explorations', function($http, $upload){	
	//initialize map
	return {
		getAll: function(){
			return $http({
				method: 'GET',
				url: "ajax/getExplorations.php",
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
		},
		get: function(id) {
			// return $http({
			// 	method: 'POST',
			// 	url: "ajax/getLocationInfo.php",
			// 	data: $.param({
			// 			id: id
			// 		}),
			// 	headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			// })
		},
	    delete: function(id, proj) {
	    	return $http({
				method: 'POST',
				url: "ajax/saveExploration.php",
				data: $.param({
						task: "delete",
						id: id,
						proj: proj
					}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
	    },
	    save: function(newThumb, data) {
	    	return 	$upload.upload({
				url: 'ajax/saveExploration.php',
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: data,
				file: newThumb
			})
	    }
	}
	
});

mbira.factory('mediaCreation', function ($upload, $http) {
	return {
		stepInto: function ($scope, step) {
			$scope.modal.current = step;	
	    },
		dataURLtoBlob: function(dataURL) {
		    var BASE64_MARKER = ';base64,';
		    if (dataURL.indexOf(BASE64_MARKER) == -1) {
		        var parts = dataURL.split(',');
		        var contentType = parts[0].split(':')[1];
		        var raw = decodeURIComponent(parts[1]);

		        return new Blob([raw], {type: contentType});
		    }

		    var parts = dataURL.split(BASE64_MARKER);
		    var contentType = parts[0].split(':')[1];
		    var raw = window.atob(parts[1]);
		    var rawLength = raw.length;

		    var uInt8Array = new Uint8Array(rawLength);

		    for (var i = 0; i < rawLength; ++i) {
		        uInt8Array[i] = raw.charCodeAt(i);
		    }

		    return new Blob([uInt8Array], {type: contentType});
		},
		initializeCropper: function(elementId) {
			opts = {
				aspectRatio: 1 / 1,
				preview: '.img-preview',
				minContainerHeight: 433,
				minContainerWidth: 549,
				crop: function(e) {
				}
			}
			var image = document.getElementById(elementId);
			return new Cropper(image, opts);
		},
		srcFromFile: function(file, $scope) {
	        var fr = new FileReader();
	        var self = this;
	        fr.onload = function () {
	            document.getElementById('editable').src = fr.result;
				$scope.cropper = self.initializeCropper('editable');
	        }
	        fr.readAsDataURL(file);
		},
		reset: function($scope, type) {
			$('#skip-forward, #step-back').css({width:'0px', visibility: 'hidden'});
			$('#crop-submit').css({width:'698px', display:'block', visibility:'visible'});
			$scope.modal.details = {};
			if (type == 'media') {
				$scope.modal.type = 'media'
				$('.media-modal').css({height: '533px'});
				$scope.mediaCheckBox = true;
			} else {
				$scope.modal.type = 'thumbnail'
				$('.media-modal').css({height: '571px'});
				$('#modalCheckboxInput').removeAttr('checked');
				$scope.mediaCheckBox = false;
			}
			this.stepInto($scope, "Thumbnail")
		}
	}
});
	

mbira.factory('media', function ($upload, $http) {
	return {
		save: function (file, data) {
			return $upload.upload({
					url: 'models/media.php',
					method: 'POST',
					headers: {'Content-Type': 'application/x-www-form-urlencoded'},
					data: data,
					file: file
				})

	    },
	    delete: function(m) {
	    	return $http({
				method: 'POST',
				url: "models/media.php",
				data: $.param({
						id: m.id,
						type: "loc",
						path: m.file_path,
						task: 'delete'
					}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				})
	    },
	    get: function(id, type) {
			return $http({
				method: 'POST',
				url: "models/media.php",
				data: $.param({'id': id, 'type': type, 'task': 'get'}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
	    },
	    getAll: function() {
			return $http({
				method: 'POST',
				url: "models/media.php",
				data: $.param({'task': 'all'}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
	    }
	}
});

mbira.factory('timeStamp', function(){	
	return {
		toTime: function(timeStamp){
			d = new Date(parseInt(timeStamp))
			var hh = d.getHours();
			var m = d.getMinutes();
			var s = d.getSeconds();
			var dd = "AM";
			var h = hh;
			if (h >= 12) {
				h = hh-12;
				dd = "PM";
			}
			if (h == 0) {
				h = 12;
			}
			m = m<10?"0"+m:m;

			s = s<10?"0"+s:s;

			var pattern = new RegExp("0?"+hh+":"+m+":"+s);

			var replacement = h+":"+m;

			replacement += ":"+s;  
			replacement += " "+dd;    

			return replacement;
		},
		toDate: function(timeStamp){
			d = new Date(parseInt(timeStamp))
			return d.getMonth()+1 + "." + d.getUTCDate() + "." + d.getFullYear().toString().substr(2)
		}
	}
	
});

mbira.factory('makeArray', function () {
	return {
		make: function (project, scope) {
			theArray = [];
			for(j=0;j<scope.data.length;j++){
				if (project === scope.data[j].project_id){
					theArray.push(scope.data[j]);
				}
			}
			return theArray;
	    }
	}
});

mbira.factory('temporary', function ($upload) {
	return {
		thumbnail: function ($files) {
			if($files.length > 1) {
				alert("Only upload one image for the thumbnail.");
			}else{
				return $upload.upload({
					url:'ajax/tempImg.php',
					method:"POST",
					headers: {'Content-Type': 'application/x-www-form-urlencoded'},
					file: $files[0]
				})
			}
	    },
		header: function ($files) {
			if($files.length > 1) {
				alert("Only upload one image for the thumbnail.");
			}else{
				return $upload.upload({
					url:'ajax/tempHeaderImg.php',
					method:"POST",
					headers: {'Content-Type': 'application/x-www-form-urlencoded'},
					file: $files[0]
				})
			}
	    },
		media: function ($files, id, $scope) {
			if($files.length > 1) {
				alert("Only upload one image at a time.");
			}else{
				$upload.upload({
						// url: 'ajax/saveMedia.php',
						url: 'ajax/tempImg.php',
						method: 'POST',
						headers: {'Content-Type': 'application/x-www-form-urlencoded'},
						data: {id: id},
						file: $files[0]
				}).success(function(data, status, headers, config) {
					// return [data,status,headers,config]
					$scope.media.push({
						originalName: $scope.mediaFile.name,
						tempName: "tmp/temp"+$scope.tmpID+".jpg"
					});
					$scope.images.push($scope.mediaFile);
					$scope.tmpID++;
				});
			}
	    },
	    logo: function($files) {
			if($files.length > 1) {
				alert("Only upload one image for the thumbnail.");
			}else{
				logo = $files[0];

				return $upload.upload({
					url:'ajax/tempLogoImg.php',
					method:"POST",
					headers: {'Content-Type': 'application/x-www-form-urlencoded'},
					file: logo
				})
			}
		}
	}
});
