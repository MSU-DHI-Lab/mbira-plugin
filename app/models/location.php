<?php
require_once('../../../pluginsConfig.php');
require_once(basePathPlugin.'includes/includes.php');
require_once('../../utils/removeFolders.php');

$con=mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

// Check connection
if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

//Delete location
function deleteRow($con){
	$id = $_POST['id'];
	$project_id = $_POST['project'];

	Delete('../../media/audio/project'.$project_id.'/locations/'.$id.'/');
	Delete('../../media/images/project'.$project_id.'/locations/'.$id.'/');
	Delete('../../media/video/project'.$project_id.'/locations/'.$id.'/');
	

	mysqli_query($con,"DELETE FROM mbira_map_locexpl WHERE locationid='$id'");
	mysqli_query($con,"DELETE FROM mbira_loc_media WHERE location_id='$id'");
	mysqli_query($con,"DELETE FROM mbira_locations WHERE id='$id'");
}

//Update location
function updateRow($con){
	$lid = $_POST['lid'];
	$project_id = $_POST['project'];
	$name = mysqli_real_escape_string($con, $_POST['name']);
	$desc = mysqli_real_escape_string($con, $_POST['description']);
	$short_desc = mysqli_real_escape_string($con, $_POST['shortDescription']);
	$dig_deeper = mysqli_real_escape_string($con, $_POST['dig_deeper']);
	$lat = $_POST['latitude'];
	$lon = $_POST['longitude'];
	$toggle_dig_deeper = $_POST['toggle_dig_deeper'];
	$toggle_media = $_POST['toggle_media'];
	$toggle_comments = $_POST['toggle_comments'];
	
	mysqli_query($con,"UPDATE mbira_locations SET name='$name', description='$desc', short_description='$short_desc', dig_deeper='$dig_deeper', toggle_comments='$toggle_comments', toggle_dig_deeper='$toggle_dig_deeper', 
		latitude='$lat', longitude='$lon', toggle_media='$toggle_media' WHERE id='$lid'");
		
	if (isset($_FILES['file'])) {
		//Save image
		$uploaddir = '../../media/images/project'.$project_id.'/locations/'.$lid.'/';
		
		//Use default image if no file provided
		if(isset($_FILES['file']['name'])){
			$filename = explode('.', basename($_FILES['file']['name']));

			$uniqid = uniqid();
			$uploadfile = $uploaddir .$uniqid.'.'.$filename[count($filename)-1];
			move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);
			$path = 'media/images/project'.$project_id.'/locations/'.$lid.'/'.$uniqid.'.'.$filename[count($filename)-1];
			
			mysqli_query($con, "UPDATE mbira_loc_media SET isThumb='no' WHERE location_id='$lid' AND isThumb='yes'");
			mysqli_query($con, "UPDATE mbira_locations SET thumb_path='$path' WHERE id='$lid'");
			mysqli_query($con,"INSERT INTO mbira_loc_media (location_id, file_path, isThumb) VALUES ('$lid', '$path', 'yes')");
			mysqli_query($con,"DELETE FROM mbira_loc_media WHERE location_id='$lid' AND file_path='app/assets/images/Default.png'");
		}
	}
}

//Add new location
function createRow($con) {
	$projectId = $_POST['projectId'];
	$pid = $_POST['pid'];
	$name = mysqli_real_escape_string($con, $_POST['name']);
	$desc = mysqli_real_escape_string($con, $_POST['description']);
	$short_desc = mysqli_real_escape_string($con, $_POST['shortDescription']);
	$dig_deeper = mysqli_real_escape_string($con, $_POST['dig_deeper']);
	$lat = $_POST['lat'];
	$lon = $_POST['lon'];
	$toggle_dig_deeper = $_POST['toggle_dig_deeper'];
	$toggle_media = $_POST['toggle_media'];
	$toggle_comments = $_POST['toggle_comments'];
	
	//Create row in mbira_locations
	$my = mysqli_query($con,"INSERT INTO mbira_locations (project_id, pid, name, description, short_description, dig_deeper, latitude, longitude, toggle_comments, toggle_dig_deeper, toggle_media) VALUES ('$projectId', '$pid', '$name', '$desc', '$short_desc', '$dig_deeper', '$lat', '$lon', '$toggle_comments', '$toggle_dig_deeper', '$toggle_media')");

	$lid =  mysqli_insert_id($con);
	echo $lid;

	//Save image
	$uploaddir = '../../media/images/project'.$projectId.'/locations/'.$lid.'/';
	
	if (!file_exists($uploaddir)) {
	    mkdir($uploaddir, 0775, true);
	}

	//Use default image if no file provided
	if(isset($_FILES['file']['name'])){
		$filename = explode('.', basename($_FILES['file']['name']));

		$uniqid = uniqid();
		$uploadfile = $uploaddir .$uniqid.'.'.$filename[count($filename)-1];
		move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);
		$path = 'media/images/project'.$projectId.'/locations/'.$lid.'/'.$uniqid.'.'.$filename[count($filename)-1];
	}else{
		$path = 'app/assets/images/Default.png';
	}
	

	//Add path to location's row
	$sql = "UPDATE mbira_locations SET thumb_path='".$path."' WHERE id=".$lid;
	mysqli_query($con, $sql);

	//Create row in mbira_loc_media
	mysqli_query($con,"INSERT INTO mbira_loc_media (location_id, file_path, isThumb) VALUES ('$lid', '$path', 'yes')");
	
	//Create and ingest location record to kora
	$result = mysqli_query($con, "SELECT * FROM scheme WHERE schemeName = 'Location' AND pid = " . $pid);
	
	while($row = mysqli_fetch_array($result)) {
		$sid = $row['schemeid'];
	}
	
	$xml = Array();
	$xml["Name"] = $name;
	$xml["Description"] = $desc;
	$xml["Longitude"] = $lon;
	$xml["Latitude"] = $lat;
	
	// "<Record>
	// <id>'$rid'</id> 
	// <Name>'$name'</Name> 
	// <Description>'$desc'</Description> 
	// <Longitude>'$lat'</Longitude> 
	// <Latitude>'$lon'</Latitude> 
	// </Record>"
	
	// $record = new Record($pid, $sid);
	// $record -> ingest($xml);
}

function uploadHeader($con) {
	$id = $_POST['id'];
	$project_id = $_POST['project'];
	$uploaddir = '../../media/images/project'.$project_id.'/locations/'.$id.'/';

	
	//Use default image if no file provided
	if(isset($_FILES['file']['name'])){
		$mediaResult = mysqli_query($con, "SELECT header_image_path FROM mbira_locations WHERE id = '$id'");
		
		while($mediaRow = mysqli_fetch_array($mediaResult)) {
			unlink('../../' .$mediaRow['header_image_path']);
		}

		$filename = explode('.', basename($_FILES['file']['name']));
		
		$uniqid = uniqid();
		$uploadfile = $uploaddir .$uniqid.'.'.$filename[count($filename)-1];
		move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);
		$path = 'media/images/project'.$project_id.'/locations/'.$id.'/'.$uniqid.'.'.$filename[count($filename)-1];

		mysqli_query($con,"DELETE FROM mbira_loc_media WHERE location_id='$id' AND file_path='app/assets/images/Default-Header.png'");
	}else{
		$path = 'app/assets/images/Default-Header.png';
	}

	mysqli_query($con,"UPDATE mbira_locations SET header_image_path='$path' WHERE id='$id'");
	mysqli_query($con,"INSERT INTO mbira_loc_media (location_id, file_path, isHeader) VALUES ('$lid', '$path', 'yes')");	
}

function getAll($con) {		
	$results = mysqli_query($con, "SELECT * FROM mbira_locations");
	$resultsArray = Array();
	while($row = mysqli_fetch_array($results)) {
		array_push($resultsArray, $row);
	}
	echo json_encode($resultsArray);
}


function getInfo($con) {
	$id = $_POST['id'];
	$results = mysqli_query($con, "SELECT * FROM mbira_locations WHERE id = ".$id);
	$locationArray = Array();
	while($row = mysqli_fetch_array($results)) {
		array_push($locationArray, $row);
	}
	echo json_encode($locationArray[0]);
}

function cleanDb($con, $id) {
	mysqli_query($con,"UPDATE mbira_loc_media SET isThumb='no' WHERE location_id='$id' AND isThumb = 'yes' AND (description IS NOT NULL) "); 
	$locResult = mysqli_query($con,"SELECT file_path, thumb_path, cropped_image_path FROM mbira_loc_media WHERE location_id='$id' AND isThumb = 'yes' AND (description IS NULL) ");
	while($locRow = mysqli_fetch_array($locResult)) {
		unlink("../../".$locRow['file_path']); //remove the file
		unlink("../../".$locRow['thumb_path']); //remove the file
		unlink("../../".$locRow['cropped_image_path']); //remove the file

	}
	mysqli_query($con,"DELETE FROM mbira_loc_media WHERE location_id='$id' AND isThumb = 'yes' AND (description IS NULL) ");
}

function saveThumbnail($con) {
	$id = $_POST['lid'];
	$project_id = $_POST['project'];

	$thumbCanvasData = $_POST['thumbCanvasData'];
	$thumbCropData = $_POST['thumbCropData'];
	$uploaddir = '../../media/images/project'.$project_id.'/locations/'.$id.'/';

	if ($_POST['type'] == 'new') {
		cleanDb($con, $id);
		$name = explode('.', basename($_FILES['file']['name']));

		

		$uniqid = uniqid();
		$uploadfile = $uploaddir .$uniqid.'.'.$name[count($name)-1];
		move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);
		$file_path = 'media/images/project'.$project_id.'/locations/'.$id.'/'.$uniqid.'.'.$name[count($name)-1];

		$thumb_file_ext = explode('/', $_FILES['croppedThumbnail']['type'])[1];
		$thumb_uploadfile = $uploaddir .$uniqid.'_thumb.'.$thumb_file_ext;
		move_uploaded_file($_FILES['croppedThumbnail']['tmp_name'], $thumb_uploadfile);
		$thumb_file_path = 'media/images/project'.$project_id.'/locations/'.$id.'/'.$uniqid.'_thumb.'.$thumb_file_ext;	

		mysqli_query($con,"INSERT INTO mbira_loc_media (location_id, file_path, thumb_path, isThumb, thumbCanvasData, thumbCropData, cropped_image_path, imageCanvasData, imageCropData, title, alt_desc, description) VALUES ('$id', '$file_path', '$thumb_file_path', 'yes', '$thumbCanvasData', '$thumbCropData', null, null, null, null, null, null)");

		$sql = "UPDATE mbira_locations SET thumb_path='".$thumb_file_path."' WHERE id=".$id;
		mysqli_query($con, $sql);

		mysqli_query($con,"DELETE FROM mbira_loc_media WHERE location_id='$id' AND file_path='app/assets/images/Default.png'");
	} else {

		$locResult = mysqli_query($con,"SELECT file_path, thumb_path FROM mbira_loc_media WHERE location_id='$id' AND isThumb = 'yes'");
		while($locRow = mysqli_fetch_array($locResult)) {
			$file_path = $locRow['file_path'];
			unlink("../../".$locRow['thumb_path']); //remove the file
		}

		$f_path = explode('/', $file_path);
		$last_element = end($f_path);
		$temp_array = explode('.', $last_element );
		$uniqid = $temp_array[0];

		$thumb_file_ext = explode('/', $_FILES['croppedThumbnail']['type'])[1];
		$thumb_uploadfile = $uploaddir .$uniqid.'_thumb.'.$thumb_file_ext;
		move_uploaded_file($_FILES['croppedThumbnail']['tmp_name'], $thumb_uploadfile);

		mysqli_query($con, "UPDATE mbira_loc_media SET thumbCanvasData='$thumbCanvasData', thumbCropData='$thumbCropData' WHERE location_id='$id' AND isThumb='yes'");

	}

}

function saveThumbnailWithMedia($con) {
	$id = $_POST['lid'];
	$project_id = $_POST['project'];

	$thumbCanvasData = $_POST['thumbCanvasData'];
	$thumbCropData = $_POST['thumbCropData'];
	$title = $_POST['title'];
	$altDesc = $_POST['altDesc'];
	$description = $_POST['description'];
	$uploaddir = '../../media/images/project'.$project_id.'/locations/'.$id.'/';

	if ($_POST['type'] == 'new') {
		cleanDb($con, $id);
		$name = explode('.', basename($_FILES['file']['name']));

		$uploaddir = '../../media/images/project'.$project_id.'/locations/'.$id.'/';

		$uniqid = uniqid();
		$uploadfile = $uploaddir .$uniqid.'.'.$name[count($name)-1];
		move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);
		$file_path = 'media/images/project'.$project_id.'/locations/'.$id.'/'.$uniqid.'.'.$name[count($name)-1];

		$thumb_file_ext = explode('/', $_FILES['croppedThumbnail']['type'])[1];
		$thumb_uploadfile = $uploaddir .$uniqid.'_thumb.'.$thumb_file_ext;
		move_uploaded_file($_FILES['croppedThumbnail']['tmp_name'], $thumb_uploadfile);
		$thumb_file_path = 'media/images/project'.$project_id.'/locations/'.$id.'/'.$uniqid.'_thumb.'.$thumb_file_ext;	

		if ($_FILES['croppedImage']) {
			$crop_file_ext = explode('/', $_FILES['croppedImage']['type'])[1];
			$crop_uploadfile = $uploaddir .$uniqid.'_cropped.'.$crop_file_ext;
			unlink($crop_uploadfile); //remove the file
			move_uploaded_file($_FILES['croppedImage']['tmp_name'], $crop_uploadfile);
			$crop_file_path = 'media/images/project'.$project_id.'/locations/'.$id.'/'.$uniqid.'_cropped.'.$crop_file_ext;

			$imageCanvasData = $_POST['imageCanvasData'];
			$imageCropData = $_POST['imageCropData'];
		}

		mysqli_query($con,"INSERT INTO mbira_loc_media (location_id, file_path, thumb_path, isThumb, thumbCanvasData, thumbCropData, cropped_image_path, imageCanvasData, imageCropData, title, alt_desc, description) VALUES ('$id', '$file_path', '$thumb_file_path', 'yes', '$thumbCanvasData', '$thumbCropData', '$crop_file_path', '$imageCanvasData', '$imageCropData', '$title', '$altDesc', '$description')"); 

		$sql = "UPDATE mbira_locations SET thumb_path='".$thumb_file_path."' WHERE id=".$id;
		mysqli_query($con, $sql);
		
		mysqli_query($con,"DELETE FROM mbira_loc_media WHERE location_id='$id' AND file_path='app/assets/images/Default.png'");
	} else {
		$locResult = mysqli_query($con,"SELECT file_path, thumb_path, cropped_image_path FROM mbira_loc_media WHERE location_id='$id' AND isThumb = 'yes'");
		while($locRow = mysqli_fetch_array($locResult)) {
			$file_path = $locRow['file_path'];
			unlink("../../".$locRow['thumb_path']); //remove the file
			
		}

		$f_path = explode('/', $file_path);
		$last_element = end($f_path);
		$temp_array = explode('.', $last_element );
		$uniqid = $temp_array[0];

		$thumb_file_ext = explode('/', $_FILES['croppedThumbnail']['type'])[1];
		$thumb_uploadfile = $uploaddir .$uniqid.'_thumb.'.$thumb_file_ext;
		move_uploaded_file($_FILES['croppedThumbnail']['tmp_name'], $thumb_uploadfile);


		$crop_file_path = null;
		$imageCanvasData = null;
		$imageCropData = null;
		if ($_FILES['croppedImage']) {
			unlink("../../".$locRow['cropped_image_path']); //remove the file

			$crop_file_ext = explode('/', $_FILES['croppedImage']['type'])[1];
			$crop_uploadfile = $uploaddir .$uniqid.'_cropped.'.$crop_file_ext;

			move_uploaded_file($_FILES['croppedImage']['tmp_name'], $crop_uploadfile);
			$crop_file_path = 'media/images/project'.$project_id.'/locations/'.$id.'/'.$uniqid.'_cropped.'.$crop_file_ext;

			$imageCanvasData = $_POST['imageCanvasData'];
			$imageCropData = $_POST['imageCropData'];
		}

		mysqli_query($con, "UPDATE mbira_loc_media SET imageCanvasData='$imageCanvasData', imageCropData='$imageCropData', cropped_image_path='$crop_file_path', thumbCanvasData='$thumbCanvasData', thumbCropData='$thumbCropData', title='$title', alt_desc='$altDesc', description='$description' WHERE location_id='$id' AND isThumb='yes'");
	}
}

function byProject($con) {
	$id = $_POST['id'];
	$results = mysqli_query($con, "SELECT * FROM mbira_locations WHERE project_id = '$id'");
	$resultsArray = Array();
	while($row = mysqli_fetch_array($results)) {
		array_push($resultsArray, $row);
	}
	echo json_encode($resultsArray);
}

if ($_POST['task'] == 'create'){
	createRow($con);
} else if($_POST['task'] == 'update'){
	updateRow($con);
} else if($_POST['task'] == 'delete'){
	deleteRow($con);
} else if($_POST['task'] == 'uploadHeader'){
	uploadHeader($con);
}else if($_POST['task'] == 'all'){
	getAll($con);
}else if($_POST['task'] == 'info'){
	getInfo($con);
}else if($_POST['task'] == 'thumbnail'){
	saveThumbnail($con);
}else if($_POST['task'] == 'thumbmedia'){
	saveThumbnailWithMedia($con);
}else if($_POST['task'] == 'byProject'){
	byProject($con);
}

mysqli_close($con);
?>