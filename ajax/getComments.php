<?php
	require_once('../../pluginsConfig.php');
	
	$type = $_POST['type'];
	$id = $_POST['id'];
	
	$con=mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);
	// Check connection
	if (mysqli_connect_errno()) {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}
		
	$results = mysqli_query($con, "SELECT * FROM mbira_".$type."_comments WHERE ".$type."_id = ".$id);
	$resultArray = Array();
	while($row = mysqli_fetch_array($results)) {
		array_push($resultArray, $row);
	}
	
	echo json_encode($resultArray);
	
?>