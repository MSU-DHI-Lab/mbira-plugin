<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" type="text/css" href="css/newproject.css"/>
    </head>
<body ng-app="mbira">

    <div class="header">
		<div class="back"><a onclick="window.history.go(-1); return false;"><img src="img/back.png"/><p>TO PROJECTS</p></a></div>
        <h1>NEW PROJECT</h1>
	</div>
	<div class="main" ng-controller="newProjectCtrl">
		<form id="newprojectform" name="newprojectform" novalidate ng-submit="submit()" role="form">
            
            <div class="thumbnail dropzone"> 
        		<img class="projectImg" src="img/Default.png">
        		<div class="thumbnail_title">
        			<h3>{{newProject.name || "Drop/Add Thumbnail"}}</h3>
        		</div>
                <div class="form-group-file">				        
    					<input type="file" id="fileSelect" name="file" ng-file-select="onFileSelect($files)">
    			</div>
            </div>
			
			<div class="thumbnail dropzone"> 
        		<img class="logoImg" src="img/Default.png">
        		<div class="thumbnail_title">
        			<h3>{{"Drop/Add Logo"}}</h3>
        		</div>
                <div class="form-group-file">				        
    					<input type="file" id="fileSelect" name="file" ng-file-select="onLogoSelect($files)">
    			</div>
            </div>
            
			<div class="form-group">				        
					<input type="text" required class="form-control npInput" id="name" name="name" ng-model="newProject.name" placeholder="Project Name">
			</div>
			
			<div class="form-group">				        
					<textarea required class="form-control npInput" id="description" name="description" ng-model="newProject.description" placeholder="Project Description"></textarea>
			</div>
			
			<button type="submit" id="submit" class="btn btn-default" ng-disabled="newprojectform.$invalid" ng-class="{'btn-disabled': newprojectform.$invalid}">CREATE PROJECT</button>
		</form
	</div>
</body>
    
</html>
