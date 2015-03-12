<!DOCTYPE HTML>
<html>
<head>
	<script src="script.js"></script> 
</head>
<body ng-app="kora">
	<div class="main" ng-controller="viewProjectsCtrl">
		<h1>Projects</h1>
		<a ui-sref="newProject">New Project</a>
		<br><br>
		<div ng-repeat="project in projects">
			<div class="well">
				<b>Name: </b> {{project.TITLE}}<br>
				<b>Description: </b> {{project.DESCRIPTION}}<br>
				<b>File Path: </b> {{project.FILE_PATH}}<br>
			</div>
		</div>
	</div>
</body>
</html>