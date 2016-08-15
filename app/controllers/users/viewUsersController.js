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
		// console.log($scope.toggles)
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