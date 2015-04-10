<?php
	require_once('../../pluginsConfig.php');
	require_once(basePathPlugin.'includes/includes.php');

	$con=mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

	// Check connection
	if (mysqli_connect_errno()) {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}


	$piece = $_POST['piece'];
	$type = $_POST['type'];

	if ($type == 'loc') {
		mysqli_query($con,"DELETE FROM mbira_locations_has_mbira_exhibits WHERE mbira_locations_id='$piece'");
	} else {
		mysqli_query($con,"DELETE FROM mbira_areas_has_mbira_exhibits WHERE mbira_areas_id='$piece'");
	}

	
	$exhibits = json_decode($_POST['exhibits']);
		
	//Link areas and locations to exhibit
	foreach ($exhibits as $exhibit) {
		if ($type == 'loc') {
			mysqli_query($con,"INSERT INTO mbira_locations_has_mbira_exhibits (mbira_locations_id, mbira_exhibits_id) VALUES ('$piece', '".$exhibit->id."')");
		} else {
			mysqli_query($con,"INSERT INTO mbira_areas_has_mbira_exhibits (mbira_areas_id, mbira_exhibits_id) VALUES ('$piece', '".$exhibit->id."')");
		}
	}