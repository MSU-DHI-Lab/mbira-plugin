<!DOCTYPE html>
<html>
    <head>
	<!--	<link rel="stylesheet" type="text/css" href="css/project_all.css"/>-->
    </head>
	<body ng-app="mbira">

		<div class="header">
			<h1>LOCATIONS</h1>
		</div>
		
		<div class="locations" ng-controller='viewLocationsCtrl'>
			<div class="location" ng-repeat='location in locations'>
				<a ui-sref="viewLocation({location: location.id, pid: location.pid})"> 
					
					<div class="location_title"><h3>{{location.name}}</h3></div>
				</a>
			</div>
		</div>

	</body>
</html>
