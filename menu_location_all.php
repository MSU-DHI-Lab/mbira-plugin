<!DOCTYPE html>
<html>
    <head>
    	<link rel="stylesheet" type="text/css" href="css/location_all.css"/>
    </head>
	<body ng-app="mbira">

		<div class="header">
			<h1>LOCATIONS</h1>
		</div>
		
		<div class="locations" ng-controller='viewLocationsCtrl'>
			<div class="project" ng-repeat='project in projects'>
				<a ui-sref="viewProject({project: project.id, pid: project.pid})"> <div class="project_title"><h3>{{project.name}}</h3></div></a>
				<div class="location" ng-repeat='location in project.locations' ng-class-odd="'odd'" ng-class-even="'even'">
					<a ui-sref="viewLocation({location: location.id, pid: location.pid, project: location.project_id, previous: 'ALL LOCATIONS'})"> 
						<div class="location_title"><h3>{{location.name}}</h3></div><div class="description">{{location.description}}</div>
					
					</a>
				</div>
				<div class="odd" ng-show="!project.locations.length">No Locations</div>
			</div>
	
		</div>

	</body>
</html>
