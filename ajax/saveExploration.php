<?php
require_once('../../pluginsConfig.php');
require_once(basePathPlugin.'includes/includes.php');

$con=mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);
// Check connection
if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

//Delete location
function deleteRow($con){
	$id = $_POST['id'];
	
	mysqli_query($con,"DELETE FROM mbira_explorations WHERE id='$id'");
}

//Update location
function updateRow($con){
	$projectId = $_POST['projectId'];
	$name = $_POST['name'];
	$desc = $_POST['description'];
	$dir = $_POST['direction'];
	// $toggle_dig_deeper = $_POST['toggle_dig_deeper'];
	// $toggle_media = $_POST['toggle_media'];
	// $toggle_comments = $_POST['toggle_comments'];
	
	mysqli_query($con,"UPDATE mbira_locations SET name='$name', description='$desc', dig_deeper='$dig_deeper', toggle_comments='$toggle_comments', toggle_dig_deeper='$toggle_dig_deeper', 
		latitude='$lat', longitude='$lon', toggle_media='$toggle_media' WHERE project_id='$projectId'");
}

//Add new exploration
function createRow($con) {
	$projectId = $_POST['projectId'];
	$pid = $_POST['pid'];
	$name = $_POST['name'];
	$desc = $_POST['description'];
	$dir = $_POST['direction'];
	
	//Save image
	$uploaddir = '../images/';
	
	//Use default image if no file provided
	if(isset($_FILES['file']['name'])){
		$uploadfile = $uploaddir . basename($_FILES['file']['name']);	
		move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);
		$path = $_FILES['file']['name'];
	}else{
		$path = 'Default.png';
	}
	
	//Create row in mbira_explorations
	mysqli_query($con,"INSERT INTO mbira_explorations (project_id, pid, name, description, direction, file_path) VALUES ('$projectId', '$pid', '$name', '$desc', '$dir', '$path')");
	
	$idQuery = mysqli_query($con, "SELECT id FROM mbira_explorations WHERE direction = '".$dir."'");
	$IDrow = mysqli_fetch_array($idQuery);
	$eid = $IDrow['id'];	
	
	//Create row in mbira_map_locexpl
	$locids = explode(",", $dir);
	foreach ($locids as $loc) {
		mysqli_query($con,"INSERT INTO `mbira_map_locexpl` (locationid, explorationid) VALUES ('".$loc."', '".$eid."')");
	}
	
	//Create and ingest exploration record to kora
	// $result = mysqli_query($con, "SELECT * FROM scheme WHERE schemeName = 'Exploration' AND pid = " . $pid);
	
	// while($row = mysqli_fetch_array($result)) {
		// $sid = $row['schemeid'];
	// }
	
	// $xml = Array();
	// $xml["Name"] = $name;
	// $xml["Description"] = $desc;
	// $xml["Direction"] = $dir;
	
	// "<Record>
	// <id>'$rid'</id> 
	// <Name>'$name'</Name> 
	// <Description>'$desc'</Description> 
	// <Longitude>'$lat'</Longitude> 
	// <Latitude>'$lon'</Latitude> 
	// </Record>"

	// $record = new Record($pid, $sid);
	// $record -> ingest($xml);
}


if($_POST['task'] == 'create'){
	createRow($con);
}else if($_POST['task'] == 'update'){
	updateRow($con);
}else if($_POST['task'] == 'delete'){
	deleteRow($con);
}

mysqli_close($con);
?>