<?php
	require_once('../../pluginsConfig.php');
	
	$con=mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);
	// Check connection
	if (mysqli_connect_errno()) {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}
		
	$results = mysqli_query($con, "SELECT * FROM mbira_projects_has_mbira_users");
	$resultArray = Array();
	while($row = mysqli_fetch_array($results)) {
		array_push($resultArray, $row);
	}
	
	echo json_encode($resultArray);
	
?>