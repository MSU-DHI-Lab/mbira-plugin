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
		echo "Table mbira_projects created successfully<br>";
	} else {
		echo "Error creating table: " . mysqli_error($con);
	}
	
	// sql to create table
	$sql = "CREATE TABLE `$dbname`.`mbira_locations`(
	`id` INTEGER (11) UNSIGNED NOT NULL AUTO_INCREMENT,
	`project_id` INTEGER(11),
	`exhibit_id` INTEGER(11),
	`pid` INTEGER(11),
	`sid` INTEGER(11),
	`name` VARCHAR(200) NOT NULL,
	`description` VARCHAR(10000),	
	`dig_deeper` VARCHAR(10000),	
	`latitude` VARCHAR(100),
	`longitude` VARCHAR(100),
	`file_path` VARCHAR(500),
	`toggle_dig_deeper` VARCHAR(45) NULL DEFAULT 'true',
	`toggle_media` VARCHAR(45) NULL DEFAULT 'true',
	`toggle_comments` VARCHAR(45) NULL DEFAULT 'true',
	PRIMARY KEY (`id`)
	)";
	
	if (mysqli_query($con, $sql)) {
		echo "Table mbira_locations created successfully<br>";
	} else {
		echo "Error creating table: " . mysqli_error($con);
	}
	
	// sql to create table
	$sql = "CREATE TABLE `$dbname`.`mbira_media`(
	`id` INTEGER (11) UNSIGNED NOT NULL AUTO_INCREMENT,
	`location_id` INTEGER(11),
	`file_path` VARCHAR(500),
	PRIMARY KEY (`id`)
	)";
	
	if (mysqli_query($con, $sql)) {
		echo "Table mbira_media created successfully<br>";
	} else {
		echo "Error creating table: " . mysqli_error($con);
	}
	
	$sql = "CREATE TABLE `$dbname`.`mbira_areas` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`project_id` INT NULL,
	`exhibit_id` INT NULL,
	`name` VARCHAR(500) NULL,
	`description` VARCHAR(10000) NULL,
	`coordinates` VARCHAR(1000) NULL,
	`shape` VARCHAR(45) NULL,
	PRIMARY KEY (`id`))";
	
	if (mysqli_query($con, $sql)) {
		echo "Table mbira_ares created successfully<br>";
	} else {
		echo "Error creating table: " . mysqli_error($con);
	}

	mysqli_close($con);
?>