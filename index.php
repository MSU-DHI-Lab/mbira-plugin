<head>    
	<?php
		//require_once("../pluginsInclude.php");
		//include_once(basePathPlugin.'includes/header.php');
		//include_once(basePathPlugin.'includes/menu.php');
	?>
	<meta http-equiv="content-type" content="text/html; charset=utf-8" >
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">  	

	<link rel="stylesheet" type="text/css" href="css/project_single.css"/>
	<link rel="stylesheet" type="text/css" href="css/project_all.css"/>
	
	<script src="js/jquery/jquery-1.11.1.min.js"></script> 
	<script src="angular/angular.min.js"></script>
	<script src="angular/angular-ui-router.min.js"></script>
	<script src="angular/fileUpload/angular-file-upload-shim.min.js"></script> 
	<script src="angular/fileUpload/angular-file-upload.min.js"></script> 

	<script src="js/controllers.js"></script> 
    
	
</head>
<body ng-app="mbira">
	<div id="wrap" class="container wrap">	
		
		<div class="content" ui-view=""></div>	

	</div>
	<?php
		//include_once(basePathPlugin.'includes/footer.php');
	?>
</body>
</html>