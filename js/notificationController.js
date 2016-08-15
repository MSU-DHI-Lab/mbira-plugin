mbira.controller("viewNotificationsCtrl", function ($scope, $http, timeStamp, users){
	//Get all notifications

	function idToUser(userId){
		for(q=0;q<$scope.userData.length;q++){					//match user_id of comment or reply to name
			if ($scope.userData[q].id === userId){
				return $scope.userData[q].firstName + " " + $scope.userData[q].lastName;
			}
		}
	}

	function loadNotifications() {
		$scope.notifications.sort(function(x, y){
			if ( x['timestamp'] > y['timestamp']){
				return 0;
			} else {
				return 1;
			}
		})

		for (i = 0; i < $scope.notifications.length; i++) {
			$scope.notifications[i]['date'] = timeStamp.toDate($scope.notifications[i]['timestamp']*1000);
			$scope.notifications[i]['name'] = idToUser($scope.notifications[i]['user_id']);
		}

		console.log($scope.notifications)

	}


	$http({
		method: 'GET',
		url: "ajax/getNotifications.php",
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).success(function(data){
		    $scope.notifications = data;
		    console.log(data)
			users.getAll().success(function(data){
				$scope.userData = data;
				loadNotifications();
			})
		    
	})
});	