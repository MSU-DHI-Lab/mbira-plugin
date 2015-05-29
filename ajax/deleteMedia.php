<?php
	require_once('../../pluginsConfig.php');
	$con=mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);
	// Check connection
	if (mysqli_connect_errno()) {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}

	$id = $_POST['id'];
	$type = $_POST['type'];
	if ($type == 'loc'){
		$typeID = 'location_id';
	} else if ($type == 'exp'){
		$typeID = 'exploration_id';
	}	else if ($type == 'area'){
		$typeID = 'area_id';
	} 

	mysqli_query($con,"DELETE FROM mbira_".$type."_media WHERE id = '$id'");
	
	unlink(basePathPlugin . "plugins/mbira_plugin/" . $_POST['path']);

	mysqli_close($con);
?>