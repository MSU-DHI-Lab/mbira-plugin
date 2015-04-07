<!DOCTYPE html>
<html>
    <head>
		<link rel="stylesheet" type="text/css" href="css/area_all.css"/>
    </head>
	<body ng-app="mbira">

		<div class="header">
			<h1>AREAS</h1>
		</div>
		
		<div class="areas" ng-controller='viewAreasCtrl'>
			<div class="project" ng-repeat='project in projects'>
				<a ui-sref="viewProject({project: project.id, pid: project.pid})"> <div class="project_title"><h3>{{project.name}}</h3></div></a>
				<div class="area" ng-repeat='area in project.areas' ng-class-odd="'odd'" ng-class-even="'even'">
					<a ui-sref="viewArea({area: area.id, pid: area.pid, project: area.project_id, previous: 'ALL AREAS'})"> 
						<div class="area_title"><h3>{{area.name}}</h3></div><div class="description">{{area.description}}</div>
					
					</a>
				</div>
				<div class="odd" ng-show="!project.areas.length">No Areas</div>
			</div>
	
		</div>

	</body>
</html>