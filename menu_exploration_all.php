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
                
				<div class="project_title">
					<h3>
						{{project.name}}
					</h3>
					<div class="link-wrapper">
						<a ui-sref="projectInfo({project: project.id, pid: pid, previous: 'ALL EXPLORATIONS'})" >
							<img src="img/info.png">
						</a>
						<a ui-sref="viewProject({project: project.id, pid: project.pid, previous: 'ALL EXPLORATIONS'})"> 
							<img src="img/forward.png">
						</a>
					</div>
				</div>


                <div class="exploration" ng-repeat='exploration in project.explorations' ng-class-odd="'odd'" ng-class-even="'even'">

					<div class="exploration-wrapper">
						<div class="exploration_title">
							<h3>
								{{exploration.name}}
							</h3>
						</div>
						<div class="description">
							{{exploration.description}}
						</div>
					</div>
					<div class="forward-wrapper">
						<a ui-sref="viewExploration({exploration: exploration.id, pid: exploration.pid, project: project.id, previous: 'ALL EXPLORATIONS'})"> 
							<img src="img/forward.png">
						</a>
					</div>


                </div>
                <div class="odd none" ng-show="!project.explorations.length">
                    <h3>No Explorations</h3>
                </div>
            </div>
        </div>
    </body>
</html>