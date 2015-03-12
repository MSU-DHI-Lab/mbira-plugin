<?php
require_once('../../pluginsConfig.php');
$con=mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);
// Check connection
if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$locationId = $_POST['location_id'];

$uploaddir = 'mediaFiles/';
$uploadfile = $uploaddir . basename($_FILES['file']['name']);

move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);
$path = $_FILES['file']['name'];

mysqli_query($con,"INSERT INTO mbira_media (location_id, file_path) VALUES ('$locationId', '$uploadfile')");

mysqli_close($con);
?>