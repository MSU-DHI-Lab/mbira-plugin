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
	
	function add($con) {
		$user = $_POST["user"];
		$error = array();
		
		$username = $con->real_escape_string($user['username']);
		$fname = $con->real_escape_string($user['fName']);
		$lname = $con->real_escape_string($user['lName']);
		$email = $con->real_escape_string($user['email']);
		$pass = $con->real_escape_string($user['pass1']);
		$exp = $con->real_escape_string($user['expertise']['value']);

		mysqli_query($con,"INSERT INTO mbira_users (username, firstName, lastName, email, password, isExpert, salt) VALUES ('$username', '$fname', '$lname', '$email', '$pass', '$exp', 1)");
		
		if(mysqli_error($con)) {
			$error = array(
				"error" => mysqli_error($con)
			);
		}
		
		echo json_encode($error);
	}


	if($_POST['type'] == 'del'){
		del($con);
	}else if($_POST['type'] == 'insert'){
		insert($con);
	}else if($_POST['type'] == 'add'){
		add($con);
	}

	mysqli_close($con);
?>