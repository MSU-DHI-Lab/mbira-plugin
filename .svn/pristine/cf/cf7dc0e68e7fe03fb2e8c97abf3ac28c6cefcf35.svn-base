<?php
require_once('../../pluginsConfig.php');
require_once(basePathPlugin.'includes/includes.php');

$con=mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

// Check connection
if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

//Delete area
function deleteRow($con){
	$id = $_POST['id'];
	
	mysqli_query($con,"DELETE FROM mbira_locations WHERE id='$id'");
}

//Update area
function updateRow($con){
	$projectId = $_POST['projectId'];
	$name = $_POST['name'];
	$desc = $_POST['description'];
	$dig_deeper = $_POST['dig_deeper'];
	$lat = $_POST['latitude'];
	$lon = $_POST['longitude'];
	$toggle_dig_deeper = $_POST['toggle_dig_deeper'];
	$toggle_media = $_POST['toggle_media'];
	$toggle_comments = $_POST['toggle_comments'];
	
	mysqli_query($con,"UPDATE mbira_locations SET name='$name', description='$desc', dig_deeper='$dig_deeper', toggle_comments='$toggle_comments', toggle_dig_deeper='$toggle_dig_deeper', 
		latitude='$lat', longitude='$lon', toggle_media='$toggle_media' WHERE project_id='$projectId'");
}

//Add new area
function createRow($con) {
	$projectId = $_POST['projectId'];
	$name = $_POST['name'];
	$desc = $_POST['description'];
	$coords = $_POST['coordinates'];
	$radius = $_POST['radius'];
	$shape = $_POST['shape'];
	
	//Save image
	$uploaddir = '../images/';
	$uploadfile = $uploaddir . basename($_FILES['file']['name']);
	
	move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);
	$path = $_FILES['file']['name'];
	
	//Create row in mbira_areas
	mysqli_query($con,"INSERT INTO mbira_areas (project_id, name, description, coordinates, radius, shape, file_path) VALUES ('$projectId', '$name', '$desc', '$coords', '$radius', '$shape', '$path')");
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