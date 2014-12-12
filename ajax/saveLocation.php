<?php


function createRow() {
	require_once('../../pluginsConfig.php');
	$projectId = $_POST['projectId'];
	$name = $_POST['name'];
	$desc = $_POST['description'];
	$lat = $_POST['lat'];
	$lon = $_POST['lon'];
	
	$con=mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);
	// Check connection
	if (mysqli_connect_errno()) {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}
	
	mysqli_query($con,"INSERT INTO mbira_locations (project_id, name, description, latitude, longitude) VALUES ('$projectId', '$name', '$desc', '$lat', '$lon')");
		
	$result = mysqli_query($con, "SELECT * FROM mbira_locations ORDER BY id DESC LIMIT 1;");
	
	while($row = mysqli_fetch_array($result)) {
	 echo $row['id'];
	 //var_dump($row);
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
	
	//$result = mysqli_query($con, "SHOW COLUMNS FROM mbira_locations");
	//mysqli_query($con, "ALTER TABLE mbira_locations ADD file_path VARCHAR(500)");
	//while($row = mysqli_fetch_array($result)) {
	// var_dump($row) ;
	 //var_dump($row);
	//}
	$sql = "UPDATE mbira_locations SET file_path='".$path."' WHERE id=".$id;
	
	if (mysqli_query($con, $sql)) {
		echo "Record updated successfully";
	} else {
		echo "Error updating record: " . mysqli_error($con);
	}
	
	mysqli_close($con);
}


if(isset($_POST['name'])){
	createRow();
}else{
	uploadFile();
}
?>