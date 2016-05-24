mbira.controller("viewProjectsCtrl", function ($scope, $http, projects){
	//Get all projects
	projects.getAll().success(function(data){
		  $scope.projects = data;
	})
});

mbira.controller("newProjectCtrl", function ($scope, $http, $upload, $state, temporary, projects){
	$scope.file;
	
	//model for new project
	$scope.newProject = {
	    name: "",
		shortDescription: "",
		description: "",
		file: "",
		logo: ""
	}
	
	$scope.onFileSelect = function($files) { 
		$scope.file = $files[0];
		temporary.thumbnail($files).success(function(data) {	
			$('.projectImg').attr('src', 'tmp/temp.jpg?' + (new Date).getTime()) // forces img refresh	
			$('.projectImg').css('object-fit: contain;')
		});
	};

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
	
	//Submit new project
	$scope.submit = function() {
		//$files1 = [$scope.file, $scope.logo];
		projects.save($scope.file, {
			task: 'create', 
			name: $scope.newProject.name, 
			shortDescription: $scope.newProject.shortDescription, 
			description: $scope.newProject.description}
		).success(function(data) {	
			//upload logo
			projID = data;
			projects.save($scope.logo,{task: 'uploadLogo', id: projID});

			//upload header
			projects.save($scope.header,{task: 'uploadHeader', id: projID});

			// return to project
			location.href = "javascript:history.back()";

		});
	}
});

mbira.controller("singleProjectCtrl", function ($scope, $http, $stateParams, projects){
	$scope.pid = $stateParams.pid;
	
	//Get single project info
	projects.get($stateParams.project).success(function(data){
		//Set to scope
		$scope.project = data[0];
		$scope.locations = data[1];
		$scope.areas = data[2];
		$scope.explorations = data[3];
		$scope.exhibits = data[4];
	})
});

mbira.controller("projectInfoCtrl", function ($scope, $http, $upload, $stateParams, $state, temporary, projects){
	$scope.pid = $stateParams.pid;

	$scope.onFileSelect = function($files) { 
		$scope.file = $files[0];
		temporary.thumbnail($files).success(function(data) {	
			$('.projectImg').attr('src', 'tmp/temp.jpg?' + (new Date).getTime()) // forces img refresh	
			$('.projectImg').css('object-fit: contain;')
		});
	};

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
	})
	
	//Handle "save and close"
	$scope.submit = function(){
		//Save		
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
				location.href = "javascript:history.back()";
			
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