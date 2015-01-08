<!DOCTYPE html>
<html>
    <head>
		<link rel="stylesheet" type="text/css" href="css/project_all.css"/>
    </head>
	<body ng-app="mbira">

		<div class="header">
			<h1>PROJECTS</h1>
		</div>
		
		<div class="projects" ng-controller='viewProjectsCtrl'>
			<div class="project" ng-repeat='project in projects'>
				<a ui-sref="viewProject({project: project.id, pid: project.pid})"> 
					<img ng-src="images/{{project.image_path}}" height="340" width="340">
					<div class="project_title"><h3>{{project.name}}</h3></div>
				</a>
			</div>
			
			<div class="project_new"> 
				<a ui-sref="newProject">
					<img src="img/project_new_plus_icon.png">
					<div class="project_title_new"><h3>NEW PROJECT</h3></div>
				</a>
			</div>		
		</div>

	</body>
</html>

