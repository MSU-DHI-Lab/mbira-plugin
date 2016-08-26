<?php
	require_once('../../../pluginsConfig.php');
	$con=mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);
	// Check connection
	if (mysqli_connect_errno()) {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}

	function createRow($con) {
		$id = $_POST['id'];
		$project_id = $_POST['project'];
		if ($_POST['imageCanvasData'] != 'undefined') {
			$imageCanvasData = $_POST['imageCanvasData'];
			$imageCropData = $_POST['imageCropData'];
		}

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

		$uploaddir = '../../media/images/project'.$project_id.'/'.$folder.'/'.$id.'/';

		$uniqid = uniqid();
		$uploadfile = $uploaddir .$uniqid.'.'.$name[count($name)-1];
		move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);
		$file_path = 'media/images/project'.$project_id.'/'.$folder.'/'.$id.'/'.$uniqid.'.'.$name[count($name)-1];

		$thumb_file_ext = explode('/', $_FILES['croppedThumbnail']['type'])[1];
		$thumb_uploadfile = $uploaddir .$uniqid.'_thumb.'.$thumb_file_ext;
		move_uploaded_file($_FILES['croppedThumbnail']['tmp_name'], $thumb_uploadfile);
		$thumb_file_path = 'media/images/project'.$project_id.'/'.$folder.'/'.$id.'/'.$uniqid.'_thumb.'.$thumb_file_ext;	

		if ($_FILES['croppedImage']) {
			$crop_file_ext = explode('/', $_FILES['croppedImage']['type'])[1];
			$crop_uploadfile = $uploaddir .$uniqid.'_cropped.'.$crop_file_ext;
			move_uploaded_file($_FILES['croppedImage']['tmp_name'], $crop_uploadfile);
			$crop_file_path = 'media/images/project'.$project_id.'/'.$folder.'/'.$id.'/'.$uniqid.'_cropped.'.$crop_file_ext;	
		}

		$thumbCanvasData = $_POST['thumbCanvasData'];
		$thumbCropData = $_POST['thumbCropData'];
		$title = mysqli_real_escape_string($con, $_POST['title']);
		$altDesc = mysqli_real_escape_string($con, $_POST['altDesc']);
		$description = mysqli_real_escape_string($con, $_POST['description']);
		$type = $_POST['type'];
		
		mysqli_query($con,"INSERT INTO mbira_".$type."_media (".$typeID.", file_path, thumb_path, cropped_image_path, isThumb, imageCanvasData, imageCropData, thumbCanvasData, thumbCropData, title, alt_desc, description) VALUES ('$id', '$file_path', '$thumb_file_path', '$crop_file_path', 'no', '$imageCanvasData', '$imageCropData', '$thumbCanvasData', '$thumbCropData', '$title', '$altDesc', '$description')");

		mysqli_close($con);
	}

	function deleteRow($con) {
		$id = $_POST['id'];
		$type = $_POST['type'];
		if ($type == 'loc'){
			$typeID = 'location_id';
		} else if ($type == 'exp'){
			$typeID = 'exploration_id';
		}	else if ($type == 'area'){
			$typeID = 'area_id';
		} 

		mysqli_query($con,"DELETE FROM mbira_".$type."_media WHERE id = '$id'");
		var_dump(basePathPlugin . "plugins/mbira/");
		
		$basefile = explode('.', $_POST['path']);
		unlink(basePathPlugin . "plugins/mbira/" . $_POST['path']);
		unlink(basePathPlugin . "plugins/mbira/" . $basefile[0]."_thumb.".$basefile[1]);
		unlink(basePathPlugin . "plugins/mbira/" . $basefile[0]."_cropped.".$basefile[1]);
		
		mysqli_close($con);
	}

	function getMedia($con) {
		$id = $_POST['id'];
		$type = $_POST['type'];
		if ($type == 'loc'){
			$typeID = 'location_id';
		} else if ($type == 'exp'){
			$typeID = 'exploration_id';
		}	else if ($type == 'area'){
			$typeID = 'area_id';
		} 

		$results = mysqli_query($con,"SELECT * FROM mbira_".$type."_media WHERE ".$typeID." = '$id'");

		$resultsArray = Array();
		while($row = mysqli_fetch_array($results)) {
			array_push($resultsArray, $row);
		}
		echo json_encode($resultsArray);
	}

	function updateRow($con) {
		$id = $_POST['id'];
		$project_id = $_POST['project'];
		$title = $_POST['title'];
		$altDesc = $_POST['altDesc'];
		$description = mysqli_real_escape_string($con, $_POST['description']);
		$type = mysqli_real_escape_string($con, $_POST['type']);
		$mid = mysqli_real_escape_string($con, $_POST['mid']);

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

		$results = mysqli_query($con,"SELECT * FROM mbira_".$type."_media WHERE id= '$mid'");
		$row = mysqli_fetch_array($results);

		$sql_query = "UPDATE mbira_".$type."_media SET title='$title', alt_desc='$altDesc', description='$description'";

		$uploaddir = '../../media/images/project'.$project_id.'/'.$folder.'/'.$id.'/';
		$f_path = explode('/', $row['file_path']);
		$last_element = end($f_path);
		$temp_array = explode('.', $last_element );
		$uniqid = $temp_array[0];

		if ($_FILES['croppedThumbnail']) {
			$thumb_file_ext = explode('/', $_FILES['croppedThumbnail']['type'])[1];
			$thumb_uploadfile = $uploaddir .$uniqid.'_thumb.'.$thumb_file_ext;
			unlink($thumb_uploadfile); //remove the file
			move_uploaded_file($_FILES['croppedThumbnail']['tmp_name'], $thumb_uploadfile);
			$thumb_file_path = 'media/images/project'.$project_id.'/'.$folder.'/'.$id.'/'.$uniqid.'_thumb.'.$thumb_file_ext;

			$thumbCanvasData = $_POST['thumbCanvasData'];
			$thumbCropData = $_POST['thumbCropData'];
			$sql_query = $sql_query. ", thumb_path='$thumb_file_path', thumbCanvasData='$thumbCanvasData', thumbCropData='$thumbCropData'";
		}
		if ($_FILES['croppedImage']) {
			$crop_file_ext = explode('/', $_FILES['croppedImage']['type'])[1];
			$crop_uploadfile = $uploaddir .$uniqid.'_cropped.'.$crop_file_ext;
			unlink($crop_uploadfile); //remove the file
			move_uploaded_file($_FILES['croppedImage']['tmp_name'], $crop_uploadfile);
			$crop_file_path = 'media/images/project'.$project_id.'/'.$folder.'/'.$id.'/'.$uniqid.'_cropped.'.$crop_file_ext;

			$imageCanvasData = $_POST['imageCanvasData'];
			$imageCropData = $_POST['imageCropData'];
			$sql_query = $sql_query. ", cropped_image_path='$crop_file_path', imageCanvasData='$imageCanvasData', imageCropData='$imageCropData'";
		}

		$sql_query = $sql_query. " WHERE id='$mid'";
		mysqli_query($con,$sql_query);		
		
		mysqli_close($con);
	}

	function getAllMedia($con) {
		$results = mysqli_query($con, "SELECT mbira_locations.id as location_id, mbira_locations.name, mbira_locations.project_id, mbira_loc_media.id as mid, mbira_loc_media.title, mbira_loc_media.description, mbira_loc_media.alt_desc, mbira_loc_media.file_path, mbira_loc_media.thumb_path, mbira_loc_media.thumbCanvasData, mbira_loc_media.thumbCropData, mbira_loc_media.cropped_image_path, mbira_loc_media.imageCanvasData, mbira_loc_media.imageCropData, mbira_loc_media.isThumb, mbira_loc_media.isHeader  FROM mbira_loc_media INNER JOIN mbira_locations ON mbira_locations.id=mbira_loc_media.location_id");

		$results2 = mysqli_query($con, "SELECT mbira_areas.id as area_id, mbira_areas.name, mbira_areas.project_id, mbira_area_media.id as mid, mbira_area_media.title, mbira_area_media.description, mbira_area_media.alt_desc, mbira_area_media.file_path, mbira_area_media.thumb_path, mbira_area_media.thumbCanvasData, mbira_area_media.thumbCropData, mbira_area_media.cropped_image_path, mbira_area_media.imageCanvasData, mbira_area_media.imageCropData, mbira_area_media.isThumb, mbira_area_media.isHeader  FROM mbira_area_media INNER JOIN mbira_areas ON mbira_areas.id=mbira_area_media.area_id");

		$resultsArray = Array();
		while($row = mysqli_fetch_array($results)) {
			array_push($resultsArray, $row);
		}
		while($row2 = mysqli_fetch_array($results2) ) {
			array_push($resultsArray, $row2);
		}

		echo json_encode($resultsArray);
	}

if($_POST['task'] == 'create'){
	createRow($con);
}else if($_POST['task'] == 'update'){
	updateRow($con);
}else if($_POST['task'] == 'get'){
	getMedia($con);
}else if($_POST['task'] == 'all'){
	getAllMedia($con);
}else if($_POST['task'] == 'delete'){
	deleteRow($con);
}

?>