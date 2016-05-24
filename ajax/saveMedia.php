<?php
	require_once('../../pluginsConfig.php');
	$con=mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);
	// Check connection
	if (mysqli_connect_errno()) {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}

	$id = $_POST['id'];
	$project_id = $_POST['project'];
	$type = $_POST['type'];
	if ($type == 'loc'){
		$typeID = 'location_id';
		$folder = 'locations';
	} else if ($type == 'exp'){
		$typeID = 'exploration_id';
		$folder = 'explorations';
	}	else if ($type == 'area'){
		$typeID = 'area_id';
		$folder = 'areas';
	} 
	
	$name = explode('.', basename($_FILES['file']['name']));

	$uploaddir = '../media/images/project'.$project_id.'/'.$folder.'/'.$id.'/';

	$uniqid = uniqid();
	$uploadfile = $uploaddir .$uniqid.'.'.$name[count($name)-1];
	move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);
	$path = 'media/images/project'.$project_id.'/'.$folder.'/'.$id.'/'.$uniqid.'.'.$name[count($name)-1];

	mysqli_query($con,"INSERT INTO mbira_".$type."_media (".$typeID.", file_path, isThumb) VALUES ('$id', '$path', 'no')");

	mysqli_close($con);
?>