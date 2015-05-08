var mbira  = angular.module('mbira', ['ui.router', 'angularFileUpload', 'angular-sortable-view', 'isteven-multi-select']);

mbira.config(function($stateProvider, $urlRouterProvider) {
	
	$urlRouterProvider.otherwise("/projects");
	
	$stateProvider
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
	    templateUrl: "location_single.html"
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
});

mbira.factory('setMap', function(){	
	//initialize map
	return {
		set: function(lat, lon){
			var map = L.map('map').setView([lat, lon], 14);

			L.tileLayer('https://{s}.tiles.mapbox.com/v3/austintruchan.jb1pjhel/{z}/{x}/{y}.png', {
				attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
				maxZoom: 18
			}).addTo(map);
			
			map.invalidateSize(false);
			return map;
		},
		setToCurrent: function(){
			var map = L.map('map').locate({setView: true, maxZoom: 14});

			L.tileLayer('https://{s}.tiles.mapbox.com/v3/austintruchan.jb1pjhel/{z}/{x}/{y}.png', {
				attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
				maxZoom: 18
			}).addTo(map);
			
			map.invalidateSize(false);
			return map;
		}
	}
});

mbira.factory('exhibits', function(){	
	//initialize map
	return {
		add: function(id, exhibits, pieceType){
			console.log(id,exhibits,pieceType)
			$.ajax({
				url: "ajax/addToExhibit.php",
				data: {'piece':id,'type':pieceType, 'exhibits':JSON.stringify(exhibits)},
				type: "POST",
				dataType: 'JSON',
				success: function(data) {
	console.log(data)
				}
			}); 
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
