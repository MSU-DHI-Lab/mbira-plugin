<!DOCTYPE HTML>
<html>
<head>
	<script src="js/script.js"></script> 
	<link rel="stylesheet" type="text/css" href="css/newproject.css"/>
</head>
<body ng-app="mbira">
    
     <!--HEADER-->
    <div class="header">
        <div class="back"><a href="project_single.php"><img src="img/back.png" height="19" width="11.5"/><p>*PROJECT NAME*</p></a></div>
        <div class="title"><h1>PROJECT INFO</h1></div></div>
    
    
    <!--PROJECT INFORMATION-->
	<div class="main" ng-controller="newProjectCtrl">
        
        <div class="thumbnail"> <a href="thumbnail.html"> <img src="img/thumbnail_empty.png" height="237" width="237">
            <div class="thumbnail_title"><h3>EDIT THUMBNAIL</h3></div></a></div>
        
    <div class="project_information">    
        <form id="newprojectform" name="newprojectform" novalidate ng-submit="submit()" role="form">
          
            <div class="form-group">				        
				<input type="text" required class="form-control npInput" id="name" name="name"  ng-model="newProject.name"></div>
			
            <div class="form-group">				        
                <textarea required class="form-control npInput" id="description" name="description" rows="6" wrap="hard" ng-model="newProject.description" style="overflow: visible"></textarea></div>
			
            <button type="submit" id="submit" class="btn btn-default" ng-disabled="newprojectform.$invalid" ng-class="{'btn-disabled': newprojectform.$invalid}">UPDATE PROJECT INFO</button>
		</form></div></div>

    
</body>
</html>
    
 
