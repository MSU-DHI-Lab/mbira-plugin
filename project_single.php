<!DOCTYPE html>
<html>
    <head>
        
        <link rel="stylesheet" type="text/css" href="css/project_single.css"/> <!-- This needs to change and be its own css -->
        <link rel="stylesheet" type="text/css" href="css/project_all.css"/>  <!-- This needs to change and be its own css -->
    </head>
<body ng-app='mbira'>
    <div class="wrap" ng-controller='singleProjectCtrl'>
    <!--HEADER-->
    <div class="header">
        <div class="back"><a ui-sref="projects"><img src="img/back.png"/><p>ALL PROJECTS</p></a></div>
        <div class="title"><h1>{{project.name}}</h1></div>
        <div class="info"><a  ui-sref="projectInfo({project: project.id, pid: pid})"><img src="img/info.png"/></a></div></div>
    
    
    <!--PROJECT DESCRIPTION-->
    <p class="project_description">{{project.description}}</p>
    
    
    <!--PROJECT EXHIBITS-->
    <div class="exhibits">
        
        <h2 class="project_element_title">EXHIBITS</h2>
        
        <div class="exhibit" ng-repeat='exhibit in exhibits'}> 
            <a ui-sref="viewExhibit({project: project.id, pid: pid, exhibit: exhibit.id, previous: 'PROJECT'})"> 
                <img class="projectImg" ng-src="images/{{exhibit.thumb_path}}" height="135.5" width="135.5">
                <div class="exhibit_title"><h3>{{exhibit.name}}</h3></div>
            </a>
        </div>
        
        
        <div class="exhibit_new"> 
            <a ui-sref="newExhibit({project: project.id, pid: pid})">
                <img src="img/project_new_plus_icon_small.png" height="135.5" width="135.5">
                <div class="exhibit_title_new"><h3>NEW EXHIBIT</h3></div>
            </a>
        </div>
    </div>
        
      
    <!--PROJECT LOCATIONS-->
    <div class="locations">
        
        <h2 class="project_element_title">LOCATIONS</h2>
        
        <div class="location" ng-repeat='location in locations'}> 
			<a ui-sref="viewLocation({project: project.id, pid: pid, location: location.id, previous: 'PROJECT'})"> 
				<img class="projectImg" ng-src="images/{{location.thumb_path}}" height="135.5" width="135.5">
				<div class="location_title"><h3>{{location.name}}</h3></div>
			</a>
		</div>
        
        
        <div class="location_new"> 
			<a ui-sref="newLocation({project: project.id, pid: pid})">
				<img src="img/project_new_plus_icon_small.png" height="135.5" width="135.5">
				<div class="location_title_new"><h3>NEW LOCATION</h3></div>
			</a>
		</div>
	</div>
    
    
      <!--PROJECT AREAS-->
    <div class="areas">    
        <h2 class="project_element_title">AREAS</h2>
        
		<div class="area" ng-repeat='area in areas'}> 
			<a ui-sref="viewArea({project: project.id, pid: pid, area: area.id, previous: 'PROJECT'})"> 
				<img class="projectImg" ng-src="images/{{area.thumb_path}}" height="135.5" width="135.5">
				<div class="area_title"><h3>{{area.name}}</h3></div>
			</a>
		</div>
        
        <div class="area_new"> 
            <a ui-sref="newArea({project: project.id, pid: pid})">
                <img src="img/project_new_plus_icon_small.png" height="135.5" width="135.5">
                <div class="area_title_new"><h3>NEW AREA</h3></div>
            </a>
        </div>
	</div>
    
    
      <!--PROJECT EXPLORATIONS-->
    <div class="explorations">
        
        <h2 class="project_element_title">EXPLORATIONS</h2>

        <div class="exploration" ng-repeat='exploration in explorations'}> 
            <a ui-sref="viewExploration({project: project.id, exploration: exploration.id, pid: pid, previous: 'PROJECT'})"> 
                <img class="projectImg" ng-src="images/{{exploration.thumb_path}}" height="135.5" width="135.5">
                <div class="exploration_title"><h3>{{exploration.name}}</h3></div>
            </a>
        </div>
        
        <div class="exploration_new"> 
            <a ui-sref="newExploration({project: project.id, pid: pid})">
                <img src="img/project_new_plus_icon_small.png" height="135.5" width="135.5">
                <div class="exploration_title_new"><h3>NEW EXPLORATION</h3></div>
            </a>
        </div>
    
    </div>

</body>
    
    </html>

