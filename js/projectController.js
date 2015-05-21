mbira.controller("viewProjectsCtrl", function ($scope, $http){
	//Get all projects
	$http({
		method: 'GET',
		url: "ajax/getProjects.php",
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).success(function(data){
		  $scope.projects = data;
	})
});

mbira.controller("newProjectCtrl", function ($scope, $http, $upload, $state){
	$scope.file;
	
	//model for new project
	$scope.newProject = {
	    name: "",
		shortDescription: "",
		descrition: "",
		file: "",
		logo: ""
	}
	
	//Get file to be uploaded
	$scope.onFileSelect = function($files) {
		if($files.length > 1) {
			alert("Only upload one image for the thumbnail.");
		}else{
			$scope.file = $files[0];

			$scope.uploadFile = $upload.upload({
				url:'ajax/tempImg.php',
				method:"POST",
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				file: $scope.file
			}).success(function(data) {	
				$('.projectImg').attr('src', 'images/temp.jpg?' + (new Date).getTime()) // forces img refresh	
				$('.projectImg').css('object-fit: contain;')
			});
		}
	};
	
	//Get Logo 
	$scope.onLogoSelect = function($files) {
		if($files.length > 1) {
			alert("Only upload one image for the thumbnail.");
		}else{
			$scope.logo = $files[0];

			$scope.uploadFile = $upload.upload({
				url:'ajax/tempLogoImg.php',
				method:"POST",
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				file: $scope.logo
			}).success(function(data) {	
				$('.logoImg').attr('src', 'images/tempLogo.jpg?' + (new Date).getTime()) // forces img refresh	
				$('.logoImg').css('object-fit: contain;')
			});
		}
	};
	
	//Submit new project
	$scope.submit = function() {
		//$files1 = [$scope.file, $scope.logo];
		$scope.upload = $upload.upload({
			url: 'ajax/saveProject.php',
			method: 'POST',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: {task: 'create', name: $scope.newProject.name, shortDescription: $scope.newProject.shortDescription, description: $scope.newProject.description},
			file:  $scope.file

		}).success(function(data) {	
			//upload logo
			projID = data;
			$scope.upload = $upload.upload({
				url: 'ajax/saveProject.php',
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: {task: 'uploadLogo', id: projID},
				file:  $scope.logo

			}).success(function(data) {	
				//return to all projects page
				$state.go("projects");
			});
		});
	}
});

mbira.controller("singleProjectCtrl", function ($scope, $http, $stateParams){
	$scope.pid = $stateParams.pid;
	
	//Get single project info
	$http({
		method: 'POST',
		url: "ajax/getProjectInfo.php",
		data: $.param({
				id: $stateParams.project
			}),
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).success(function(data){
		//Set to scope
		$scope.project = data[0];
		$scope.locations = data[1];
		$scope.areas = data[2];
		$scope.explorations = data[3];
		$scope.exhibits = data[4];
	})
});

mbira.controller("projectInfoCtrl", function ($scope, $http, $upload, $stateParams, $state){
	$scope.pid = $stateParams.pid;

	//Get file to be uploaded
	$scope.onFileSelect = function($files) {
		if($files.length > 1) {
			alert("Only upload one image for the thumbnail.");
		}else{
			$scope.file = $files[0];

			$scope.uploadFile = $upload.upload({
				url:'ajax/tempImg.php',
				method:"POST",
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				file: $scope.file
			}).success(function(data) {	
				$('.dropzone img').attr('src', 'images/temp.jpg?' + (new Date).getTime()) // forces img refresh	
			});
		}
	};	
	
	//Get single project info
	$http({
		method: 'POST',
		url: "ajax/getProjectInfo.php",
		data: $.param({
				id: $stateParams.project
			}),
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).success(function(data){
		//Set to scope
		$scope.project = data[0];
		$('.dropzone img').attr('src', 'images/'+ $scope.project.image_path )
	})
	
	//Handle "save and close"
	$scope.submit = function(){
		//Save		
		$scope.upload = $upload.upload({				
			url: 'ajax/saveProject.php',
			method: 'POST',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: { 
					task: 'update',
					id: $stateParams.project,
					name: $scope.project.name,
					shortDescription: $scope.project.shortDescription,
					description: $scope.project.description,
					path: $scope.project.image_path
				},
			file: $scope.file
		}).success(function(data) {
			// return to project
			location.href = "javascript:history.back()";
		});
	}
	
	//Delete project
	$scope.delete = function(){
		$http({
		method: 'POST',
		url: "ajax/saveProject.php",
		data: $.param({
				task: "delete",
				id: $stateParams.project
			}),
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function(data){
			//return to projecct
			location.href = "#/projects"
		})
	}
	
});
