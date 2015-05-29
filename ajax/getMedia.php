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

	$results = mysqli_query($con,"SELECT * FROM mbira_".$type."_media WHERE ".$typeID." = '$id'");

	$resultsArray = Array();
	while($row = mysqli_fetch_array($results)) {
		array_push($resultsArray, $row);
	}
	echo json_encode($resultsArray);

	mysqli_close($con);
?>