<?php
	require_once('../../pluginsConfig.php');
	
	$con=mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);
	// Check connection
	if (mysqli_connect_errno()) {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}

	function getAll($con) {
		$exhibit = $_POST['exhibit'];


		$results = mysqli_query($con, "SELECT mbira_areas_id FROM mbira_areas_has_mbira_exhibits WHERE mbira_exhibits_id='$exhibit'");
		$areaArray = Array();
		while($row = mysqli_fetch_array($results)) {
			$aid = $row['mbira_areas_id'];
			$results2 = mysqli_query($con, "SELECT * FROM mbira_areas WHERE id='$aid'");
			$row2 = mysqli_fetch_array($results2);
			array_push($areaArray, $row2);

		}
	
		$results = mysqli_query($con, "SELECT mbira_locations_id FROM mbira_locations_has_mbira_exhibits WHERE mbira_exhibits_id='$exhibit'");
		$locationArray = Array();
		while($row = mysqli_fetch_array($results)) {
			$lid = $row['mbira_locations_id'];
			$results2 = mysqli_query($con, "SELECT * FROM mbira_locations WHERE id='$lid'");
			$row2 = mysqli_fetch_array($results2);
			array_push($locationArray, $row2);

		}

		echo json_encode([$locationArray, $areaArray]);

	}

	function getLoc($con) {
		$loc = $_POST['id'];
	
		$results = mysqli_query($con, "SELECT mbira_exhibits_id FROM mbira_locations_has_mbira_exhibits WHERE mbira_locations_id='$loc'");
		$exhibitArray = Array();
		while($row = mysqli_fetch_array($results)) {
			$eid = $row['mbira_exhibits_id'];
			$results2 = mysqli_query($con, "SELECT * FROM mbira_exhibits WHERE id='$eid'");
			$row2 = mysqli_fetch_array($results2);
			array_push($exhibitArray, $row2);
		}

		echo json_encode($exhibitArray);

	}

	function getArea($con) {
		$area = $_POST['id'];

		$results = mysqli_query($con, "SELECT mbira_exhibits_id FROM mbira_areas_has_mbira_exhibits WHERE mbira_areas_id='$area'");
		$exhibitArray = Array();
		while($row = mysqli_fetch_array($results)) {
			$eid = $row['mbira_exhibits_id'];
			$results2 = mysqli_query($con, "SELECT * FROM mbira_exhibits WHERE id='$eid'");
			$row2 = mysqli_fetch_array($results2);
			array_push($exhibitArray, $row2);

		}
	
		echo json_encode($exhibitArray);

	}



	if($_POST['task'] == 'getAll'){
		getAll($con);
	}else if($_POST['task'] == 'loc'){
		getLoc($con);
	}else if($_POST['task'] == 'area'){
		getArea($con);
	}
?>