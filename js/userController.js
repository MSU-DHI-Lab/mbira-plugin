mbira.controller("viewUsersCtrl", function ($scope, $http, makeArray){
	//Get all exhibits
	$scope.users = [];
	$scope.toggles = {}

	$scope.toggle = function(email, isExpert) {
		console.log(this.user.isExpert);

		if(this.user.email in $scope.toggles){
			if ($scope.toggles[this.user.email]) {
				$scope.toggles[this.user.email] = false
			} else {
				$scope.toggles[this.user.email] = true
			}
		} else {
			if (this.user.isExpert === 'true'){
				$scope.toggles[email] = false
				console.log(Boolean(this.user.isExpert))
			}else {
				$scope.toggles[email] = true
			}
		}
		console.log($scope.toggles)
	}
	
	$scope.addUser = function(user) {
		if (!$scope.toggles[user.email]){			//prevents sending undefined in ajax call.
			$scope.toggles[user.email] = false;
		}
		
		$scope.upload = $upload.upload({
			url: 'ajax/project_add_user.php',
			method: 'POST',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: {isExpert: $scope.toggles[user.email], project: $stateParams.project, id: user.id}
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
		$scope.data = data;
		$http({
			method: 'GET',
			url: "ajax/getUsersInProjects.php",
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function(data2){
			//Get all projects
			$http({
				method: 'GET',
				url: "ajax/getProjects.php",
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).success(function(data3){
				for(i=0;i<data3.length;i++){
					userArray = makeArray.user(data3[i].id, $scope, data2);
					data3[i].users = userArray;
				}
				$scope.projects = data3;
			})
		})
	})
});	

mbira.controller("usersToProjectCtrl", function ($scope, $http, $upload, $stateParams, makeArray){
	//Get all exhibits
	$scope.users = [];
	$scope.toggles = {}
	
	$scope.toggle = function(email) {
		if($scope.toggles[email]){
			$scope.toggles[email] = false
		} else {
			$scope.toggles[email] = true
		}
		console.log($scope.toggles)
	}
	
	$scope.addUser = function(user) {
		if (!$scope.toggles[user.email]){			//prevents sending undefined in ajax call.
			$scope.toggles[user.email] = false;
		}
		
		$scope.upload = $upload.upload({
			url: 'ajax/project_add_user.php',
			method: 'POST',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: {isExpert: $scope.toggles[user.email], project: $stateParams.project, id: user.id}
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