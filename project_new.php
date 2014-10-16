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
    
	  <!--PROJECT INFORMATION-->
	<div class="main" ng-controller="newProjectCtrl">
        
        <div class="thumbnail"> <a href="thumbnail.html"> <img src="img/thumbnail_empty.png" height="340" width="340">
            <div class="thumbnail_title"><h3>ADD THUMBNAIL</h3></div></a></div>
        
    <div class="project_information">    
        <form id="newprojectform" name="newprojectform" novalidate ng-submit="submit()" role="form">
          
            <div class="form-group">				        
				<input type="text" required class="form-control npInput" id="name" name="name" ng-model="newProject.name" placeholder="ENTER PROJECT TITLE HERE"></div>
			
            <div class="form-group">				        
					<input type="text" required class="form-control npInput" id="description" name="description" ng-model="newProject.description" placeholder="ENTER PROJECT DESCRIPTION HERE"></div>
			
            <button type="submit" id="submit" class="btn btn-default" ng-disabled="newprojectform.$invalid" ng-class="{'btn-disabled': newprojectform.$invalid}">CREATE NEW PROJECT</button>
		</form></div></div>

</body>
</html>
