<!DOCTYPE html>
<html ng-app='mbira'>
    <head>
        <link rel="stylesheet" type="text/css" href="css/project_single.css"/>
    </head>
<body ng-controller='singleProjectCtrl'>
    
    <!--HEADER-->
    <div class="header">
        <div class="back"><a ui-sref="projects"><img src="img/back.png"/><p>ALL PROJECTS</p></a></div>
        <div class="title"><h1>{{project.NAME}}</h1></div>
        <div class="info"><a href="project_info.php"><img src="img/info.png"/></a></div></div>
    
    
    <!--PROJECT DESCRIPTION-->
    <p class="project_description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse non nisl quis lacus tempus pulvinar at a ligula. Aliquam non felis sapien. Suspendisse viverra ullamcorper mollis. Vivamus eget ex ultrices, fringilla est non, efficitur enim. Suspendisse sagittis pellentesque purus et porttitor. Phasellus non nisl arcu. Nulla sit amet vulputate odio. Donec id magna ac arcu molestie maximus vel id lacus. Sed sit amet est sed eros volutpat laoreet. Integer sed euismod enim. Curabitur nec nisi quam. Vivamus at ipsum blandit nisl dictum vestibulum. Proin quis mi nec massa interdum euismod. Vestibulum ex orci, fermentum non dui sed, placerat pellentesque lacus.</p>
    
    
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
        
        <div class="location"> <a ui-sref="viewLocation"> <img src="img/" height="130" width="130">
            <div class="location_title"><h3>LOCATION LONG LONG LONG LONG  NAME</h3></div></a></div>
        
        <div class="location"> <a ui-sref="viewLocation"> <img src="img/" height="130" width="130">
            <div class="location_title"><h3>LOCATION NAME</h3></div></a></div>
        
        <div class="location"> <a ui-sref="viewLocation"> <img src="img/" height="130" width="130">
            <div class="location_title"><h3>LOCATION NAME</h3></div></a></div>
        
        <div class="location"> <a ui-sref="viewLocation"><img src="img/" height="130" width="130">
            <div class="location_title"><h3>LOCATION NAME</h3></div></a></div>
        
        <div class="location_new"> <a ui-sref="newLocation"><img src="img/project_new_plus_icon_small.png" height="130" width="130">
            <div class="location_title_new"><h3>NEW LOCATION</h3></div></a></div></div>
    
    
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
    
</body>
    
    </html>

