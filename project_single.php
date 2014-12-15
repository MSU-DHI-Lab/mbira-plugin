<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" type="text/css" href="css/project_single.css"/>
    </head>
<body ng-app='mbira'>
    <div class="wrap" ng-controller='singleProjectCtrl'>
    <!--HEADER-->
    <div class="header">
        <div class="back"><a ui-sref="projects"><img src="img/back.png"/><p>ALL PROJECTS</p></a></div>
        <div class="title"><h1>{{project.name}}</h1></div>
        <div class="info"><a href="project_info.php"><img src="img/info.png"/></a></div></div>
    
    
    <!--PROJECT DESCRIPTION-->
    <p class="project_description">{{project.description}}</p>
    
    
    <!--PROJECT EXHIBITS-->
    <div class="exhibits">
        
        <h2 class="project_element_title">EXHIBITS</h2>
        
        <div class="exhibit"> <a ui-sref="viewExhibit"> <img src="img/" height="130" width="130">
            <div class="exhibit_title"><h3>EXHIBIT NAME</h3></div></a></div>
        
        <div class="exhibit"> <a ui-sref="viewExhibit"> <img src="img/" height="130" width="130">
            <div class="exhibit_title"><h3>EXHIBIT NAME</h3></div></a></div>
        
        <div class="exhibit"> <a ui-sref="viewExhibit"> <img src="img/" height="130" width="130">
            <div class="exhibit_title"><h3>EXHIBIT NAME</h3></div></a></div>
        
        <div class="exhibit"> <a ui-sref="viewExhibit"><img src="img/" height="130" width="130">
            <div class="exhibit_title"><h3>EXHIBIT NAME</h3></div></a></div>
        
        <div class="exhibit_new"> <a ui-sref="newExhibit"><img src="img/project_new_plus_icon_small.png" height="130" width="130">
            <div class="exhibit_title_new"><h3>NEW EXHIBIT</h3></div></a></div></div>
        
      
    <!--PROJECT LOCATIONS-->
    <div class="locations">
        
        <h2 class="project_element_title">LOCATIONS</h2>
        
        <div class="location" ng-repeat='location in locations'}> 
			<a ui-sref="viewLocation({project: project.id, location: location.id})"> 
				<img ng-src="images/{{location.file_path}}" height="130" width="130">
				<div class="location_title"><h3>{{location.name}}</h3></div>
			</a>
		</div>
        
        
        <div class="location_new"> 
			<a ui-sref="newLocation">
				<img src="img/project_new_plus_icon_small.png" height="130" width="130">
				<div class="location_title_new"><h3>NEW LOCATION</h3></div>
			</a>
		</div>
	</div>
    
    
      <!--PROJECT AREAS-->
    <div class="areas">
        
        <h2 class="project_element_title">AREAS</h2>
        
        <div class="area"> <a ui-sref="viewArea"> <img src="img/" height="130" width="130">
            <div class="area_title"><h3>AREA NAME</h3></div></a></div>
        
        <div class="area"> <a ui-sref="viewArea"> <img src="img/" height="130" width="130">
            <div class="area_title"><h3>AREA NAME</h3></div></a></div>
        
        <div class="area"> <a ui-sref="viewArea"> <img src="img/" height="130" width="130">
            <div class="area_title"><h3>AREA NAME</h3></div></a></div>
        
        <div class="area"> <a ui-sref="viewArea"> <img src="img/" height="130" width="130">
            <div class="area_title"><h3>AREA NAME</h3></div></a></div>        
        
        <div class="area_new"> <a ui-sref="newArea"><img src="img/project_new_plus_icon_small.png" height="130" width="130">
            <div class="area_title_new"><h3>NEW AREA</h3></div></a></div>
	</div>
    
    
      <!--PROJECT EXPLORATIONS-->
    <div class="explorations">
        
        <h2 class="project_element_title">EXPLORATIONS</h2>
        
        <div class="exploration"> <a ui-sref="viewExploration"> <img src="img/" height="130" width="130">
            <div class="exploration_title"><h3>EXPLORATION NAME</h3></div></a></div>
        
        <div class="exploration"> <a ui-sref="viewExploration"> <img src="img/" height="130" width="130">
            <div class="exploration_title"><h3>EXPLORATION NAME</h3></div></a></div>
        
        <div class="exploration"> <a ui-sref="viewExploration"> <img src="img/" height="130" width="130">
            <div class="exploration_title"><h3>EXPLORATION NAME</h3></div></a></div>
        
        <div class="exploration"> <a ui-sref="viewExploration"> <img src="img/" height="130" width="130">
            <div class="exploration_title"><h3>EXPLORATION NAME</h3></div></a></div>
        
        <div class="exploration"> <a ui-sref="viewExploration"> <img src="img/" height="130" width="130">
            <div class="exploration_title"><h3>EXPLORATION NAME</h3></div></a></div>
        
        <div class="exploration"> <a ui-sref="viewExploration"> <img src="img/" height="130" width="130">
            <div class="exploration_title"><h3>EXPLORATION NAME</h3></div></a></div>
        
        <div class="exploration_new"> <a ui-sref="newExploration"><img src="img/project_new_plus_icon_small.png" height="130" width="130">
            <div class="exploration_title_new"><h3>NEW EXPLORATION</h3></div></a></div></div>
    </div>
</body>
    
    </html>

