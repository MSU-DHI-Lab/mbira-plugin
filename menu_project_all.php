<!DOCTYPE html>
<html>
    <head>
		<link rel="stylesheet" type="text/css" href="css/project_all.css"/>
    </head>
<body ng-app="mbira">

    <div class="header">
        <h1>PROJECTS</h1>
	</div>
    
    <div class="projects" ng-controller='viewProjectsCtrl'>
		<div class="project" ng-repeat='project in projects' ng-click='toProject(project.id)'> 
			<a ui-sref="viewProject"> 
				<img ng-src="images/{{project.image_path}}" height="340" width="340">
				<div class="project_title"><h3>{{project.name}}</h3></div>
			</a>
		</div>
		
		<div class="project_new"> 
			<a ui-sref="newProject">
				<img src="img/project_new_plus_icon.png">
				<div class="project_title_new"><h3>NEW PROJECT</h3></div>
			</a>
		</div>
        <!--<div class="project"> <a ui-sref="viewProject"> <img src="img/project_thumb_tests-18.png" height="340" width="340">
            <div class="project_title"><h3>PROJECT ONE</h3></div></a></div>
        
        <div class="project"> <a ui-sref="viewProject"> <img src="img/project_thumb_tests-19.png" height="340" width="340">
            <div class="project_title"><h3>PROJECT TWO</h3></div></a></div>
        
        <div class="project"> <a ui-sref="viewProject"> <img src="img/project_thumb_tests-20.png" height="340" width="340">
            <div class="project_title"><h3>PROJECT THREE</h3></div></a></div>
        
        !-->
		
	</div>

</body>
    
    </html>

