<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" type="text/css" href="css/newproject.css"/>
    </head>
<body ng-app="mbira">

    <div class="header">
		<div class="back"><a ui-sref="projects"><img src="img/back.png"/><p>ALL PROJECTS</p></a></div>
        <h1> NEW PROJECT</h1>
	</div>
	<div class="main" ng-controller="newProjectCtrl">
		<form id="newprojectform" name="newprojectform" novalidate ng-submit="submit()" role="form">
            
            <div class="thumbnail"> <a href="thumbnail.php"> <img src="img/Default.png" height="225" width="225">
            <div class="thumbnail_title"><h3>ADD THUMBNAIL</h3></div></a></div>
            
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
