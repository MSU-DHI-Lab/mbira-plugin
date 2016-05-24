<?php
require_once('../../pluginsConfig.php');
require_once(basePathPlugin.'includes/includes.php');
require_once('../utils/removeFolders.php');

$con=mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

// Check connection
if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

//Delete exploration
function deleteRow($con){
	$id = $_POST['id'];
	$project_id = $_POST['project'];
	
	Delete('../media/images/project'.$project_id.'/explorations/'.$id.'/');
	
	mysqli_query($con,"DELETE FROM mbira_map_locexpl WHERE explorationid='$id'");
	mysqli_query($con,"DELETE FROM mbira_exp_media WHERE exploration_id='$id'");
	mysqli_query($con,"DELETE FROM mbira_explorations WHERE id='$id'");
}

//Update exploration
function updateRow($con){
	$eid = $_POST['eid'];
	$project_id = $_POST['project'];
	$name = mysqli_real_escape_string($con, $_POST['name']);
	$desc = mysqli_real_escape_string($con, $_POST['description']);
	$dir = mysqli_real_escape_string($con, $_POST['direction']);
	$toggle_comments = $_POST['toggle_comments'];
	
	mysqli_query($con,"UPDATE mbira_explorations SET name='$name', description='$desc', toggle_comments='$toggle_comments', direction='$dir' WHERE id='$eid'");
	
	//Save image
	$uploaddir = '../media/images/project'.$project_id.'/explorations/'.$eid.'/';
	
	//Use default image if no file provided
	if(isset($_FILES['file']['name'])){
		$mediaResult = mysqli_query($con, "SELECT thumb_path FROM mbira_explorations WHERE id = '$eid'");
		
		while($mediaRow = mysqli_fetch_array($mediaResult)) {
			unlink('../' .$mediaRow['thumb_path']);
		}

		$filename = explode('.', basename($_FILES['file']['name']));

		$uniqid = uniqid();
		$uploadfile = $uploaddir .$uniqid.'.'.$filename[count($filename)-1];
		move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);
		$path = 'media/images/project'.$project_id.'/explorations/'.$eid.'/'.$uniqid.'.'.$filename[count($filename)-1];
		
		mysqli_query($con, "UPDATE mbira_explorations SET thumb_path='$path' WHERE id='$eid'");
	}
}

//Add new exploration
function createRow($con) {
	$projectId = $_POST['projectId'];
	$pid = $_POST['pid'];
	$name = mysqli_real_escape_string($con, $_POST['name']);
	$desc = mysqli_real_escape_string($con, $_POST['description']);
	$dir = $_POST['direction'];
	$toggle_comments = $_POST['toggle_comments'];
	
	//Create row in mbira_explorations
	mysqli_query($con,"INSERT INTO mbira_explorations (project_id, pid, name, description, direction, toggle_comments) VALUES ('$projectId', '$pid', '$name', '$desc', '$dir', '$toggle_comments')");
	
	$idQuery = mysqli_query($con, "SELECT id FROM mbira_explorations WHERE direction = '".$dir."'");
	$IDrow = mysqli_fetch_array($idQuery);
	$eid = $IDrow['id'];	
	
	//Save image
	$uploaddir = '../media/images/project'.$projectId.'/explorations/'.$eid.'/';

	if (!file_exists($uploaddir)) {
	    mkdir($uploaddir, 0775, true);
	}
	
	//Use default image if no file provided
	if(isset($_FILES['file']['name'])){
		$filename = explode('.', basename($_FILES['file']['name']));

		$uniqid = uniqid();
		$uploadfile = $uploaddir .$uniqid.'.'.$filename[count($filename)-1];
		move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);
		$path = 'media/images/project'.$projectId.'/explorations/'.$eid.'/'.$uniqid.'.'.$filename[count($filename)-1];
	}else{
		$path = 'img/Default.png';
	}

	//Add path to exploration's row
	$sql = "UPDATE mbira_explorations SET thumb_path='".$path."' WHERE id=".$eid;
	mysqli_query($con, $sql);

	//Create row in mbira_map_locexpl
	$alids = explode(",", $dir);
	foreach ($alids as $arealoc) {
		if (strpos($arealoc,'A') !== false) {
			$arealoc = str_replace('A',"",$arealoc);
			mysqli_query($con,"INSERT INTO `mbira_explorations_has_mbira_areas` (mbira_areas_id, mbira_explorations_id) VALUES ('".$arealoc."', '".$eid."')");
		}else{
			mysqli_query($con,"INSERT INTO `mbira_map_locexpl` (locationid, explorationid) VALUES ('".$arealoc."', '".$eid."')");
		}
	}
	
	//Create row in mbira_exp_media
	mysqli_query($con,"INSERT INTO mbira_exp_media (exploration_id, file_path, isThumb) VALUES ('$eid', '$path', 'yes')");	
	
	echo $eid;
	
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

function uploadHeader($con) {
	$id = $_POST['id'];
	$project_id = $_POST['project'];
	$uploaddir = '../media/images/project'.$project_id.'/explorations/'.$id.'/';

	
	//Use default image if no file provided
	if(isset($_FILES['file']['name'])){
		$mediaResult = mysqli_query($con, "SELECT header_image_path FROM mbira_explorations WHERE id = '$id'");
		
		while($mediaRow = mysqli_fetch_array($mediaResult)) {
			unlink('../' .$mediaRow['header_image_path']);
		}

		$filename = explode('.', basename($_FILES['file']['name']));

		$uniqid = uniqid();
		$uploadfile = $uploaddir .$uniqid.'.'.$filename[count($filename)-1];
		move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);
		$path = 'media/images/project'.$project_id.'/explorations/'.$id.'/'.$uniqid.'.'.$filename[count($filename)-1];
	}else{
		$path = 'img/Default-Header.png';
	}
	mysqli_query($con,"UPDATE mbira_explorations SET header_image_path='$path' WHERE id='$id'");
}


if($_POST['task'] == 'create'){
	createRow($con);
} else if($_POST['task'] == 'update'){
	updateRow($con);
} else if($_POST['task'] == 'delete'){
	deleteRow($con);
} else if($_POST['task'] == 'uploadHeader'){
	uploadHeader($con);
}

mysqli_close($con);
?>