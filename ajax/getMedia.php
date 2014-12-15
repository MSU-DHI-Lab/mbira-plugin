<?php
require_once('../../pluginsConfig.php');
$con=mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);
// Check connection
if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$location_id = $_POST['location_id'];

$results = mysqli_query($con,"SELECT * FROM mbira_media WHERE location_id = '$location_id'");

$resultsArray = Array();
while($row = mysqli_fetch_array($results)) {
	array_push($resultsArray, $row);
}
echo json_encode($resultsArray);

mysqli_close($con);
?>