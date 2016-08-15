<?php
	require_once('../../../pluginsConfig.php');
	$con = new PDO("mysql:dbname=$dbname;host=$dbhost;charset=utf8", $dbuser, $dbpass);
	$con->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
	$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	function random_salt($len = 16) {
		$chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()-=_+';
		$l = strlen($chars) - 1;
		$str = '';
		for ($i = 0; $i < $len; ++$i) {
			$str .= $chars[rand(0, $l)];
		}
		return $str;
	}

	function add($con) {
		$error = array();
		
		$username = $_POST['username'];
		$fname = $_POST['fName'];
		$lname = $_POST['lName'];
		$email = $_POST['email'];
		$pass = $_POST['pass1'];
		
		$salt = random_salt();
		$password = hash("sha256", $pass . $salt);

		$sql_query = $con->prepare("INSERT INTO mbira_users (username, firstName, lastName, email, password, salt) VALUES (:username, :fname, :lname, :email, :password, :salt)");
		try {
			$sql_query -> execute(array('fname' => $fname, 'lname' => $lname, 'username' => $username, 'email' => $email, 'password' => $password, 'salt' => $salt));
		} catch (PDOException $e) {
		   if ($e->errorInfo[1] == 1062) {
				$error = array(
					"error" => "Duplicate entry"
				);
				echo json_encode($error);
			}
		}
	}

	function deleteRow($con) {
		$id = $_POST['user'];

		$results = $con->prepare("DELETE FROM mbira_users WHERE id = :id");
		$results -> execute(array('id' => $id));

		$results = $con->prepare("DELETE FROM mbira_projects_has_mbira_users WHERE mbira_users_id= :id");
		$results -> execute(array('id' => $id));
	}

	function getUser($con) {
		$id = $_POST['user'];

		$results = $con->prepare("SELECT firstName, lastName, email, id, username FROM mbira_users WHERE id = :id");
		$results -> execute(array('id' => $id));

		$resultsArray = Array();
		foreach ($results as $row) {
		    array_push($resultsArray, $row);
		}
		echo json_encode($resultsArray);
	}

	function editUser($con) {	
		$id = $_POST['id'];
		$fname = $_POST['firstName'];
		$lname = $_POST['lastName'];
		$username = $_POST['username'];
		$email = $_POST['email'];

		$sql_query = $con->prepare("UPDATE mbira_users SET firstName=:fname, lastName=:lname, username=:username, email=:email WHERE id=:id");
		
		try {
			$sql_query -> execute(array('id' => $id, 'fname' => $fname, 'lname' => $lname, 'username' => $username, 'email' => $email));

			if ($_POST['pass1']) {
				echo "string";
				$salt = random_salt();
				$password = hash("sha256", $_POST['pass1'] . $salt);

				$sql_query = $con->prepare("UPDATE mbira_users SET password=:password, salt=:salt WHERE id=:id");
				$sql_query -> execute(array('id' => $id, 'password' => $password, 'salt' => $salt));

			}
		} catch (PDOException $e) {
		   if ($e->errorInfo[1] == 1062) {
				$error = array(
					"error" => "Duplicate entry"
				);
				echo json_encode($error);
			}
		}
	}

	function getAll($con) {
		$results = $con->prepare("SELECT username, email, firstName, lastName, id FROM mbira_users");
		$results -> execute();

		$resultsArray = Array();
		foreach ($results as $row) {
		    array_push($resultsArray, $row);
		}
		echo json_encode($resultsArray);
		
	}

if($_POST['task'] == 'create'){
	add($con);
}else if($_POST['task'] == 'edit'){
	editUser($con);
}else if($_POST['task'] == 'get'){
	getUser($con);
}else if($_POST['task'] == 'all'){
	getAll($con);
}else if($_POST['task'] == 'delete'){
	deleteRow($con);
}

?>