<?php
	require_once("../pluginsInclude.php");
	
	$con=mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);
	
	if (mysqli_connect_errno()) {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}
	
	// sql to create table
	$sql = "CREATE TABLE `$dbname`.`mbira_projects`(
	`id` INTEGER (10) UNSIGNED NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(5000),
	`description` VARCHAR(5000),
	`image_path` VARCHAR(300),
	PRIMARY KEY (`id`)
	)";
	
	if (mysqli_query($con, $sql)) {
		echo "Table mbira_projects created successfully";
	} else {
		echo "Error creating table: " . mysqli_error($con);
	}
	
	// sql to create table
	$sql = "CREATE TABLE `$dbname`.`mbira_locations`(
	`id` INTEGER (11) UNSIGNED NOT NULL AUTO_INCREMENT,
	`project_id` INTEGER(11),
	`name` VARCHAR(200) NOT NULL,
	`description` VARCHAR(500),
	`exhibit_id` INTEGER(11),
	`latitude` VARCHAR(100),
	`longitude` VARCHAR(100),
	`file_path` VARCHAR(500),
	PRIMARY KEY (`id`)
	)";
	
	if (mysqli_query($con, $sql)) {
		echo "Table mbira_locations created successfully";
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