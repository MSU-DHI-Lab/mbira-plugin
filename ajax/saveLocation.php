<?php
require_once('../../pluginsConfig.php');
$con=mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);
// Check connection
if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

function deleteRow($con){
	$id = $_POST['id'];
	
	mysqli_query($con,"DELETE FROM mbira_locations WHERE id='$id'");
}

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

function createRow($con) {
	$projectId = $_POST['projectId'];
	$name = $_POST['name'];
	$desc = $_POST['description'];
	$lat = $_POST['lat'];
	$lon = $_POST['lon'];
	
	mysqli_query($con,"INSERT INTO mbira_locations (project_id, name, description, latitude, longitude) VALUES ('$projectId', '$name', '$desc', '$lat', '$lon')");
		
	$result = mysqli_query($con, "SELECT * FROM mbira_locations ORDER BY id DESC LIMIT 1;");
	
	while($row = mysqli_fetch_array($result)) {
	 echo $row['id'];
	 //var_dump($row);
	}
}

function uploadFile($con) {	
	$id = $_POST['id'];

	$uploaddir = '../images/';
	$uploadfile = $uploaddir . basename($_FILES['file']['name']);
	
	move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);
	$path = $_FILES['file']['name'];
	
	$sql = "UPDATE mbira_locations SET file_path='".$path."' WHERE id=".$id;
	
	if (mysqli_query($con, $sql)) {
		echo "Record updated successfully";
	} else {
		echo "Error updating record: " . mysqli_error($con);
	}
}

if($_POST['task'] == 'create'){
	createRow($con);
}else if($_POST['task'] == 'update'){
	updateRow($con);
}else if($_POST['task'] == 'delete'){
	deleteRow($con);
}else{
	uploadFile($con);
}

mysqli_close($con);
?>