<?php
	require_once('../../model/manager.php');
	require_once('../pluginsConfig.php');
	
	Kora\Manager::Init();
	
	if (!Kora\Manager::IsLoggedIn())
	{
		header( 'Location: ../../accountLogin.php' ) ;
	}	
	
	require_once("../pluginsInclude.php");
	include_once(basePathPlugin.'plugins/pluginsHeader.php');
?>

<html>
<head>
	
	<meta http-equiv="content-type" content="text/html; charset=utf-8" >
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">  	
	
	<script src="https://cdn.jsdelivr.net/tipped/4.0.10/js/tipped/tipped.js"></script>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/tipped/4.0.10/css/tipped/tipped.css">

	<link rel="stylesheet" href="vendor/css/hint.min.css">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.2/css/font-awesome.min.css">
	<link rel="stylesheet" href="vendor/css/cropper.min.css">
	<link rel="stylesheet" href="vendor/css/flat-medium.css">
	<link rel="stylesheet" href="vendor/css/loaders.min.css">
	<link rel="stylesheet" href="//cdn.jsdelivr.net/medium-editor/latest/css/medium-editor.min.css" type="text/css" media="screen" charset="utf-8">
 
	<script src="vendor/js/jquery-1.11.1.min.js"></script>

	<script src="vendor/js/hideShowPassword.min.js"></script>
	<script src="vendor/js/clipboard.min.js"></script>
	<script src="vendor/js/cropper.min.js"></script>
 
	<script src="vendor/js/angular/angular.min.js"></script>
	<script src="vendor/js/angular/angular-animate.min.js"></script>
	<script src="vendor/js/angular/angular-ui-router.min.js"></script>
	<script src="vendor/js/angular/fileUpload/angular-file-upload-shim.min.js"></script> 
	<script src="vendor/js/angular/fileUpload/angular-file-upload.min.js"></script> 
	<script src="vendor/js/angular/angular-sortable-view.js"></script>
	<script src="vendor/js/angular/isteven-multi-select.js"></script>
	<script src="//cdn.jsdelivr.net/medium-editor/latest/js/medium-editor.min.js"></script>
	<script src="vendor/js/angular-medium-editor.min.js"></script>

	<script src="app/controllers/configController.js"></script> 
	<script src="app/controllers/projects/newProjectController.js"></script> 
	<script src="app/controllers/projects/singleProjectController.js"></script> 
	<script src="app/controllers/projects/viewProjectsController.js"></script> 
	<script src="app/controllers/projects/projectInfoController.js"></script> 
	<script src="app/controllers/areas/newAreaController.js"></script> 
	<script src="app/controllers/areas/singleAreaController.js"></script> 
	<script src="app/controllers/areas/viewAreasController.js"></script>  
	<script src="app/controllers/locations/newLocationController.js"></script> 
	<script src="app/controllers/locations/singleLocationController.js"></script> 
	<script src="app/controllers/locations/viewLocationsController.js"></script> 
	<script src="app/controllers/users/newUserController.js"></script> 
	<script src="app/controllers/users/editUserController.js"></script> 
	<script src="app/controllers/users/usersToProjectController.js"></script> 
	<script src="app/controllers/users/viewUsersController.js"></script> 
	<script src="app/controllers/explorations/newExplorationController.js"></script> 
	<script src="app/controllers/explorations/singleExplorationController.js"></script> 
	<script src="app/controllers/explorations/viewExplorationsController.js"></script> 
	<script src="app/controllers/exhibits/newExhibitController.js"></script> 
	<script src="app/controllers/exhibits/singleExhibitController.js"></script> 
	<script src="app/controllers/exhibits/viewExhibitsController.js"></script> 
	<script src="app/controllers/exhibits/exhibitInfoController.js"></script> 
	<script src="js/mediaController.js"></script>
	<script src="js/notificationController.js"></script>
	<script src="js/settingsController.js"></script>
	
</head>
<body ng-app="mbira">
	<div id="wrap" class="container wrap">	
		
		<div class="content" ui-view=""></div>	

	</div>
	<?php
		require_once(basePathPlugin."plugins/pluginsFooter.php");
	?>
</body>
</html>
