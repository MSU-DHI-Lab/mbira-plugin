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
				<div class="project_title">
					<h3>
						{{project.name}}
					</h3>
					<div class="link-wrapper">
						<a ui-sref="projectInfo({project: project.id, pid: pid, previous: 'ALL AREAS'})" >
							<img src="img/info.png">
						</a>
						<a ui-sref="viewProject({project: project.id, pid: project.pid, previous: 'ALL AREAS'})">
							<img class="viewProject" src="img/ProjectOptions.svg" height="25px">
						</a>
					</div>
				</div>

				
                <div class="area" ng-repeat='area in project.areas' ng-class-odd="'odd'" ng-class-even="'even'">
                	<a ui-sref="viewArea({area: area.id, pid: area.pid, project: area.project_id, previous: 'ALL AREAS'})"> 
						<div class="area-wrapper">
							<div class="area_title">
								<h3>
									{{area.name}}
								</h3>
							</div>
							<div class="description">
								{{area.description}}
							</div>
						</div>
<!-- 						<div class="forward-wrapper">
							
								<img src="img/forward.png">
							
						</div> -->
					</a>
                </div>
                <div class="odd none" ng-show="!project.areas.length">
                    <h3>No Areas</h3>
                </div>
            </div>

        </div>
    </body>
</html>
