<!DOCTYPE html>
<html>
    <head>
    	<link rel="stylesheet" type="text/css" href="css/exhibit_all.css"/>
    </head>
	<body ng-app="mbira">

		<div class="header">
			<h1>EXHIBITS</h1>
		</div>
		
		<div class="exhibits" ng-controller='viewExhibitsCtrl'>
			<div class="project" ng-repeat='project in projects'>
				<a ui-sref="viewProject({project: project.id, pid: project.pid})"> <div class="project_title"><h3>{{project.name}}</h3></div></a>
				<div class="exhibit" ng-repeat='exhibit in project.exhibits' ng-class-odd="'odd'" ng-class-even="'even'">
					<a ui-sref="viewExhibit({exhibit: exhibit.id, pid: exhibit.pid, project: exhibit.project_id})"> 
						<div class="exhibit_title"><h3>{{exhibit.name}}</h3></div><div class="description">{{exhibit.description}}</div>
					
					</a>
				</div>
			</div>
	
		</div>

	</body>
</html>