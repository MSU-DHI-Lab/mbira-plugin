<!DOCTYPE html>
<html>
    <head>
	<!--	<link rel="stylesheet" type="text/css" href="css/project_all.css"/>-->
    </head>
	<body ng-app="mbira">

		<div class="header">
			<h1>EXPLORATIONS</h1>
		</div>
		
		<div class="explorations" ng-controller='viewExplorationsCtrl'>
			<div class="exploration" ng-repeat='exploration in explorations'>
				<a ui-sref="viewExploration({exploration: exploration.id, pid: exploration.pid})"> 
					
					<div class="exploration_title"><h3>{{exploration.name}}</h3></div>
				</a>
			</div>
		</div>

	</body>
</html>