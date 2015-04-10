mbira.controller("viewNotificationsCtrl", function ($scope, $http){
	//Get all notifications
	$http({
		method: 'GET',
		url: "ajax/getNotifications.php",
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).success(function(data){
		  $scope.notifications = data;
	})
});	