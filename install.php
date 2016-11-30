<?php
	//require_once("pluginsInclude.php");
	
	$con=mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);
	
// -- -----------------------------------------------------
// -- Table `$dbname`.`mbira_projects`
// -- -----------------------------------------------------
	$sql = "CREATE TABLE IF NOT EXISTS  `$dbname`.`mbira_projects` (
		`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
		`pid` INT(11) NULL DEFAULT NULL,
		`name` VARCHAR(5000) NULL DEFAULT NULL,
		`shortDescription` VARCHAR(150) NULL DEFAULT NULL,
		`description` VARCHAR(5000) NULL DEFAULT NULL,
		`image_path` VARCHAR(1000) NULL DEFAULT NULL,
		`thumb_path` VARCHAR(500) NULL DEFAULT NULL,
		`thumbCanvasData` VARCHAR(500) NULL DEFAULT NULL,
		`thumbCropData` VARCHAR(500) NULL DEFAULT NULL,
		`logo_image_path` VARCHAR(1000) NULL DEFAULT NULL,
		`header_image_path` VARCHAR(1000) NULL DEFAULT NULL,
		PRIMARY KEY (`id`))
		ENGINE = InnoDB
		AUTO_INCREMENT = 1
  		DEFAULT CHARACTER SET utf8
  		DEFAULT COLLATE utf8_unicode_ci";
	mysqli_query($con, $sql);
	

// -- -----------------------------------------------------
// -- Table `$dbname`.`mbira_areas`
// -- -----------------------------------------------------
	$sql = "CREATE TABLE IF NOT EXISTS `$dbname`.`mbira_areas` (
		`id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
		`project_id` INT(11) UNSIGNED NULL,
		`name` VARCHAR(500) NULL DEFAULT NULL,
		`description` VARCHAR(1000) NULL DEFAULT NULL,
		`short_description` VARCHAR(1000) NULL DEFAULT NULL,
		`dig_deeper` VARCHAR(1000) NULL DEFAULT NULL,
		`coordinates` VARCHAR(1000) NULL DEFAULT NULL,
		`geoJSON_path` varchar(500) DEFAULT NULL,
		`radius` VARCHAR(100) NULL DEFAULT NULL,
		`shape` VARCHAR(45) NULL DEFAULT NULL,
		`thumb_path` VARCHAR(500) NULL DEFAULT NULL,
		`header_image_path` VARCHAR(1000) NULL DEFAULT NULL,
		`toggle_dig_deeper` VARCHAR(45) NULL DEFAULT 'true',
		`toggle_media` VARCHAR(45) NULL DEFAULT 'true',
		`toggle_comments` VARCHAR(45) NULL DEFAULT 'true',
		PRIMARY KEY (`id`),
		INDEX `fk_mbira_areas_mbira_projects_idx` (`project_id` ASC),
		CONSTRAINT `fk_mbira_areas_mbira_projects`
		FOREIGN KEY (`project_id`)
		REFERENCES `$dbname`.`mbira_projects` (`id`)
		ON DELETE Cascade
		ON UPDATE NO ACTION)
		ENGINE = InnoDB
  		DEFAULT CHARACTER SET utf8
  		DEFAULT COLLATE utf8_unicode_ci";
	mysqli_query($con, $sql);


// -- -----------------------------------------------------
// -- Table `$dbname`.`mbira_explorations`
// -- -----------------------------------------------------
	$sql = "CREATE TABLE IF NOT EXISTS `$dbname`.`mbira_explorations` (
		`id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
		`project_id` INT(11) UNSIGNED NOT NULL,
		`pid` INT(11) NULL DEFAULT NULL,
		`name` VARCHAR(200) NOT NULL,
		`description` VARCHAR(1000) NULL DEFAULT NULL,
		`direction` VARCHAR(200) NULL DEFAULT NULL,
		`file_path` VARCHAR(500) NULL DEFAULT NULL,
		`thumb_path` VARCHAR(500) NULL DEFAULT NULL,
		`thumbCanvasData` VARCHAR(500) NULL DEFAULT NULL,
		`thumbCropData` VARCHAR(500) NULL DEFAULT NULL,
		`header_image_path` varchar(500) DEFAULT NULL,
		`toggle_comments` varchar(45) DEFAULT 'true',
		PRIMARY KEY (`id`),
		INDEX `FK_project_exploration_idx` (`project_id` ASC),
		CONSTRAINT `FK_project_exploration`
		FOREIGN KEY (`project_id`)
		REFERENCES `$dbname`.`mbira_projects` (`id`)
		ON DELETE Cascade
		ON UPDATE NO ACTION)
		ENGINE = InnoDB
  		DEFAULT CHARACTER SET utf8
  		DEFAULT COLLATE utf8_unicode_ci";
	mysqli_query($con, $sql);

// -- -----------------------------------------------------
// -- Table `$dbname`.`mbira_locations`
// -- -----------------------------------------------------
	$sql = "CREATE TABLE IF NOT EXISTS `$dbname`.`mbira_locations` (
		`id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
		`project_id` INT(11) UNSIGNED NOT NULL ,
		`exhibit_id` INT(11) UNSIGNED NOT NULL,
		`pid` INT(11) NULL DEFAULT NULL,
		`sid` INT(11) NULL DEFAULT NULL,
		`name` VARCHAR(200) NOT NULL,
		`description` VARCHAR(1000) NULL DEFAULT NULL,
		`short_description` VARCHAR(1000) NULL DEFAULT NULL,
		`dig_deeper` VARCHAR(1000) NULL DEFAULT NULL,
		`latitude` VARCHAR(100) NULL DEFAULT NULL,
		`longitude` VARCHAR(100) NULL DEFAULT NULL,
		`thumb_path` VARCHAR(500) NULL DEFAULT NULL,
		`header_image_path` VARCHAR(500) NULL DEFAULT NULL,
		`toggle_dig_deeper` VARCHAR(45) NULL DEFAULT 'true',
		`toggle_media` VARCHAR(45) NULL DEFAULT 'true',
		`toggle_comments` VARCHAR(45) NULL DEFAULT 'true',
		PRIMARY KEY (`id`),
		INDEX `FK_project_location_idx` (`project_id` ASC),
		CONSTRAINT `FK_project_location`
		FOREIGN KEY (`project_id`)
		REFERENCES `$dbname`.`mbira_projects` (`id`)
		ON DELETE Cascade
		ON UPDATE NO ACTION)
		ENGINE = InnoDB
		AUTO_INCREMENT = 1
  		DEFAULT CHARACTER SET utf8
  		DEFAULT COLLATE utf8_unicode_ci";
	mysqli_query($con, $sql);
	

// -- -----------------------------------------------------
// -- Table `$dbname`.`mbira_map_locexpl`
// -- -----------------------------------------------------
	$sql = "CREATE TABLE IF NOT EXISTS `$dbname`.`mbira_map_locexpl` (
		`id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
		`locationid` INT(10) UNSIGNED NOT NULL,
		`explorationid` INT(10) UNSIGNED NOT NULL,
		PRIMARY KEY (`id`),
		INDEX `fk_location_map_idx` (`locationid` ASC),
		INDEX `fk_exploration_map_idx` (`explorationid` ASC),
		CONSTRAINT `fk_location_map`
		FOREIGN KEY (`locationid`)
		REFERENCES `$dbname`.`mbira_locations` (`id`)
		ON DELETE Cascade
		ON UPDATE NO ACTION,
		CONSTRAINT `fk_exploration_map`
		FOREIGN KEY (`explorationid`)
		REFERENCES `$dbname`.`mbira_explorations` (`id`)
		ON DELETE Cascade
		ON UPDATE NO ACTION)
		ENGINE = InnoDB
  		DEFAULT CHARACTER SET utf8
  		DEFAULT COLLATE utf8_unicode_ci";
	mysqli_query($con, $sql);

// -- -----------------------------------------------------
// -- Table `$dbname`.`mbira_loc_media`
// -- -----------------------------------------------------
	$sql = "CREATE TABLE IF NOT EXISTS `$dbname`.`mbira_loc_media` (
		`id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
		`location_id` INT(11) UNSIGNED NOT NULL,
		`title` VARCHAR(500) NULL DEFAULT NULL,
		`alt_desc` VARCHAR(500) NULL DEFAULT NULL,
		`description` VARCHAR(500) NULL DEFAULT NULL,
		`file_path` VARCHAR(500) NULL DEFAULT NULL,
		`thumb_path` VARCHAR(500) NULL DEFAULT NULL,
		`thumbCanvasData` VARCHAR(500) NULL DEFAULT NULL,
		`thumbCropData` VARCHAR(500) NULL DEFAULT NULL,
		`cropped_image_path` VARCHAR(500) NULL DEFAULT NULL,
		`imageCanvasData` VARCHAR(500) NULL DEFAULT NULL,
		`imageCropData` VARCHAR(500) NULL DEFAULT NULL,
		`isThumb` VARCHAR(45) NOT NULL DEFAULT 'NO',
		`isHeader` VARCHAR(45) NOT NULL DEFAULT 'NO',
		`isPending` VARCHAR(45) NULL DEFAULT 'yes',
		PRIMARY KEY (`id`),
		INDEX `fk_mbira_loc_media_mbira_locations1_idx` (`location_id` ASC),
		CONSTRAINT `fk_mbira_loc_media_mbira_locations1`
		FOREIGN KEY (`location_id`)
		REFERENCES `mbira_locations` (`id`)
		ON DELETE Cascade
		ON UPDATE NO ACTION)
		ENGINE = InnoDB
		AUTO_INCREMENT = 1
  		DEFAULT CHARACTER SET utf8
  		DEFAULT COLLATE utf8_unicode_ci";
	mysqli_query($con, $sql);
	
// -- -----------------------------------------------------
// -- Table `$dbname`.`mbira_explorations_has_mbira_areas`
// -- -----------------------------------------------------
	$sql = "CREATE TABLE IF NOT EXISTS `$dbname`.`mbira_explorations_has_mbira_areas` (
		`id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
		`mbira_explorations_id` INT(11) UNSIGNED NOT NULL,
		`mbira_areas_id` INT(11) UNSIGNED NOT NULL,
		INDEX `fk_mbira_explorations_has_mbira_areas_mbira_areas1_idx` (`mbira_areas_id` ASC),
		INDEX `fk_mbira_explorations_has_mbira_areas_mbira_explorations1_idx` (`mbira_explorations_id` ASC),
		PRIMARY KEY (`id`),
		CONSTRAINT `fk_mbira_explorations_has_mbira_areas_mbira_explorations1`
		FOREIGN KEY (`mbira_explorations_id`)
		REFERENCES `$dbname`.`mbira_explorations` (`id`)
		ON DELETE Cascade
		ON UPDATE NO ACTION,
		CONSTRAINT `fk_mbira_explorations_has_mbira_areas_mbira_areas1`
		FOREIGN KEY (`mbira_areas_id`)
		REFERENCES `$dbname`.`mbira_areas` (`id`)
		ON DELETE Cascade
		ON UPDATE NO ACTION)
		ENGINE = InnoDB
  		DEFAULT CHARACTER SET utf8
  		DEFAULT COLLATE utf8_unicode_ci";
	mysqli_query($con, $sql);

// -- -----------------------------------------------------
// -- Table `$dbname`.`mbira_area_media`
// -- -----------------------------------------------------
	$sql = "CREATE TABLE IF NOT EXISTS `$dbname`.`mbira_area_media` (
		`id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
		`area_id` INT(11) UNSIGNED NOT NULL,
		`title` VARCHAR(500) NULL DEFAULT NULL,
		`alt_desc` VARCHAR(500) NULL DEFAULT NULL,
		`description` VARCHAR(500) NULL DEFAULT NULL,
		`file_path` VARCHAR(500) NULL DEFAULT NULL,
		`thumb_path` VARCHAR(500) NULL DEFAULT NULL,
		`thumbCanvasData` VARCHAR(500) NULL DEFAULT NULL,
		`thumbCropData` VARCHAR(500) NULL DEFAULT NULL,
		`cropped_image_path` VARCHAR(500) NULL DEFAULT NULL,
		`imageCanvasData` VARCHAR(500) NULL DEFAULT NULL,
		`imageCropData` VARCHAR(500) NULL DEFAULT NULL,
		`isThumb` VARCHAR(45) NOT NULL DEFAULT 'NO',
		`isHeader` VARCHAR(45) NOT NULL DEFAULT 'NO',
		`isPending` VARCHAR(45) NULL DEFAULT 'yes',
		PRIMARY KEY (`id`),
		INDEX `fk_mbira_area_media_mbira_areas1_idx` (`area_id` ASC),
		CONSTRAINT `fk_mbira_area_media_mbira_areas1`
		FOREIGN KEY (`area_id`)
		REFERENCES `mbira_areas` (`id`)
		ON DELETE Cascade
		ON UPDATE NO ACTION)
		ENGINE = InnoDB
  		DEFAULT CHARACTER SET utf8
  		DEFAULT COLLATE utf8_unicode_ci";
	mysqli_query($con, $sql);	

// -- -----------------------------------------------------
// -- Table `$dbname`.`mbira_exhibits`
// -- -----------------------------------------------------
	$sql = "CREATE TABLE IF NOT EXISTS `mbira_exhibits` (
		`id` INT(11) unsigned NOT NULL AUTO_INCREMENT,
		`project_id` INT(11) UNSIGNED NOT NULL,
		`pid` int(11) unsigned NOT NULL,
		`name` VARCHAR(200) NOT NULL,
		`description` VARCHAR(1000) NULL,
		`file_path` VARCHAR(500) NULL DEFAULT NULL,
		`thumb_path` VARCHAR(500) NULL DEFAULT NULL,
		`thumbCanvasData` VARCHAR(500) NULL DEFAULT NULL,
		`thumbCropData` VARCHAR(500) NULL DEFAULT NULL,
		`header_image_path` VARCHAR(500) NULL DEFAULT NULL,
		PRIMARY KEY (`id`),
		INDEX `fk_mbira_exhibits_mbira_projects1_idx` (`project_id` ASC),
		CONSTRAINT `fk_mbira_exhibits_mbira_projects1`
		FOREIGN KEY (`project_id`)
		REFERENCES `mbira_projects` (`id`)
		ON DELETE Cascade
		ON UPDATE NO ACTION)
		ENGINE = InnoDB
  		DEFAULT CHARACTER SET utf8
  		DEFAULT COLLATE utf8_unicode_ci";
	mysqli_query($con, $sql);	
	
// -- -----------------------------------------------------
// -- Table `$dbname`.`mbira_areas_has_mbira_exhibits`
// -- -----------------------------------------------------
	$sql = "CREATE TABLE IF NOT EXISTS `mbira_areas_has_mbira_exhibits` (
		`mbira_areas_id` INT(11) UNSIGNED NOT NULL,
		`mbira_exhibits_id` INT UNSIGNED NOT NULL,
		INDEX `fk_mbira_areas_has_mbira_exhibits_mbira_exhibits1_idx` (`mbira_exhibits_id` ASC),
		INDEX `fk_mbira_areas_has_mbira_exhibits_mbira_areas1_idx` (`mbira_areas_id` ASC),
		CONSTRAINT `fk_mbira_areas_has_mbira_exhibits_mbira_areas1`
		FOREIGN KEY (`mbira_areas_id`)
		REFERENCES `mbira_areas` (`id`)
		ON DELETE Cascade
		ON UPDATE NO ACTION,
		CONSTRAINT `fk_mbira_areas_has_mbira_exhibits_mbira_exhibits1`
		FOREIGN KEY (`mbira_exhibits_id`)
		REFERENCES `mbira_exhibits` (`id`)
		ON DELETE Cascade
		ON UPDATE NO ACTION)
		ENGINE = InnoDB
  		DEFAULT CHARACTER SET utf8
  		DEFAULT COLLATE utf8_unicode_ci";
	mysqli_query($con, $sql);	
		
// -- -----------------------------------------------------
// -- Table `$dbname`.`mbira_locations_has_mbira_exhibits`
// -- -----------------------------------------------------
	$sql = "CREATE TABLE IF NOT EXISTS `mbira_locations_has_mbira_exhibits` (
		`mbira_locations_id` INT(11) UNSIGNED NOT NULL,
		`mbira_exhibits_id` INT UNSIGNED NOT NULL,
		INDEX `fk_mbira_locations_has_mbira_exhibits_mbira_exhibits1_idx` (`mbira_exhibits_id` ASC),
		INDEX `fk_mbira_locations_has_mbira_exhibits_mbira_locations1_idx` (`mbira_locations_id` ASC),
		CONSTRAINT `fk_mbira_locations_has_mbira_exhibits_mbira_locations1`
		FOREIGN KEY (`mbira_locations_id`)
		REFERENCES `mbira_locations` (`id`)
		ON DELETE Cascade
		ON UPDATE NO ACTION,
		CONSTRAINT `fk_mbira_locations_has_mbira_exhibits_mbira_exhibits1`
		FOREIGN KEY (`mbira_exhibits_id`)
		REFERENCES `mbira_exhibits` (`id`)
		ON DELETE Cascade
		ON UPDATE NO ACTION)
		ENGINE = InnoDB
  		DEFAULT CHARACTER SET utf8
  		DEFAULT COLLATE utf8_unicode_ci";
	mysqli_query($con, $sql);	

// -- -----------------------------------------------------
// -- Table `$dbname`.`mbira_users`
// -- -----------------------------------------------------
	$sql = "CREATE TABLE IF NOT EXISTS `mbira_users` (
		`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
		`username` VARCHAR(45) NULL,
		`email` varchar(100) NOT NULL,
		`password` varchar(64) NOT NULL,
		`salt` char(16) NOT NULL,
		`firstName` VARCHAR(45) NULL,
		`lastName` VARCHAR(45) NULL,
		`validator` VARCHAR(100) DEFAULT NULL,
		`confirm` VARCHAR(100) DEFAULT 0,
		PRIMARY KEY (`id`),
		UNIQUE INDEX `username_UNIQUE` (`username` ASC))
		ENGINE = InnoDB
  		DEFAULT CHARACTER SET utf8
  		DEFAULT COLLATE utf8_unicode_ci";
	mysqli_query($con, $sql);		

// -- -----------------------------------------------------
// -- Table `$dbname`.`mbira_projects_has_mbira_users`
// -- -----------------------------------------------------
	$sql = "CREATE TABLE IF NOT EXISTS `mbira_projects_has_mbira_users` (
		`mbira_projects_id` INT(10) UNSIGNED NOT NULL,
		`mbira_users_id` INT UNSIGNED NOT NULL,
		`isExpert` varchar(10) DEFAULT NULL,
		INDEX `fk_mbira_projects_has_mbira_users_mbira_users1_idx` (`mbira_users_id` ASC),
		INDEX `fk_mbira_projects_has_mbira_users_mbira_projects1_idx` (`mbira_projects_id` ASC),
		CONSTRAINT `fk_mbira_projects_has_mbira_users_mbira_projects1`
		FOREIGN KEY (`mbira_projects_id`)
		REFERENCES `mbira_projects` (`id`)
		ON DELETE Cascade
		ON UPDATE NO ACTION,
		CONSTRAINT `fk_mbira_projects_has_mbira_users_mbira_users1`
		FOREIGN KEY (`mbira_users_id`)
		REFERENCES `mbira_users` (`id`)
		ON DELETE Cascade
		ON UPDATE NO ACTION)
		ENGINE = InnoDB
  		DEFAULT CHARACTER SET utf8
  		DEFAULT COLLATE utf8_unicode_ci";
	mysqli_query($con, $sql);	

// -- -----------------------------------------------------
// -- Table `$dbname`.`mbira_area_comments`
// -- -----------------------------------------------------
	$sql = "CREATE TABLE IF NOT EXISTS `mbira_area_comments` (
		`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
		`area_id` INT(11) UNSIGNED NOT NULL,
		`user_id` INT UNSIGNED NOT NULL,
		`comment` VARCHAR(1000) NULL,
		`isPending` varchar(45) DEFAULT 'yes',
		`replyTo` int(10) DEFAULT '0',
		`created_at` timestamp default current_timestamp,
		`deleted` varchar(45) DEFAULT 'no',
		PRIMARY KEY (`id`),
		INDEX `fk_mbira_area_comments_mbira_areas1_idx` (`area_id` ASC),
		INDEX `fk_mbira_area_comments_mbira_users1_idx` (`user_id` ASC),
		CONSTRAINT `fk_mbira_area_comments_mbira_areas1`
		FOREIGN KEY (`area_id`)
		REFERENCES `mbira_areas` (`id`)
		ON DELETE Cascade
		ON UPDATE NO ACTION,
		CONSTRAINT `fk_mbira_area_comments_mbira_users1`
		FOREIGN KEY (`user_id`)
		REFERENCES `mbira_users` (`id`)
		ON DELETE Cascade
		ON UPDATE NO ACTION)
		ENGINE = InnoDB
  		DEFAULT CHARACTER SET utf8
  		DEFAULT COLLATE utf8_unicode_ci";
	mysqli_query($con, $sql);	

// -- -----------------------------------------------------
// -- Table `$dbname`.`mbira_exploration_comments`
// -- -----------------------------------------------------
	$sql = "CREATE TABLE IF NOT EXISTS `mbira_exploration_comments` (
		`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
		`exploration_id` INT(11) UNSIGNED NOT NULL,
		`user_id` INT UNSIGNED NOT NULL,
		`comment` VARCHAR(1000) NULL,
		`isPending` varchar(45) DEFAULT 'yes',
		`replyTo` int(10) DEFAULT '0',
		`created_at` timestamp default current_timestamp,
		`deleted` varchar(45) DEFAULT 'no',
		PRIMARY KEY (`id`),
		INDEX `fk_mbira_exploration_comments_mbira_explorations1_idx` (`exploration_id` ASC),
		INDEX `fk_mbira_exploration_comments_mbira_users1_idx` (`user_id` ASC),
		CONSTRAINT `fk_mbira_exploration_comments_mbira_explorations1`
		FOREIGN KEY (`exploration_id`)
		REFERENCES `mbira_explorations` (`id`)
		ON DELETE Cascade
		ON UPDATE NO ACTION,
		CONSTRAINT `fk_mbira_exploration_comments_mbira_users1`
		FOREIGN KEY (`user_id`)
		REFERENCES `mbira_users` (`id`)
		ON DELETE Cascade
		ON UPDATE NO ACTION)
		ENGINE = InnoDB
  		DEFAULT CHARACTER SET utf8
  		DEFAULT COLLATE utf8_unicode_ci";
	mysqli_query($con, $sql);	
	
// -- -----------------------------------------------------
// -- Table `$dbname`.`mbira_location_comments`
// -- -----------------------------------------------------
	$sql = "CREATE TABLE IF NOT EXISTS `mbira_location_comments` (
		`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
		`user_id` INT UNSIGNED NOT NULL,
		`location_id` INT(11) UNSIGNED NOT NULL,
		`comment` VARCHAR(1000) NULL,
		`isPending` varchar(45) DEFAULT 'yes',
		`replyTo` int(10) DEFAULT '0',
		`created_at` timestamp default current_timestamp,
		`deleted` varchar(45) DEFAULT 'no',
		PRIMARY KEY (`id`),
		INDEX `fk_mbira_location_comments_mbira_users1_idx` (`user_id` ASC),
		INDEX `fk_mbira_location_comments_mbira_locations1_idx` (`location_id` ASC),
		CONSTRAINT `fk_mbira_location_comments_mbira_users1`
		FOREIGN KEY (`user_id`)
		REFERENCES `mbira_users` (`id`)
		ON DELETE Cascade
		ON UPDATE NO ACTION,
		CONSTRAINT `fk_mbira_location_comments_mbira_locations1`
		FOREIGN KEY (`location_id`)
		REFERENCES `mbira_locations` (`id`)
		ON DELETE Cascade
		ON UPDATE NO ACTION)
		ENGINE = InnoDB
  		DEFAULT CHARACTER SET utf8
  		DEFAULT COLLATE utf8_unicode_ci";
	mysqli_query($con, $sql);
	
	$sql = "ALTER TABLE project
		ADD shortDescription varchar(255)";
	mysqli_query($con, $sql);

	$sql = "ALTER TABLE mbira_areas
		ADD header_image_path varchar(1000) NULL DEFAULT NULL";
	mysqli_query($con, $sql);
	
	$sql = "ALTER TABLE mbira_locations MODIFY description VARCHAR(65353);";
	mysqli_query($con, $sql);
	
	$sql = "ALTER TABLE mbira_locations MODIFY dig_deeper VARCHAR(65353);";
	mysqli_query($con, $sql);
	
	$sql = "ALTER TABLE mbira_areas MODIFY description VARCHAR(65353);";
	mysqli_query($con, $sql);
	
	$sql = "ALTER TABLE mbira_areas MODIFY dig_deeper VARCHAR(65353);";
	mysqli_query($con, $sql);
	
	$sql = "ALTER TABLE mbira_exhibits MODIFY description VARCHAR(65353);";
	mysqli_query($con, $sql);
		
	$sql = "ALTER TABLE mbira_explorations MODIFY description VARCHAR(65353);";
	mysqli_query($con, $sql);
	
	$sql = "ALTER TABLE mbira_projects MODIFY description VARCHAR(65353);";
	mysqli_query($con, $sql);
		
	$sql = "ALTER TABLE mbira_location_comments MODIFY comment VARCHAR(5000);";
	mysqli_query($con, $sql);
	
	$sql = "ALTER TABLE mbira_area_comments MODIFY comment VARCHAR(5000);";
	mysqli_query($con, $sql);
	
	$sql = "ALTER TABLE mbira_exploration_comments MODIFY comment VARCHAR(5000);";
	mysqli_query($con, $sql);
	
	mysqli_close($con);
?>






