<?php
	require_once("../pluginsInclude.php");
	
	$con=mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);
	
	if (mysqli_connect_errno()) {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}
	
	// sql to create table
	$sql = "CREATE TABLE `$dbname`.`mbira_projects`(
	`id` INTEGER (10) UNSIGNED NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(5000) NOT NULL,
	`description` VARCHAR(5000) NOT NULL,
	`image_path` VARCHAR(300) NOT NULL,
	PRIMARY KEY (`id`)
	)";
	
	if (mysqli_query($con, $sql)) {
		echo "Table mbira_projects created successfully";
	} else {
		echo "Error creating table: " . mysqli_error($con);
	}

	//MORE TABLES!!
	
/* 	if (mysqli_query($con, $sql)) {
		echo "Table mbira_projects created successfully";
	} else {
		echo "Error creating table: " . mysqli_error($con);
	}
	
	$sql = "CREATE TABLE `$dbname`.`mbira_ projects`(
	`id` INTEGER (10) UNSIGNED NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(5000) NOT NULL,
	`description` VARCHAR(5000) NOT NULL,
	`image_path` VARCHAR(300) NOT NULL,
	PRIMARY KEY (`id`)
	)";

	if (mysqli_query($con, $sql)) {
		echo "Table mbira_projects created successfully";
	} else {
		echo "Error creating table: " . mysqli_error($con);
	} */

	mysqli_close($con);
?>