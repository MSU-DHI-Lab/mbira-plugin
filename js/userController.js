mbira.controller("viewUsersCtrl", function ($scope, $upload, $http){
	//Get all exhibits
	$scope.users = [];
	$scope.toggles = {};

	$scope.toggle = function(email, isExpert, project, id, type) {
		if(this.user.email in $scope.toggles[project] === type){
			if ($scope.toggles[project][this.user.email]) {
				$scope.toggles[project][this.user.email] = 'Reg'
				this.user.isExpert = 'Reg';
			} else {
				$scope.toggles[project][this.user.email] = type
				this.user.isExpert = type;
			}
		} else {
			if (this.user.isExpert === type){
				$scope.toggles[project][email] = 'Reg'
				this.user.isExpert = 'Reg';
			}else {
				$scope.toggles[project][email] = type
				this.user.isExpert = type;
			}
		}
		
		$.ajax({
			url: "ajax/editExpertise.php",
			method: 'POST',
			data: {isExpert: this.user.isExpert, project: project, id: id}
		}).success(function(data){
		})
		console.log($scope.toggles)
	}
	
	$scope.deleteUser = function(user) {
		console.log($(this).parent())
		parent = $(this).parent()
		$(parent).fadeOut('slow');
		$scope.upload = $upload.upload({
			url: 'ajax/projectEditUser.php',
			method: 'POST',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: {id: user.id, project: user.project, type: 'del'}
		}).success(function() {
			for (i=0;i<$scope.projects.length;i++) {
				if ($scope.projects[i].id == user.project) {
					for (j=0;j<$scope.projects[i].users.length;j++) {
						if ($scope.projects[i].users[j].id == user.id) {
							$scope.projects[i].users.splice(j,1);
							break;
						}
					}
					break;
				}
			}
			
		});
	}
	
	$http({
		method: 'GET',
		url: "ajax/expertise.php",
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).success(function(data){
		$scope.projects = data;
		for (i=0;i<data.length;i++) {
			$scope.toggles[data[i].id] = {};		
		}
		console.log($scope.toggles)
	})
});	

mbira.controller("usersToProjectCtrl", function ($scope, $http, $upload, $stateParams){
	//Get all exhibits
	$scope.users = [];
	$scope.toggles = {}
	
	$scope.toggle = function(email, type) {
		if($scope.toggles[email] == type){
			$scope.toggles[email] = 'Reg'
			this.user.isExpert = 'Reg';
		} else {
			$scope.toggles[email] = type
			this.user.isExpert = type;
		}
		console.log($scope.toggles)
	}
	
	$scope.addUser = function(user) {
		if (!$scope.toggles[user.email]){			//prevents sending undefined in ajax call.
			$scope.toggles[user.email] = false;
		}
		
		$scope.upload = $upload.upload({
			url: 'ajax/projectEditUser.php',
			method: 'POST',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: {isExpert: $scope.toggles[user.email], project: $stateParams.project, id: user.id, type: 'insert'}
		}).success(function() {	
			for (i=0;i<$scope.users.length;i++) {
				if ($scope.users[i].id === user.id) {
					$scope.users.splice(i,1);
				}
			}
		});
	}
	
	
	
	$http({
		method: 'GET',
		url: "ajax/getUsers.php",
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).success(function(data){
		$http({
			method: 'GET',
			url: "ajax/getUsersInProjects.php",
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function(projData){
			for(i=0;i<projData.length;i++){
				if (projData[i].mbira_projects_id === $stateParams.project) {
					for(j=0;j<data.length;j++){
						if (projData[i].mbira_users_id === data[j].id) {
							console.log(j)
							data.splice(j,1);
							
							break;
						}
					}
				}
			}
			$scope.users = data;
		})
	})
});	

mbira.controller("newUserCtrl", function ($scope, $http, $upload, $stateParams){
	$scope.user = {};
	$scope.passwordError = false;
	
	$scope.options = [{
	   name: 'None',
	   value: 'none'
	}, {
	   name: 'Project Expert',
	   value: 'projExp'
	}, {
	   name: 'Citizen Expert',
	   value: 'citExp'
	}, {
	   name: 'Project Member',
	   value: 'projMem'
	}];
	
	
	$scope.submit = function() {
		$http({
			method: 'POST',
			url: "ajax/projectEditUser.php",
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: $.param({
				user: $scope.user,
				type: 'add'
			})
		}).success(function(data) {
			if(data.error && data.error.includes("Duplicate entry")) {
				$scope.usernameTaken = true;
			} else {
				$scope.usernameTaken = false;
			}
		});		
	}
});