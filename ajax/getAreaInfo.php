<?php
	require_once('../../pluginsConfig.php');
	
	$id = $_POST['id'];
	$con=mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);
	// Check connection
	if (mysqli_connect_errno()) {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}
		
	$results = mysqli_query($con, "SELECT * FROM mbira_areas WHERE id = ".$id);
	$areaArray = Array();
	while($row = mysqli_fetch_array($results)) {
		array_push($areaArray, $row);
	}
	
	echo json_encode($areaArray[0]);
	
?>