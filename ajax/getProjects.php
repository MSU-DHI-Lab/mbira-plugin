<?php
	$con=mysqli_connect("rush.matrix.msu.edu", "jacob", "wrazap3u", "jacob_dev");
	// Check connection
	if (mysqli_connect_errno()) {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}
		
	$results = mysqli_query($con, "SELECT * FROM testPlugin ORDER BY ID DESC");
	$resultsArray = Array();
	while($row = mysqli_fetch_array($results)) {
		array_push($resultsArray, $row);
	}
	echo json_encode($resultsArray);
?>