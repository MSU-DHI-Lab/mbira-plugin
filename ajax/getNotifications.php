<?php
	require_once('../../pluginsConfig.php');
	$con = new PDO("mysql:dbname=$dbname;host=$dbhost;charset=utf8", $dbuser, $dbpass);
	$con->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
	$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	$results = $con->prepare("SELECT mbira_location_comments.id, mbira_location_comments.user_id, mbira_location_comments.location_id, mbira_location_comments.replyTo, UNIX_TIMESTAMP(created_at), mbira_locations.name FROM mbira_location_comments INNER JOIN mbira_locations ON mbira_location_comments.location_id=mbira_locations.id");
	$results -> execute();
	$resultArray = Array();

	foreach ($results as $row) {
		$row['replyTo'] != null && $row['replyTo'] != 0 ? $reply = true : $reply = false;
	    array_push($resultArray, array('type' => 'comment', 'place' => 'Location', 'place_name' => $row['name'], 'id' => $row['location_id'], 'reply' => $reply, 'timestamp' => $row['UNIX_TIMESTAMP(created_at)'], 'user_id' => $row['user_id'] ));
	}

	$results = $con->prepare("SELECT mbira_exploration_comments.id, mbira_exploration_comments.user_id, mbira_exploration_comments.exploration_id, mbira_exploration_comments.replyTo, UNIX_TIMESTAMP(created_at), mbira_explorations.name FROM mbira_exploration_comments INNER JOIN mbira_explorations ON mbira_exploration_comments.exploration_id=mbira_explorations.id");
	$results -> execute();

	foreach ($results as $row) {
		$row['replyTo'] != null && $row['replyTo'] != 0 ? $reply = true : $reply = false;
	    array_push($resultArray, array('type' => 'comment', 'place' => 'Exploration', 'place_name' => $row['name'], 'id' => $row['exploration_id'], 'reply' => $reply, 'timestamp' => $row['UNIX_TIMESTAMP(created_at)'], 'user_id' => $row['user_id'] ));
	}

	$results = $con->prepare("SELECT mbira_area_comments.id, mbira_area_comments.user_id, mbira_area_comments.area_id, mbira_area_comments.replyTo, UNIX_TIMESTAMP(created_at), mbira_areas.name FROM mbira_area_comments INNER JOIN mbira_areas ON mbira_area_comments.area_id=mbira_areas.id");
	$results -> execute();

	foreach ($results as $row) {
		$row['replyTo'] != null && $row['replyTo'] != 0 ? $reply = true : $reply = false;
	    array_push($resultArray, array('type' => 'comment', 'place' => 'Location', 'place_name' => $row['name'], 'id' => $row['area_id'], 'reply' => $reply, 'timestamp' => $row['UNIX_TIMESTAMP(created_at)'], 'user_id' => $row['user_id'] ));
	}


	
	echo json_encode($resultArray);
?>