mbira.controller("settingsCtrl", function ($scope, $http, projects){
	var path;

	projects.getAll().success(function(data){
		$scope.projects = data;
	})

	$http({
		method: 'GET',
		url: "ajax/getDbInfo.php",
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).success(function(data){
		$scope.db = data;
	})
	
	$http({
		method: 'GET',
		url: "ajax/getBasePath.php",
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).success(function(data){
		path = window.location.pathname.split('/');
		$scope.url = data + "plugins/" + path[path.length-2] + "/";
	})

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
		var inputs = document.querySelectorAll('input');
		for (var i = 0; i < inputs.length; i++) {
		    if (inputs[i].parentElement) {
		        inputs[i].parentElement.addEventListener('mouseleave', function(e) {
		            $('.hint--right').removeClass("hint--right");
		            e.currentTarget.removeAttribute('data-hint');
		        })
		    };
		}
    });

});	

mbira.directive('repeatEnd', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    }
})