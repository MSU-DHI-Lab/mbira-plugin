<?php
require_once('../../pluginsConfig.php');
require_once(basePathPlugin.'includes/includes.php');

$con=mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

// Check connection
if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$expert = $_POST["isExpert"];
$user = $_POST["id"];
$proj = $_POST["project"];

//Create row in mbira_projects_has_mbira_users
mysqli_query($con,"INSERT INTO mbira_projects_has_mbira_users (mbira_users_id, isExpert, mbira_projects_id) VALUES ('$user', '$expert', '$proj')");

mysqli_close($con);
?>