<?php
	require_once('../../pluginsConfig.php');
	
	$id = $_POST['id'];
	$con=mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);
	// Check connection
	if (mysqli_connect_errno()) {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}
		
	$results = mysqli_query($con, "SELECT * FROM mbira_exhibits WHERE id = ".$id);
	$exhibitArray = Array();
	while($row = mysqli_fetch_array($results)) {
		array_push($exhibitArray, $row);
	}
	
	echo json_encode($exhibitArray[0]);
	
?>