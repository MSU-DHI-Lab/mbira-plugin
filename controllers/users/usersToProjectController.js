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