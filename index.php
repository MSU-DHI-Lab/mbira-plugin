<?php
	require_once('../../model/manager.php');
	require_once('../pluginsConfig.php');
	
	Manager::Init();
	
	if (!Manager::IsLoggedIn())
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
	
	<script src="js/jquery/jquery-1.11.1.min.js"></script>
 
	<script src="angular/angular.min.js"></script>
	<script src="angular/angular-ui-router.min.js"></script>
	<script src="angular/fileUpload/angular-file-upload-shim.min.js"></script> 
	<script src="angular/fileUpload/angular-file-upload.min.js"></script> 
	<script src="angular/angular-sortable-view.js"></script>
	<script src="angular/isteven-multi-select.js"></script> 
	
	<script src="js/configController.js"></script> 
	<script src="js/userController.js"></script> 
	<script src="js/projectController.js"></script> 
	<script src="js/locationController.js"></script> 
	<script src="js/areaController.js"></script> 
	<script src="js/explorationController.js"></script> 
	<script src="js/exhibitController.js"></script> 
	<script src="js/notificationController.js"></script> 
    
	
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