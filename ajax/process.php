<?php

function createRow() {
	$title = $_POST['name'];
	$desc = $_POST['description'];
	
	$con=mysqli_connect("rush.matrix.msu.edu", "jacob", "wrazap3u", "jacob_dev");
	// Check connection
	if (mysqli_connect_errno()) {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}
	
	mysqli_query($con,"INSERT INTO MBIRA (NAME, DESCRIPTION) VALUES ('$title', '$desc')");
		
	$result = mysqli_query($con, "SELECT * FROM MBIRA ORDER BY ID DESC LIMIT 1;");
	
	while($row = mysqli_fetch_array($result)) {
	 echo $row['ID'];
	}
}

function uploadFile() {
	$id = $_POST['id'];
	$uploaddir = '../images/';
	$uploadfile = $uploaddir . basename($_FILES['file']['name']);
	
	$con=mysqli_connect("rush.matrix.msu.edu", "jacob", "wrazap3u", "jacob_dev");
	
	if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {
		$path = $_FILES['file']['name'];
		mysqli_query($con,"UPDATE MBIRA
			SET IMAGE_PATH='$path'
			WHERE ID=$id;");
		
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