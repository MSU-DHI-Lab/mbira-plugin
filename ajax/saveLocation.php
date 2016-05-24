<?php
require_once('../../pluginsConfig.php');
require_once(basePathPlugin.'includes/includes.php');
require_once('../utils/removeFolders.php');

$con=mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

// Check connection
if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

//Delete location
function deleteRow($con){
	$id = $_POST['id'];
	$project_id = $_POST['project'];

	Delete('../media/audio/project'.$project_id.'/locations/'.$id.'/');
	Delete('../media/images/project'.$project_id.'/locations/'.$id.'/');
	Delete('../media/video/project'.$project_id.'/locations/'.$id.'/');
	

	mysqli_query($con,"DELETE FROM mbira_map_locexpl WHERE locationid='$id'");
	mysqli_query($con,"DELETE FROM mbira_loc_media WHERE location_id='$id'");
	mysqli_query($con,"DELETE FROM mbira_locations WHERE id='$id'");
}

//Update location
function updateRow($con){
	$lid = $_POST['lid'];
	$project_id = $_POST['project'];
	$name = mysqli_real_escape_string($con, $_POST['name']);
	$desc = mysqli_real_escape_string($con, $_POST['description']);
	$short_desc = mysqli_real_escape_string($con, $_POST['shortDescription']);
	$dig_deeper = mysqli_real_escape_string($con, $_POST['dig_deeper']);
	$lat = $_POST['latitude'];
	$lon = $_POST['longitude'];
	$toggle_dig_deeper = $_POST['toggle_dig_deeper'];
	$toggle_media = $_POST['toggle_media'];
	$toggle_comments = $_POST['toggle_comments'];
	
	mysqli_query($con,"UPDATE mbira_locations SET name='$name', description='$desc', short_description='$short_desc', dig_deeper='$dig_deeper', toggle_comments='$toggle_comments', toggle_dig_deeper='$toggle_dig_deeper', 
		latitude='$lat', longitude='$lon', toggle_media='$toggle_media' WHERE id='$lid'");
		
	if (isset($_FILES['file'])) {
		//Save image
		$uploaddir = '../media/images/project'.$project_id.'/locations/'.$id.'/';
		
		//Use default image if no file provided
		if(isset($_FILES['file']['name'])){
			$filename = explode('.', basename($_FILES['file']['name']));

			$uniqid = uniqid();
			$uploadfile = $uploaddir .$uniqid.'.'.$filename[count($filename)-1];
			move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);
			$path = 'media/images/project'.$project_id.'/locations/'.$id.'/'.$uniqid.'.'.$filename[count($filename)-1];
			
			mysqli_query($con, "UPDATE mbira_loc_media SET isThumb='no' WHERE location_id='$lid' AND isThumb='yes'");
			mysqli_query($con, "UPDATE mbira_locations SET thumb_path='$path' WHERE id='$lid'");
			mysqli_query($con,"INSERT INTO mbira_loc_media (location_id, file_path, isThumb) VALUES ('$lid', '$path', 'yes')");
			mysqli_query($con,"DELETE FROM mbira_loc_media WHERE location_id='$lid' AND file_path='img/Default.png'");
		}
	}
}

//Add new location
function createRow($con) {
	$projectId = $_POST['projectId'];
	$pid = $_POST['pid'];
	$name = mysqli_real_escape_string($con, $_POST['name']);
	$desc = mysqli_real_escape_string($con, $_POST['description']);
	$short_desc = mysqli_real_escape_string($con, $_POST['shortDescription']);
	$dig_deeper = mysqli_real_escape_string($con, $_POST['dig_deeper']);
	$lat = $_POST['lat'];
	$lon = $_POST['lon'];
	$toggle_dig_deeper = $_POST['toggle_dig_deeper'];
	$toggle_media = $_POST['toggle_media'];
	$toggle_comments = $_POST['toggle_comments'];
	
	//Create row in mbira_locations
	$my = mysqli_query($con,"INSERT INTO mbira_locations (project_id, pid, name, description, short_description, dig_deeper, latitude, longitude, toggle_comments, toggle_dig_deeper, toggle_media) VALUES ('$projectId', '$pid', '$name', '$desc', '$short_desc', '$dig_deeper', '$lat', '$lon', '$toggle_comments', '$toggle_dig_deeper', '$toggle_media')");

	//Get location ID
	$locResult = mysqli_query($con, "SELECT id FROM mbira_locations WHERE latitude = '$lat' AND longitude = " . $lon);
	
	while($locRow = mysqli_fetch_array($locResult)) {
		$lid = $locRow['id'];
	}
	echo $lid;

	//Save image
	$uploaddir = '../media/images/project'.$projectId.'/locations/'.$lid.'/';
	
	if (!file_exists($uploaddir)) {
	    mkdir($uploaddir, 0775, true);
	}

	//Use default image if no file provided
	if(isset($_FILES['file']['name'])){
		$filename = explode('.', basename($_FILES['file']['name']));

		$uniqid = uniqid();
		$uploadfile = $uploaddir .$uniqid.'.'.$filename[count($filename)-1];
		move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);
		$path = 'media/images/project'.$projectId.'/locations/'.$lid.'/'.$uniqid.'.'.$filename[count($filename)-1];
	}else{
		$path = 'img/Default.png';
	}
	

	//Add path to location's row
	$sql = "UPDATE mbira_locations SET thumb_path='".$path."' WHERE id=".$lid;
	mysqli_query($con, $sql);

	//Create row in mbira_loc_media
	mysqli_query($con,"INSERT INTO mbira_loc_media (location_id, file_path, isThumb) VALUES ('$lid', '$path', 'yes')");
	
	//Create and ingest location record to kora
	$result = mysqli_query($con, "SELECT * FROM scheme WHERE schemeName = 'Location' AND pid = " . $pid);
	
	while($row = mysqli_fetch_array($result)) {
		$sid = $row['schemeid'];
	}
	
	$xml = Array();
	$xml["Name"] = $name;
	$xml["Description"] = $desc;
	$xml["Longitude"] = $lon;
	$xml["Latitude"] = $lat;
	
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
	$uploaddir = '../media/images/project'.$project_id.'/locations/'.$id.'/';

	
	//Use default image if no file provided
	if(isset($_FILES['file']['name'])){
		$mediaResult = mysqli_query($con, "SELECT header_image_path FROM mbira_locations WHERE id = '$id'");
		
		while($mediaRow = mysqli_fetch_array($mediaResult)) {
			unlink('../' .$mediaRow['header_image_path']);
		}

		$filename = explode('.', basename($_FILES['file']['name']));
		
		$uniqid = uniqid();
		$uploadfile = $uploaddir .$uniqid.'.'.$filename[count($filename)-1];
		move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);
		$path = 'media/images/project'.$project_id.'/locations/'.$id.'/'.$uniqid.'.'.$filename[count($filename)-1];

		mysqli_query($con,"DELETE FROM mbira_loc_media WHERE location_id='$id' AND file_path='img/Default-Header.png'");
	}else{
		$path = 'img/Default-Header.png';
	}

	mysqli_query($con,"UPDATE mbira_locations SET header_image_path='$path' WHERE id='$id'");
	mysqli_query($con,"INSERT INTO mbira_loc_media (location_id, file_path, isHeader) VALUES ('$lid', '$path', 'yes')");	
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