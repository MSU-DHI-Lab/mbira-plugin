mbira.controller("newUserCtrl", function ($scope, $http, $upload, $stateParams, $state, users){
	$scope.user = {};
	$scope.passwordError = false;
	
	$scope.submit = function() {
		users.save($scope.user).success(function(data) {
			if(data.error && data.error.includes("Duplicate entry")) {
				$scope.usernameTaken = true;
			} else {
				$scope.usernameTaken = false;
				$state.go('users');
			}
		});		
	}
});