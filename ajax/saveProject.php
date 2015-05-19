<?php
require_once('../../pluginsInclude.php');

$con=mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

// Check connection
if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

//Delete project
function deleteRow($con){
	$id = $_POST['id'];
	
	//Get media to delete
	$mediaResult = mysqli_query($con, "SELECT image_path FROM mbira_projects WHERE id = '$id'");
	
	while($mediaRow = mysqli_fetch_array($mediaResult)) {
		unlink('../images/' .$mediaRow['image_path']);
	}
	mysqli_query($con,"DELETE FROM mbira_projects WHERE id='$id'");
}

//Update project
function updateRow($con){
	$id = $_POST['id'];
	$name = mysqli_real_escape_string($con, $_POST['name']);
	$sdesc = mysqli_real_escape_string($con, $_POST['shortDescription']);
	$desc = mysqli_real_escape_string($con, $_POST['description']);
	$path = $_POST['path'];
	
	//Save image
	$uploaddir = '../images/';

	//Use default image if no file provided
	if(isset($_FILES['file']['name'])){

		$mediaResult = mysqli_query($con, "SELECT image_path FROM mbira_projects WHERE id = '$id'");
		
		while($mediaRow = mysqli_fetch_array($mediaResult)) {
			unlink('../images/' .$mediaRow['image_path']);
		}
		$filename = explode('.', basename($_FILES['file']['name']));

		$uploadfile = $uploaddir . $filename[0].time().'.'.$filename[count($filename)-1];
		move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);
		$path = $filename[0].time().'.'.$filename[count($filename)-1];
	}
	
	mysqli_query($con,"UPDATE mbira_projects SET name='$name', shortDescription='$sdesc', description='$desc', image_path='$path' WHERE id='$id'");
}

function uploadLogo($con) {
	$uploaddir = '../images/';
	$id = $_POST['id'];
	var_dump($id);

	
	//Use default image if no file provided
	if(isset($_FILES['file']['name'])){
		$filename = explode('.', basename($_FILES['file']['name']));
		

		$uploadfile = $uploaddir . $filename[0].time().'.'.$filename[count($filename)-1];
		move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);
		$path = $filename[0].time().'.'.$filename[count($filename)-1];
	}else{
		$path = 'Default.png';
	}
	$string = "UPDATE mbira_projects SET logo_path='$path' WHERE id='$id'";
	echo $string;
	mysqli_query($con,"UPDATE mbira_projects SET logo_path='$path' WHERE id='$id'");
}

function createRow($con) {
	//Create new row
	$title = $_POST['name'];
	$sdesc = $_POST['shortDescription'];
	$desc = $_POST['description'];

	$uploaddir = '../images/';
	//Use default image if no file provided
	if(isset($_FILES['file']['name'])){
		$filename = explode('.', basename($_FILES['file']['name']));
		

		$uploadfile = $uploaddir . $filename[0].time().'.'.$filename[count($filename)-1];
		move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);
		$path = $filename[0].time().'.'.$filename[count($filename)-1];
	}else{
		$path = 'Default.png';
	}


	mysqli_query($con,"INSERT INTO mbira_projects (name, shortDescription, description, image_path) VALUES ('$title', '$sdesc', '$desc', '$path')");
		
	$result = mysqli_query($con, "SELECT * FROM mbira_projects ORDER BY id DESC LIMIT 1;");
	while($row = mysqli_fetch_array($result)) {
		$id = $row['id'];
	}
		
	//Create project in kora
	global $db;
	// truncate field lengths
	$name = mb_substr($title, 0, 255);
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
	$pid = $db->insert_id;

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
	/* $query  = 'INSERT INTO member (uid, pid, gid) VALUES (';
	$query .= escape($_POST['admin']).", '$pid', '$adminid')";
	$result = $db->query($query); */

	// update the project table to reflect the group ids
	$query  = "UPDATE project SET admingid='$adminid', defaultgid='$defid' WHERE pid='$pid'";
	$result = $db->query($query);

	//Create scheme in kora
	$result = $db->query("SELECT * FROM project where pid=".$pid."");
	$project = new Project($pid);
	$public = 0;

	//Add Location Scheme   		
	$query = "INSERT INTO scheme (pid, schemeName, sequence, publicIngestion, legal, description, nextid) ";
	$query .= "SELECT ".escape($project->GetPID()).", ";
	$query .= escape("Location").", COUNT(sequence) + 1, ";
	$query .= $public.", ".escape('').", ";
	$query .= escape('Default Scheme').", 0 FROM scheme ";
	$query .= "WHERE pid=".escape($project->GetPID());
	$result = $db->query($query);

	$sid = $db->insert_id;

	//Add location control collection
	$query = "INSERT INTO collection (schemeid, name, sequence, description) ";
	$query .= "SELECT ".escape($sid).", ";
	$query .= escape("Location").", COUNT(sequence) + 1, ";
	$query .= escape("Location control collection")." FROM collection ";
	$query .= "WHERE schemeid=".escape($sid);
	$result = $db->query($query);
		
	$cid = $db->insert_id;

	$newscheme = new Scheme($project->GetPID(), $sid);

	// Add systimestamp control
	$query = "INSERT INTO p".$pid."Control (schemeid, collid, type, name, description, required, searchable, advSearchable, showInResults, publicEntry, options, sequence) ";
	$query .= "VALUES ('$sid', '0', 'TextControl', 'systimestamp', '', '0', '0', '0', '0', '1', '<options><regex></regex><rows>1</rows><columns>25</columns><defaultValue /><textEditor>plain</textEditor></options>', '1')";
	$result = $db->query($query);

	// Add recordowner control
	$query = "INSERT INTO p".$pid."Control (schemeid, collid, type, name, description, required, searchable, advSearchable, showInResults, publicEntry, options, sequence) ";
	$query .= "VALUES ('$sid', '0', 'TextControl', 'recordowner', '', '0', '1', '1', '0', '1', '<options><regex></regex><rows>1</rows><columns>25</columns><defaultValue /><textEditor>plain</textEditor></options>', '2')";
	$result = $db->query($query);
	//echo $result;

	//Add location name TextControl
	$tempReq = $_REQUEST;
	$_REQUEST['name'] = 'Name';
	$_REQUEST['type'] = 'TextControl';
	$_REQUEST['description'] = 'Location name';
	$_REQUEST['submit'] = true;
	$_REQUEST['collectionid'] = $cid;
	$_REQUEST['publicentry'] = "on";
	//$newscheme->CreateControl(true);
	$_REQUEST = $tempReq;

	//Add location description TextControl
	$tempReq = $_REQUEST;
	$_REQUEST['name'] = 'Description';
	$_REQUEST['type'] = 'TextControl';
	$_REQUEST['description'] = 'Location description';
	$_REQUEST['submit'] = true;
	$_REQUEST['searchable'] = "on";
	$_REQUEST['advanced'] = "on";
	$_REQUEST['collectionid'] = $cid;
	$_REQUEST['publicentry'] = "on";
	//$newscheme->CreateControl(true);
	$_REQUEST = $tempReq;

	//Add location longitude TextControl
	$tempReq = $_REQUEST;
	$_REQUEST['name'] = 'Longitude';
	$_REQUEST['type'] = 'TextControl';
	$_REQUEST['description'] = 'Location longitude';
	$_REQUEST['submit'] = true;
	$_REQUEST['searchable'] = "on";
	$_REQUEST['advanced'] = "on";
	$_REQUEST['collectionid'] = $cid;
	$_REQUEST['publicentry'] = "on";
	//$newscheme->CreateControl(true);
	$_REQUEST = $tempReq;

	//Add location latitude TextControl
	$tempReq = $_REQUEST;
	$_REQUEST['name'] = 'Latitude';
	$_REQUEST['type'] = 'TextControl';
	$_REQUEST['description'] = 'Location latitude';
	$_REQUEST['submit'] = true;
	$_REQUEST['searchable'] = "on";
	$_REQUEST['advanced'] = "on";
	$_REQUEST['collectionid'] = $cid;
	$_REQUEST['publicentry'] = "on";
	//$newscheme->CreateControl(true);
	$_REQUEST = $tempReq;
			
	//Add pid to mbira_projects row
	$sql = "UPDATE mbira_projects SET pid='".$pid."' WHERE id=".$id;
	mysqli_query($con, $sql);

	echo $id;
}




if($_POST['task'] == 'create'){
	createRow($con);
}else if($_POST['task'] == 'update'){
	updateRow($con);
}else if($_POST['task'] == 'delete'){
	deleteRow($con);
}else if($_POST['task'] == 'uploadLogo'){
	uploadLogo($con);
}

mysqli_close($con);
?>