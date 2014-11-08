<?php


function createRow() {
	require_once('../../pluginsConfig.php');
	
	$title = $_POST['name'];
	$desc = $_POST['description'];
	
	$con=mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);
	// Check connection
	if (mysqli_connect_errno()) {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}
	
	mysqli_query($con,"INSERT INTO mbira_projects (name, description) VALUES ('$title', '$desc')");
		
	$result = mysqli_query($con, "SELECT * FROM mbira_projects ORDER BY id DESC LIMIT 1;");
	
	while($row = mysqli_fetch_array($result)) {
	 echo $row['id'];
	}
}

function uploadFile() {
	require_once('../../pluginsConfig.php');
	
	$id = $_POST['id'];

	$uploaddir = '../images/';
	$uploadfile = $uploaddir . basename($_FILES['file']['name']);
	
	$con=mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

	if (mysqli_connect_errno()) {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}
	
	move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);
	$path = $_FILES['file']['name'];
	
	$sql = "UPDATE mbira_projects SET image_path='".$path."' WHERE id=".$id;
	
	if (mysqli_query($con, $sql)) {
		echo "Record updated successfully";
	} else {
		echo "Error updating record: " . mysqli_error($con);
	}
	
	mysqli_close($con);
}

function CreateNewProject() {
		require_once('../../pluginsInclude.php');
   		global $db;
   		// syntax checks
   		$err = false;
   		
   		//if (empty($_POST['name_kora'])) { $err = true; echo gettext('You must provide a project name.<br>'); }
   		//if (empty($_POST['description'])) { $err = true; echo gettext('You must provide a project description.<br>'); }
   		//if (!is_numeric($_REQUEST['quota'])) { $err = true; echo gettext('Quota must be a number, use 0 for unlimited.<br>'); }
   		//if (!isset($_POST['active'])) { $err = true; echo gettext('Connection error, try again.<br>'); }
   		//if (mb_strlen($_POST['description']) > 255) { $err = true; echo gettext('Description too long.<br>'); }
   		//if (mb_strlen($_POST['name_kora']) > 255) { $err = true; echo gettext('Name too long.<br>'); }
   		if (!$err){
   			// truncate field lengths
   			$name = mb_substr($_POST['name_kora'], 0, 255);
   			$description = mb_substr($_POST['description'], 0, 255);
   			//grab quota
   			$quota = 0;
   			// check for the active flag.  1 = enabled, anything else = inactive
   			$active = 1;
   			//if ($active != 1) $active = 0;
   			$styleid = (isset($_POST['style']) ? (int)$_POST['style'] : 0);
   			
   			// Insert the initial information
   			$query  = 'INSERT INTO project (name, description, active, styleid, quota) VALUES (';
   			$query .= escape($name).', ';
   			$query .= escape($description).', ';
   			$query .= escape($active).',';
   			$query .= $styleid.',';
   			$query .= escape($quota).')';
   			
   			$result = $db->query($query);
   			$pid    = $db->insert_id;
   			
   			// create project control and data tables
   			$db->query('CREATE TABLE p'.$pid.'Control(
   				cid INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
   				schemeid INTEGER UNSIGNED NOT NULL,
   				collid INTEGER UNSIGNED NOT NULL,
   				type VARCHAR(30) NOT NULL,
   				name VARCHAR(255) NOT NULL,
   				description VARCHAR(255),
   				required TINYINT(1) NOT NULL,
   				searchable TINYINT(1) NOT NULL,
   				advSearchable TINYINT(1) UNSIGNED NOT NULL,
   				showInResults TINYINT(1) NOT NULL,
   				showInPublicResults TINYINT(1) NOT NULL,
   				publicEntry TINYINT(1) NOT NULL,
   				options LONGTEXT NOT NULL,
   				sequence INTEGER UNSIGNED NOT NULL,
   				PRIMARY KEY(cid)) CHARACTER SET utf8 COLLATE utf8_general_ci');
   			
   			$db->query('CREATE TABLE p'.$pid.'Data(
   				id VARCHAR(30) NOT NULL,
   				cid INTEGER UNSIGNED NOT NULL,
   				schemeid INTEGER UNSIGNED NOT NULL,
   				value LONGTEXT,
   				PRIMARY KEY(id,cid)) CHARACTER SET utf8 COLLATE utf8_general_ci');
   			
   			
   			// create project data table for *PUBLIC* ingestion
   			$db->query('CREATE TABLE IF NOT EXISTS p'.$pid.'PublicData(
   				id VARCHAR(30) NOT NULL,
   				cid INTEGER UNSIGNED NOT NULL,
   				schemeid INTEGER UNSIGNED NOT NULL,
   				value LONGTEXT,
   				PRIMARY KEY(id,cid)) CHARACTER SET utf8 COLLATE utf8_general_ci');
   			
   			
   			
   			// create the initial groups and insert the default admin into the admin group
   			$query  = 'INSERT INTO permGroup (pid, name, permissions) VALUES (';
   			$query .= "'$pid', 'Administrators', '".PROJECT_ADMIN."')";
   			
   			$result = $db->query($query);
   			$adminid= $db->insert_id;        
   			
   			// create the initial groups and insert the default admin into the admin group
   			$query  = 'INSERT INTO permGroup (pid, name, permissions) VALUES (';
   			$query .= "'$pid', 'Default', '0')";
   			
   			$result = $db->query($query);
   			$defid  = $db->insert_id;
   			
   			// Insert the Initial Admin User
   			$query  = 'INSERT INTO member (uid, pid, gid) VALUES (';
   			$query .= escape($_POST['admin']).", '$pid', '$adminid')";
   			$result = $db->query($query);
   			
   			// update the project table to reflect the group ids
   			$query  = "UPDATE project SET admingid='$adminid', defaultgid='$defid' WHERE pid='$pid'";
   			$result = $db->query($query);
   		}
		
   	}

if(isset($_POST['name'])){
	createRow();
}else{
	uploadFile();
	CreateNewProject();
}
?>