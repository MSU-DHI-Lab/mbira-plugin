<!DOCTYPE HTML>
<html>
<head>
	<script src="js/script.js"></script> 
	
</head>
<body>
	<div class="main" ng-controller="newProjectCtrl">
		<h1>New Project</h1>
		<form id="newprojectform" name="newprojectform" novalidate ng-submit="submit()" role="form">
			<div class="form-group">				        
					<input type="text" required class="form-control npInput" id="name" name="name" ng-model="newProject.name" placeholder="Project Name">
			</div>
			
			<div class="form-group">				        
					<input type="text" required class="form-control npInput" id="description" name="description" ng-model="newProject.description" placeholder="Project Description">
			</div>
			
			<div class="form-group">				        
					<input type="file" id="fileSelect" name="file" ng-file-select="onFileSelect($files)"/>
			</div>
			
			<button type="submit" id="submit" class="btn btn-default" ng-disabled="newprojectform.$invalid" ng-class="{'btn-disabled': newprojectform.$invalid}">Create Project</button>
		</form
	</div>
</body>
</html>