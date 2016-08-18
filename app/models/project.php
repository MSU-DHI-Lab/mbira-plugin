<?php
require_once('../../../pluginsConfig.php');
require_once(basePathPlugin.'includes/includes.php');
require_once('../../utils/removeFolders.php');

$con=mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

// Check connection
if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

//Delete project
function deleteRow($con){
	$id = $_POST['id'];

	Delete('../../media/images/project'.$id.'/');

	$pidResult = mysqli_query($con, "SELECT pid FROM mbira_projects WHERE id = '$id'");
	$pidRow = mysqli_fetch_array($pidResult);
	$pid = $pidRow["pid"];

	mysqli_query($con,"DELETE FROM mbira_projects WHERE id='$id'");
	mysqli_query($con,'DROP TABLE p'.$pid.'Control');
	mysqli_query($con,'DROP TABLE p'.$pid.'Data');
	mysqli_query($con,'DROP TABLE p'.$pid.'PublicData');
	mysqli_query($con,'DELETE FROM project WHERE pid='.$pid);
	mysqli_query($con,'DELETE FROM scheme WHERE pid='.$pid);
	mysqli_query($con,'DELETE FROM permGroup WHERE pid='.$pid);
	mysqli_query($con,'DELETE FROM collection WHERE schemeid='.$pid);


}

//Update project
function updateRow($con){
	$id = $_POST['id'];
	$name = mysqli_real_escape_string($con, $_POST['name']);
	$sdesc = mysqli_real_escape_string($con, $_POST['shortDescription']);
	$desc = mysqli_real_escape_string($con, $_POST['description']);
	$path = $_POST['path'];
	
	//Save image
	$uploaddir = '../../media/images/project'.$id.'/';
	//Use default image if no file provided
	if(isset($_FILES['file']['name'])){

		$mediaResult = mysqli_query($con, "SELECT image_path FROM mbira_projects WHERE id = '$id'");
		
		while($mediaRow = mysqli_fetch_array($mediaResult)) {
			unlink('../../' .$mediaRow['image_path']);
		}
		$filename = explode('.', basename($_FILES['file']['name']));

		$uniqid = uniqid();
		$uploadfile = $uploaddir .$uniqid.'.'.$filename[count($filename)-1];
		move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);
		$path = 'media/images/project'.$id.'/'.$uniqid.'.'.$filename[count($filename)-1];
	}
	
	mysqli_query($con,"UPDATE mbira_projects SET name='$name', shortDescription='$sdesc', description='$desc', image_path='$path' WHERE id='$id'");
}

function uploadLogo($con) {
	$id = $_POST['id'];
	$uploaddir = '../../media/images/project'.$id.'/';

	//Use default image if no file provided
	if(isset($_FILES['file']['name'])){
		$mediaResult = mysqli_query($con, "SELECT logo_image_path FROM mbira_projects WHERE id = '$id'");
		
		while($mediaRow = mysqli_fetch_array($mediaResult)) {
			unlink('../../' .$mediaRow['logo_image_path']);
		}
		
		$filename = explode('.', basename($_FILES['file']['name']));
		
		$uniqid = uniqid();
		$uploadfile = $uploaddir .$uniqid.'.'.$filename[count($filename)-1];
		move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);
		$path = 'media/images/project'.$id.'/'.$uniqid.'.'.$filename[count($filename)-1];
	}else{
		$path = 'app/assets/images/Default.png';
	}
	mysqli_query($con,"UPDATE mbira_projects SET logo_image_path='$path' WHERE id='$id'");
}

function uploadHeader($con) {
	$id = $_POST['id'];
	$uploaddir = '../../media/images/project'.$id.'/';
		
	//Use default image if no file provided
	if(isset($_FILES['file']['name'])){
		$mediaResult = mysqli_query($con, "SELECT header_image_path FROM mbira_projects WHERE id = '$id'");
		
		while($mediaRow = mysqli_fetch_array($mediaResult)) {
			unlink('../../' .$mediaRow['header_image_path']);
		}

		$filename = explode('.', basename($_FILES['file']['name']));
		
		$uniqid = uniqid();
		$uploadfile = $uploaddir .$uniqid.'.'.$filename[count($filename)-1];
		move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);
		$path = 'media/images/project'.$id.'/'.$uniqid.'.'.$filename[count($filename)-1];
	}else{
		$path = 'app/assets/images/Default-Header.png';
	}
	mysqli_query($con,"UPDATE mbira_projects SET header_image_path='$path' WHERE id='$id'");
}

function cleanDb($con, $id) {
	$locResult = mysqli_query($con,"SELECT image_path, thumb_path FROM mbira_projects WHERE id='$id'");
	while($locRow = mysqli_fetch_array($locResult)) {
		unlink("../../".$locRow['image_path']); //remove the file
		unlink("../../".$locRow['thumb_path']); //remove the file
	}
}

function saveThumbnail($con) {
	$project_id = $_POST['project'];

	$thumbCanvasData = $_POST['thumbCanvasData'];
	$thumbCropData = $_POST['thumbCropData'];
	$uploaddir = '../../media/images/project'.$project_id.'/';

	if ($_POST['type'] == 'new') {
		cleanDb($con, $project_id);
		$name = explode('.', basename($_FILES['file']['name']));

		$uniqid = uniqid();
		$uploadfile = $uploaddir .$uniqid.'.'.$name[count($name)-1];
		move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);
		$file_path = 'media/images/project'.$project_id.'/'.$uniqid.'.'.$name[count($name)-1];

		$thumb_file_ext = explode('/', $_FILES['croppedThumbnail']['type'])[1];
		$thumb_uploadfile = $uploaddir .$uniqid.'_thumb.'.$thumb_file_ext;
		move_uploaded_file($_FILES['croppedThumbnail']['tmp_name'], $thumb_uploadfile);
		$thumb_file_path = 'media/images/project'.$project_id.'/'.$uniqid.'_thumb.'.$thumb_file_ext;	

		$sql = "UPDATE mbira_projects SET image_path='$file_path', thumbCanvasData='$thumbCanvasData', thumbCropData='$thumbCropData', thumb_path='$thumb_file_path' WHERE id=".$project_id;
		mysqli_query($con, $sql);

	} else {

		$locResult = mysqli_query($con,"SELECT image_path, thumb_path FROM mbira_projects WHERE id='$project_id'");
		while($locRow = mysqli_fetch_array($locResult)) {
			$file_path = $locRow['image_path'];
			unlink("../../".$locRow['thumb_path']); //remove the file
		}

		$f_path = explode('/', $file_path);
		$last_element = end($f_path);
		$temp_array = explode('.', $last_element );
		$uniqid = $temp_array[0];

		$thumb_file_ext = explode('/', $_FILES['croppedThumbnail']['type'])[1];
		$thumb_uploadfile = $uploaddir .$uniqid.'_thumb.'.$thumb_file_ext;
		move_uploaded_file($_FILES['croppedThumbnail']['tmp_name'], $thumb_uploadfile);

		mysqli_query($con, "UPDATE mbira_projects SET thumbCanvasData='$thumbCanvasData', thumbCropData='$thumbCropData' WHERE id='$project_id'");

	}

}

function createRow($con) {
	//Create new row
	$title = mysqli_real_escape_string($con, $_POST['name']);
	$sdesc = mysqli_real_escape_string($con, $_POST['shortDescription']);
	$desc = mysqli_real_escape_string($con, $_POST['description']);

	mysqli_query($con,"INSERT INTO mbira_projects (name, shortDescription, description) VALUES ('$title', '$sdesc', '$desc')");

	$result = mysqli_query($con, "SELECT * FROM mbira_projects ORDER BY id DESC LIMIT 1;");
	while($row = mysqli_fetch_array($result)) {
		$id = $row['id'];
	}

	$uploaddir = '../../media/images/project'.$id.'/';

	if (!file_exists($uploaddir)) {
	    mkdir($uploaddir, 0775, true);
	}

	//Use default image if no file provided
	if(isset($_FILES['file']['name'])){
		$filename = explode('.', basename($_FILES['file']['name']));
		
		$uniqid = uniqid();
		$uploadfile = $uploaddir .$uniqid.'.'.$filename[count($filename)-1];
		move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);
		$path = 'media/images/project'.$id.'/'.$uniqid.'.'.$filename[count($filename)-1];
	}else{
		$path = 'app/assets/images/Default.png';
	}

	//Add path to mbira_projects row
	$sql = "UPDATE mbira_projects SET image_path='".$path."', thumb_path='".$path."' WHERE id=".$id;
	mysqli_query($con, $sql);
		
	//Create project in kora
	global $db;
	// truncate field lengths
	$name = mb_substr($title, 0, 255);
	$description = mb_substr($_POST['description'], 0, 255);
	$shortDescription = mb_substr($_POST['shortDescription'], 0, 255);
	//grab quota
	$quota = 0;
	// check for the active flag.  1 = enabled, anything else = inactive
	$active = 1;
	//if ($active != 1) $active = 0;
	$styleid = (isset($_POST['style']) ? (int)$_POST['style'] : 0);

	// Insert the initial information
	$query  = 'INSERT INTO project (name, description, active, styleid, quota, shortDescription) VALUES (';
	$query .= escape($name).', ';
	$query .= escape($description).', ';
	$query .= escape($active).',';
	$query .= $styleid.',';
	$query .= escape($quota).', ';
	$query .= escape($shortDescription).')';

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
	$newscheme->CreateControl(true);
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
	$newscheme->CreateControl(true);
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
	$newscheme->CreateControl(true);
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
	$newscheme->CreateControl(true);
	$_REQUEST = $tempReq;
			
	//Add pid to mbira_projects row
	$sql = "UPDATE mbira_projects SET pid='".$pid."' WHERE id=".$id;
	mysqli_query($con, $sql);

	echo $id;
}

function getAll($con) {
	$results = mysqli_query($con, "SELECT * FROM mbira_projects");
	$resultsArray = Array();
	while($row = mysqli_fetch_array($results)) {
		array_push($resultsArray, $row);
	}
	echo json_encode($resultsArray);
}

function getInfo($con) {
	$id = $_POST['id'];

	//get project info
	$results = mysqli_query($con, "SELECT * FROM mbira_projects WHERE id = ".$id);
	$projectArray = Array();
	while($row = mysqli_fetch_array($results)) {
		array_push($projectArray, $row);
	}
	
	//get location info
	$results = mysqli_query($con, "SELECT * FROM mbira_locations WHERE project_id = ".$id);
	$locationArray = Array();
	while($row = mysqli_fetch_array($results)) {
		array_push($locationArray, $row);
	}
	
	//get areas info
	$results = mysqli_query($con, "SELECT * FROM mbira_areas WHERE project_id = ".$id);
	$areaArray = Array();
	while($row = mysqli_fetch_array($results)) {
		array_push($areaArray, $row);
	}
	
	//get exploration info
	$results = mysqli_query($con, "SELECT * FROM mbira_explorations WHERE project_id = ".$id);
	$explorationArray = Array();
	while($row = mysqli_fetch_array($results)) {
		array_push($explorationArray, $row);
	}
	
	//get exhibit info
	$results = mysqli_query($con, "SELECT * FROM mbira_exhibits WHERE project_id = ".$id);
	$exhibitArray = Array();
	while($row = mysqli_fetch_array($results)) {
		array_push($exhibitArray, $row);
	}
	echo json_encode([$projectArray[0], $locationArray, $areaArray, $explorationArray, $exhibitArray]);
}

if($_POST['task'] == 'create'){
	createRow($con);
}else if($_POST['task'] == 'update'){
	updateRow($con);
}else if($_POST['task'] == 'delete'){
	deleteRow($con);
} else if ($_POST['task'] == 'thumbnail'){
	saveThumbnail($con);
}else if($_POST['task'] == 'uploadLogo'){
	uploadLogo($con);
}else if($_POST['task'] == 'uploadHeader'){
	uploadHeader($con);
} else if ($_POST['task'] == 'all'){
	getAll($con);
} else if ($_POST['task'] == 'info'){
	getInfo($con);
}

mysqli_close($con);
?>