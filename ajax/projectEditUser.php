<?php
	require_once('../../pluginsConfig.php');
	require_once(basePathPlugin.'includes/includes.php');

	$con=mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

	// Check connection
	if (mysqli_connect_errno()) {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}

	function insert($con) {

		$expert = $_POST["isExpert"];
		$user = $_POST["id"];
		$proj = $_POST["project"];

		//Create row in mbira_projects_has_mbira_users
		mysqli_query($con,"INSERT INTO mbira_projects_has_mbira_users (mbira_users_id, isExpert, mbira_projects_id) VALUES ('$user', '$expert', '$proj')");

	}

	function del($con) {
		$user = $_POST["id"];
		$proj = $_POST["project"];
		echo $user;
		echo $proj;

		//Remove row in mbira_projects_has_mbira_users
		mysqli_query($con,"DELETE FROM mbira_projects_has_mbira_users WHERE mbira_users_id='$user' AND mbira_projects_id='$proj'");

	}

	if($_POST['type'] == 'del'){
		del($con);
	}else if($_POST['type'] == 'insert'){
		insert($con);
	}

	mysqli_close($con);
?>