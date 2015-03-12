<?php
require_once('../../pluginsConfig.php');
require_once(basePathPlugin.'includes/includes.php');

$con=mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

// Check connection
if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

//Delete exhibit
function deleteRow($con){
	$id = $_POST['id'];
	
	//Get media to delete
	$mediaResult = mysqli_query($con, "SELECT thumb_path FROM mbira_exhibits WHERE exploration_id = '$id'");
	
	while($mediaRow = mysqli_fetch_array($mediaResult)) {
		unlink('../images/' .$mediaRow['file_path']);
	}
	mysqli_query($con,"DELETE FROM mbira_locations_has_mbira_exhibits WHERE explorationid='$id'");
	mysqli_query($con,"DELETE FROM mbira_areas_has_mbira_exhibits WHERE exploration_id='$id'");
	mysqli_query($con,"DELETE FROM mbira_exhibits WHERE id='$id'");
}

//Update exploration
function updateRow($con){
	$exhid = $_POST['exhid'];
	$name = mysqli_real_escape_string($con, $_POST['name']);
	$desc = mysqli_real_escape_string($con, $_POST['description']);
	$dir = mysqli_real_escape_string($con, $_POST['direction']);
	$toggle_media = $_POST['toggle_media'];
	$toggle_comments = $_POST['toggle_comments'];
	
	mysqli_query($con,"UPDATE mbira_explorations SET name='$name', description='$desc', toggle_comments='$toggle_comments', toggle_media='$toggle_media', direction='$dir' WHERE id='$eid'");
}

//Add new exploration
function createRow($con) {
	$projectId = $_POST['projectId'];
	$pid = $_POST['pid'];
	$name = mysqli_real_escape_string($con, $_POST['name']);
	$desc = mysqli_real_escape_string($con, $_POST['description']);
	$dir = json_decode($_POST['exhibitPoints']);
		
	//Save image
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
	
	//Create row in mbira_explorations
	mysqli_query($con,"INSERT INTO mbira_exhibits (project_id, pid, name, description, thumb_path) VALUES ('$projectId', '$pid', '$name', '$desc', '$path')");
	
	$idQuery = mysqli_query($con, "SELECT id FROM mbira_explorations WHERE description = '".$desc."'");
	$IDrow = mysqli_fetch_array($idQuery);
	$id = $IDrow['id'];	
	
	//Link areas and locations to exhibit
	foreach ($dir as $point) {
		if (strpos($point,'L') !== false) {
			$point = str_replace('L', "", $point);
			mysqli_query($con,"INSERT INTO mbira_locations_has_mbira_exhibits (mbira_locations_id, mbira_exhibits_id) VALUES ('$point', '$id')");
		}
		if (strpos($point,'A') !== false) {
			$point = str_replace('A', "", $point);
			mysqli_query($con,"INSERT INTO mbira_areas_has_mbira_exhibits (mbira_locations_id, mbira_exhibits_id) VALUES ('$point', '$id')");
		}
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