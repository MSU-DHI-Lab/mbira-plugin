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

				<div class="project_title">
					<h3>
						{{project.name}}
					</h3>
					<div class="link-wrapper">
						<a ui-sref="projectInfo({project: project.id, pid: pid, previous: 'ALL EXHIBITS'})" >
							<img src="img/info.png">
						</a>
						<a ui-sref="viewProject({project: project.id, pid: project.pid, previous: 'ALL EXHIBITS'})">
							<img class="viewProject" src="img/ProjectOptions.svg" height="25px">
						</a>
					</div>
				</div>
				
				<div class="exhibit" ng-repeat='exhibit in project.exhibits' ng-class-odd="'odd'" ng-class-even="'even'">
					<a ui-sref="viewExhibit({exhibit: exhibit.id, pid: exhibit.pid, project: exhibit.project_id, previous: 'ALL EXHIBITS'})"> 
						<div class="exhibit-wrapper">
							<div class="exhibit_title">
								<h3>
									{{exhibit.name}}
								</h3>
							</div>
							<div class="description">
								{{exhibit.description}}
							</div>
						</div>
<!-- 						<div class="forward-wrapper">
								<img src="img/forward.png">
						</div> -->
					</a>
				</div>
				<div class="odd none" ng-show="!project.exhibits.length">
					<h3>
						No Exhibits
					</h3>
				</div>
			</div>

		</div>

	</body>
</html>
