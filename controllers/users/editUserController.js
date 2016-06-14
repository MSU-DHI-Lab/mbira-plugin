mbira.controller("editUserCtrl", function ($scope, $http, $upload, $stateParams, $state, users){
	$scope.user = $stateParams.user;
	$scope.passwordError = false;
	
	users.get($scope.user).success(function(data) {
		$scope.userInfo = data[0];
		console.log(data);
	});	

	$(".overlay *").click(function(e) {
		    e.stopPropagation();
	});	

	$scope.submit = function() {
		users.edit({
			id: 	   $scope.userInfo.id,
			firstName: $scope.userInfo.firstName,
			lastName:  $scope.userInfo.lastName,
			username:  $scope.userInfo.username,
			email:     $scope.userInfo.email,
			pass1: 	   $scope.userInfo.pass1 ? $scope.userInfo.pass1 : null,
		}).success(function(data) {
			console.log(data)
			if(data.error && data.error.includes("Duplicate entry")) {
				$scope.usernameTaken = true;
			} else {
				$scope.usernameTaken = false;
				$state.go('users');
			}
		});	
	}

	$scope.deletePopup = function() {
		$(".overlay").fadeIn('slow');
	}

	$scope.cancel = function() {
		$(".overlay").fadeOut('slow');
	}

	$scope.confirmDelete = function(id) {
		users.delete(id).success(function(data) {
			$state.go('users');	
		});	
		
	}
});