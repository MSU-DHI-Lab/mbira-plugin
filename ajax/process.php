<?php

function createRow() {
	$title = $_POST['name'];
	$desc = $_POST['description'];
	
	$con=mysqli_connect("rush.matrix.msu.edu", "jacob", "wrazap3u", "jacob_dev");
	// Check connection
	if (mysqli_connect_errno()) {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}

	//mysqli_query($con,"Truncate table testPlugin");
	
	mysqli_query($con,"INSERT INTO testPlugin (TITLE, DESCRIPTION) VALUES ('$title', '$desc')");
		
	$result = mysqli_query($con, "SELECT * FROM testPlugin ORDER BY ID DESC LIMIT 1;");
	
	while($row = mysqli_fetch_array($result)) {
	 echo $row['ID'];
	}
}

function uploadFile() {
	$id = $_POST['id'];
	$uploaddir = 'images/';
	$uploadfile = $uploaddir . basename($_FILES['file']['name']);
	
	$con=mysqli_connect("rush.matrix.msu.edu", "jacob", "wrazap3u", "jacob_dev");
	
	if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {
	
		mysqli_query($con,"UPDATE testPlugin
			SET FILE_PATH='$uploadfile'
			WHERE id=$id;");
		
		mysqli_close($con);
	}
}

if(isset($_POST['name'])){
	createRow();
}else{
	uploadFile();
}
?>