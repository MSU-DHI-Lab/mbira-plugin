<?php

function createRow() {
	$title = $_POST['name'];
	$desc = $_POST['description'];
	
	$con=mysqli_connect("rush.matrix.msu.edu", "jacob", "wrazap3u", "jacob_dev");
	// Check connection
	if (mysqli_connect_errno()) {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}
	
	mysqli_query($con,"INSERT INTO mbira_projects (name, description) VALUES ('$title', '$desc')");
		
	$result = mysqli_query($con, "SELECT * FROM mbira_projects ORDER BY id DESC LIMIT 1;");
	
	while($row = mysqli_fetch_array($result)) {
	 echo $row['id'];
	}
}

function uploadFile() {
	$id = $_POST['id'];
	$uploaddir = '../images/';
	$uploadfile = $uploaddir . basename($_FILES['file']['name']);
	
	$con=mysqli_connect("rush.matrix.msu.edu", "jacob", "wrazap3u", "jacob_dev");
	
	if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {
		$path = $_FILES['file']['name'];
		mysqli_query($con,"UPDATE mbira_projects
			SET image_path='$path'
			WHERE id=$id;");
		
		echo "images/".$path;
		
		mysqli_close($con);
	}
}

if(isset($_POST['name'])){
	createRow();
}else{
	uploadFile();
}
?>