<!DOCTYPE html>
<html>
    <head>
		<link rel="stylesheet" type="text/css" href="css/exploration_all.css"/>
    </head>
	<body ng-app="mbira">

		<div class="header">
			<h1>EXPLORATIONS</h1>
		</div>
		
		<div class="explorations" ng-controller='viewExplorationsCtrl'>
			<div class="project" ng-repeat='project in projects'>
				<a ui-sref="viewProject({project: project.id, pid: project.pid})"> <div class="project_title"><h3>{{project.name}}</h3></div></a>
				<div class="exploration" ng-repeat='exploration in project.explorations' ng-class-odd="'odd'" ng-class-even="'even'">
					<a ui-sref="viewExploration({exploration: exploration.id, pid: exploration.pid, project: project.id, previous: 'ALL EXPLORATIONS'})"> 
						<div class="exploration_title"><h3>{{exploration.name}}</h3></div><div class="description">{{exploration.description}}</div>
					
					</a>
				</div>
			</div>
	
		</div>

	</body>
</html>