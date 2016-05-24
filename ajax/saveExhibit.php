<?php
require_once('../../pluginsConfig.php');
require_once(basePathPlugin.'includes/includes.php');
require_once('../utils/removeFolders.php');

$con=mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

// Check connection
if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

//Delete exhibit
function deleteRow($con){
	$id = $_POST['id'];
	$project_id = $_POST['project'];
	
	Delete('../media/images/project'.$project_id.'/exhibits/'.$id.'/');

	mysqli_query($con,"DELETE FROM mbira_locations_has_mbira_exhibits WHERE mbira_exhibits_id='$id'");
	mysqli_query($con,"DELETE FROM mbira_areas_has_mbira_exhibits WHERE mbira_exhibits_id='$id'");
	mysqli_query($con,"DELETE FROM mbira_exhibits WHERE id='$id'");
}

//Update exhibit
function updateRow($con){
	$id = $_POST['id'];
	$project_id = $_POST['project'];
	$name = mysqli_real_escape_string($con, $_POST['name']);
	$desc = mysqli_real_escape_string($con, $_POST['description']);
	$path = $_POST['path'];
	
	//Save image
	$uploaddir = '../media/images/project'.$project_id.'/exhibits/'.$id.'/';

	//Use default image if no file provided
	if(isset($_FILES['file']['name'])){
		$mediaResult = mysqli_query($con, "SELECT thumb_path FROM mbira_exhibits WHERE id = '$id'");
		
		while($mediaRow = mysqli_fetch_array($mediaResult)) {
			unlink('../' .$mediaRow['thumb_path']);
		}
		$filename = explode('.', basename($_FILES['file']['name']));

		$uniqid = uniqid();
		$uploadfile = $uploaddir .$uniqid.'.'.$filename[count($filename)-1];
		move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);
		$path = 'media/images/project'.$project_id.'/exhibits/'.$id.'/'.$uniqid.'.'.$filename[count($filename)-1];
	}
	
	mysqli_query($con,"UPDATE mbira_exhibits SET name='$name', description='$desc', thumb_path='$path' WHERE id='$id'");
}

//Add new exhibit
function createRow($con) {
	$projectId = $_POST['projectId'];
	$pid = $_POST['pid'];
	$name = mysqli_real_escape_string($con, $_POST['name']);
	$desc = mysqli_real_escape_string($con, $_POST['description']);
		
	//Create row in mbira_explorations
	mysqli_query($con,"INSERT INTO mbira_exhibits (project_id, pid, name, description) VALUES ('$projectId', '$pid', '$name', '$desc')");
	
	$idQuery = mysqli_query($con, "SELECT id FROM mbira_exhibits WHERE description = '".$desc."'");
	$IDrow = mysqli_fetch_array($idQuery);
	$id = $IDrow['id'];	

	//Save image
	$uploaddir = '../media/images/project'.$projectId.'/exhibits/'.$id.'/';

	if (!file_exists($uploaddir)) {
	    mkdir($uploaddir, 0775, true);
	}

	//Use default image if no file provided
	if(isset($_FILES['file']['name'])){
		$filename = explode('.', basename($_FILES['file']['name']));

		$uniqid = uniqid();
		$uploadfile = $uploaddir .$uniqid.'.'.$filename[count($filename)-1];
		move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);
		$path = 'media/images/project'.$projectId.'/exhibits/'.$id.'/'.$uniqid.'.'.$filename[count($filename)-1];
	}else{
		$path = 'img/Default.png';
	}

	//Add path to exhibit's row
	$sql = "UPDATE mbira_exhibits SET thumb_path='".$path."' WHERE id=".$id;
	mysqli_query($con, $sql);
	
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
	echo $id;
}

function uploadHeader($con) {
	$id = $_POST['id'];
	$project_id = $_POST['project'];
	$uploaddir = '../media/images/project'.$project_id.'/exhibits/'.$id.'/';

	
	//Use default image if no file provided
	if(isset($_FILES['file']['name'])){
		$mediaResult = mysqli_query($con, "SELECT header_image_path FROM mbira_exhibits WHERE id = '$id'");
		
		while($mediaRow = mysqli_fetch_array($mediaResult)) {
			unlink('../' .$mediaRow['header_image_path']);
		}

		$filename = explode('.', basename($_FILES['file']['name']));

		$uniqid = uniqid();
		$uploadfile = $uploaddir .$uniqid.'.'.$filename[count($filename)-1];
		move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);
		$path = 'media/images/project'.$project_id.'/exhibits/'.$id.'/'.$uniqid.'.'.$filename[count($filename)-1];
	}else{
		$path = 'img/Default-Header.png';
	}
	mysqli_query($con,"UPDATE mbira_exhibits SET header_image_path='$path' WHERE id='$id'");
}


if ($_POST['task'] == 'create'){
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