<?php
	require_once('../../pluginsConfig.php');
	$con=mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);
	// Check connection
	if (mysqli_connect_errno()) {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}

	$id = $_POST['id'];
	$type = $_POST['type'];
	if ($type == 'loc'){
		$typeID = 'location_id';
	} else if ($type == 'exp'){
		$typeID = 'exploration_id';
	}	else if ($type == 'area'){
		$typeID = 'area_id';
	} 
	
	$name = explode('.', basename($_FILES['file']['name']));

	$uploaddir = '../images/';
	$uploadfile = $uploaddir . $name[0].time().'.'.$name[count($name)-1];
	echo $uploadfile;	
	move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);
	$path = $name[0].time().'.'.$name[count($name)-1];

	mysqli_query($con,"INSERT INTO mbira_".$type."_media (".$typeID.", file_path, isThumb) VALUES ('$id', '$path', 'no')");

	mysqli_close($con);
?>