<?php
require_once('../../../pluginsConfig.php');
require_once(basePathPlugin.'includes/includes.php');
require_once('../../utils/removeFolders.php');

$con=mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

// Check connection
if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

//Delete area
function deleteRow($con){
	$id = $_POST['id'];
	$project_id = $_POST['project'];

	Delete('../../media/audio/project'.$project_id.'/areas/'.$id.'/');
	Delete('../../media/images/project'.$project_id.'/areas/'.$id.'/');
	Delete('../../media/video/project'.$project_id.'/areas/'.$id.'/');
	

	//mysqli_query($con,"DELETE FROM mbira_map_areaexpl WHERE areaid='$id'");
	mysqli_query($con,"DELETE FROM mbira_area_media WHERE area_id='$id'");
	mysqli_query($con,"DELETE FROM mbira_areas WHERE id='$id'");
}

//Update area
function updateRow($con){
	$aid = $_POST['aid'];
	$project_id = $_POST['project'];
	$name = mysqli_real_escape_string($con, $_POST['name']);
	$desc = mysqli_real_escape_string($con, $_POST['description']);
	$short_desc = mysqli_real_escape_string($con, $_POST['shortDescription']);
	$dig_deeper = mysqli_real_escape_string($con, $_POST['dig_deeper']);
	$coords = $_POST['coordinates'];
	$json = $_POST['json'];
	$radius = $_POST['radius'];
	$shape = $_POST['shape'];
	$toggle_dig_deeper = $_POST['toggle_dig_deeper'];
	$toggle_media = $_POST['toggle_media'];
	$toggle_comments = $_POST['toggle_comments'];
	$geoPath = $projectId."_".$aid.".geojson";

	mysqli_query($con,"UPDATE mbira_areas SET name='$name', description='$desc', short_description='$short_desc', dig_deeper='$dig_deeper', toggle_comments='$toggle_comments', toggle_dig_deeper='$toggle_dig_deeper', 
		coordinates='$coords', radius='$radius', shape='$shape', toggle_media='$toggle_media', geoJSON_path='$geoPath' WHERE id='$aid'");
		
	if (isset($_FILES['file'])) {
		//Save image
		$uploaddir = '../../media/images/project'.$project_id.'/areas/'.$aid.'/';
		
		//Use default image if no file provided
		if(isset($_FILES['file']['name'])){
			$filename = explode('.', basename($_FILES['file']['name']));

			$uniqid = uniqid();
			$uploadfile = $uploaddir .$uniqid.'.'.$filename[count($filename)-1];
			move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);
			$path = 'media/images/project'.$project_id.'/areas/'.$aid.'/'.$uniqid.'.'.$filename[count($filename)-1];
			
			mysqli_query($con, "UPDATE mbira_area_media SET isThumb='no' WHERE area_id='$aid' AND isThumb='yes'");
			mysqli_query($con, "UPDATE mbira_areas SET thumb_path='$path' WHERE id='$aid'");
			mysqli_query($con,"INSERT INTO mbira_area_media (area_id, file_path, isThumb) VALUES ('$aid', '$path', 'yes')");
			mysqli_query($con,"DELETE FROM mbira_area_media WHERE area_id='$aid' AND file_path='app/assets/images/Default.png'");
		}
	}
}

//Add new area
function createRow($con) {

	$projectId = $_POST['projectId'];
	$name = mysqli_real_escape_string($con, $_POST['name']);
	$desc = mysqli_real_escape_string($con, $_POST['description']);
	$short_desc = mysqli_real_escape_string($con, $_POST['shortDescription']);
	$dig_deeper = mysqli_real_escape_string($con, $_POST['dig_deeper']);
	$coords = $_POST['coordinates'];
	$radius = $_POST['radius'];
	$shape = $_POST['shape'];
	$toggle_dig_deeper = $_POST['toggle_dig_deeper'];
	$toggle_media = $_POST['toggle_media'];
	$toggle_comments = $_POST['toggle_comments'];
	$json = $_POST['json'];
	
	//Create row in mbira_areass
	$my = mysqli_query($con,"INSERT INTO mbira_areas (project_id, name, description, short_description, dig_deeper, coordinates, radius, shape, toggle_comments, toggle_media, toggle_dig_deeper) VALUES ('$projectId', '$name', '$desc', '$short_desc', '$dig_deeper', '$coords', '$radius', '$shape', '$toggle_comments', '$toggle_media', '$toggle_dig_deeper')");
	
	$aid =  mysqli_insert_id($con);
	echo $aid;

	//Save image
	$uploaddir = '../../media/images/project'.$projectId.'/areas/'.$aid.'/';
	
	if (!file_exists($uploaddir)) {
	    mkdir($uploaddir, 0775, true);
	}

	//Use default image if no file provided
	if(isset($_FILES['file']['name'])){
		$filename = explode('.', basename($_FILES['file']['name']));

		$uniqid = uniqid();
		$uploadfile = $uploaddir .$uniqid.'.'.$filename[count($filename)-1];
		move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);
		$path = 'media/images/project'.$projectId.'/areas/'.$aid.'/'.$uniqid.'.'.$filename[count($filename)-1];
	}else{
		$path = 'app/assets/images/Default.png';
	}
	

	//Add path to area's row
	$sql = "UPDATE mbira_areas SET thumb_path='".$path."' WHERE id=".$aid;
	mysqli_query($con, $sql);

	//Create row in mbira_area_media
	mysqli_query($con,"INSERT INTO mbira_area_media (area_id, file_path, isThumb) VALUES ('$aid', '$path', 'yes')");

	$geoPath = $projectId."_".$aid.".geojson";
	file_put_contents("../../JSON/".$geoPath ,$json);

	//add geoJSON_path
	mysqli_query($con,"UPDATE mbira_areas SET geoJSON_path='$geoPath' WHERE id='$aid'");
		
}

function uploadHeader($con) {
	$id = $_POST['id'];
	$project_id = $_POST['project'];
	$uploaddir = '../../media/images/project'.$project_id.'/areas/'.$id.'/';

	
	//Use default image if no file provided
	if(isset($_FILES['file']['name'])){
		$mediaResult = mysqli_query($con, "SELECT header_image_path FROM mbira_areas WHERE id = '$id'");
		
		while($mediaRow = mysqli_fetch_array($mediaResult)) {
			unlink('../../' .$mediaRow['header_image_path']);
		}

		$filename = explode('.', basename($_FILES['file']['name']));
		
		$uniqid = uniqid();
		$uploadfile = $uploaddir .$uniqid.'.'.$filename[count($filename)-1];
		move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);
		$path = 'media/images/project'.$project_id.'/areas/'.$id.'/'.$uniqid.'.'.$filename[count($filename)-1];

		mysqli_query($con,"DELETE FROM mbira_area_media WHERE area_id='$id' AND file_path='app/assets/images/Default-Header.png'");
	}else{
		$path = 'app/assets/images/Default-Header.png';
	}

	mysqli_query($con,"UPDATE mbira_areas SET header_image_path='$path' WHERE id='$id'");
	mysqli_query($con,"INSERT INTO mbira_area_media (area_id, file_path, isHeader) VALUES ('$id', '$path', 'yes')");	
}

function getAll($con) {		
	$results = mysqli_query($con, "SELECT * FROM mbira_areas");
	$resultsArray = Array();
	while($row = mysqli_fetch_array($results)) {
		array_push($resultsArray, $row);
	}
	echo json_encode($resultsArray);
}

function getInfo($con) {
	$id = $_POST['id'];
	$results = mysqli_query($con, "SELECT * FROM mbira_areas WHERE id = ".$id);
	$areaArray = Array();
	while($row = mysqli_fetch_array($results)) {
		array_push($areaArray, $row);
	}
	echo json_encode($areaArray[0]);
}

function cleanDb($con, $id) {
	mysqli_query($con,"UPDATE mbira_area_media SET isThumb='no' WHERE area_id='$id' AND isThumb = 'yes' AND (description IS NOT NULL) "); 
	$areaResult = mysqli_query($con,"SELECT file_path, thumb_path, cropped_image_path FROM mbira_area_media WHERE area_id='$id' AND isThumb = 'yes' AND (description IS NULL) ");
	while($areaRow = mysqli_fetch_array($areaResult)) {
		var_dump($areaRow['file_path']);
		unlink("../../".$areaRow['file_path']); //remove the file
		unlink("../../".$areaRow['thumb_path']); //remove the file
		unlink("../../".$areaRow['cropped_image_path']); //remove the file

	}
	mysqli_query($con,"DELETE FROM mbira_area_media WHERE area_id='$id' AND isThumb = 'yes' AND (description IS NULL) ");
}

function saveThumbnail($con) {
	$id = $_POST['aid'];
	$project_id = $_POST['project'];

	$thumbCanvasData = $_POST['thumbCanvasData'];
	$thumbCropData = $_POST['thumbCropData'];

	if ($_POST['type'] == 'new') {
		cleanDb($con, $id);
		$name = explode('.', basename($_FILES['file']['name']));

		$uploaddir = '../../media/images/project'.$project_id.'/areas/'.$id.'/';

		$uniqid = uniqid();
		$uploadfile = $uploaddir .$uniqid.'.'.$name[count($name)-1];
		move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);
		$file_path = 'media/images/project'.$project_id.'/areas/'.$id.'/'.$uniqid.'.'.$name[count($name)-1];

		$thumb_file_ext = explode('/', $_FILES['croppedThumbnail']['type'])[1];
		$thumb_uploadfile = $uploaddir .$uniqid.'_thumb.'.$thumb_file_ext;
		move_uploaded_file($_FILES['croppedThumbnail']['tmp_name'], $thumb_uploadfile);
		$thumb_file_path = 'media/images/project'.$project_id.'/areas/'.$id.'/'.$uniqid.'_thumb.'.$thumb_file_ext;	

		mysqli_query($con,"INSERT INTO mbira_area_media (area_id, file_path, thumb_path, isThumb, thumbCanvasData, thumbCropData, cropped_image_path, imageCanvasData, imageCropData, title, alt_desc, description) VALUES ('$id', '$file_path', '$thumb_file_path', 'yes', '$thumbCanvasData', '$thumbCropData', null, null, null, null, null, null)"); 

		$sql = "UPDATE mbira_areas SET thumb_path='".$thumb_file_path."' WHERE id=".$id;
		mysqli_query($con, $sql);

		mysqli_query($con,"DELETE FROM mbira_area_media WHERE area_id='$id' AND file_path='app/assets/images/Default.png'");
	} else {
		$areaResult = mysqli_query($con,"SELECT file_path, thumb_path FROM mbira_area_media WHERE area_id='$id' AND isThumb = 'yes'");
		while($areaRow = mysqli_fetch_array($areaResult)) {
			$file_path = $areaRow['file_path'];
			unlink("../../".$areaRow['thumb_path']); //remove the file
		}

		$f_path = explode('/', $file_path);
		$last_element = end($f_path);
		$temp_array = explode('.', $last_element );
		$uniqid = $temp_array[0];

		$thumb_file_ext = explode('/', $_FILES['croppedThumbnail']['type'])[1];
		$thumb_uploadfile = $uploaddir .$uniqid.'_thumb.'.$thumb_file_ext;

		move_uploaded_file($_FILES['croppedThumbnail']['tmp_name'], $thumb_uploadfile);
		mysqli_query($con, "UPDATE mbira_area_media SET thumbCanvasData='$thumbCanvasData', thumbCropData='$thumbCropData' WHERE area_id='$id' AND isThumb='yes'");

	}

}

function saveThumbnailWithMedia($con) {
	$id = $_POST['aid'];
	$project_id = $_POST['project'];

	$thumbCanvasData = $_POST['thumbCanvasData'];
	$thumbCropData = $_POST['thumbCropData'];
	$title = $_POST['title'];
	$altDesc = $_POST['altDesc'];
	$description = $_POST['description'];
	$uploaddir = '../../media/images/project'.$project_id.'/areas/'.$id.'/';

	if ($_POST['type'] == 'new') {
		cleanDb($con, $id);
		$name = explode('.', basename($_FILES['file']['name']));

		$uploaddir = '../../media/images/project'.$project_id.'/areas/'.$id.'/';

		$uniqid = uniqid();
		$uploadfile = $uploaddir .$uniqid.'.'.$name[count($name)-1];
		move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);
		$file_path = 'media/images/project'.$project_id.'/areas/'.$id.'/'.$uniqid.'.'.$name[count($name)-1];

		$thumb_file_ext = explode('/', $_FILES['croppedThumbnail']['type'])[1];
		$thumb_uploadfile = $uploaddir .$uniqid.'_thumb.'.$thumb_file_ext;
		move_uploaded_file($_FILES['croppedThumbnail']['tmp_name'], $thumb_uploadfile);
		$thumb_file_path = 'media/images/project'.$project_id.'/areas/'.$id.'/'.$uniqid.'_thumb.'.$thumb_file_ext;	

		if ($_FILES['croppedImage']) {
			$crop_file_ext = explode('/', $_FILES['croppedImage']['type'])[1];
			$crop_uploadfile = $uploaddir .$uniqid.'_cropped.'.$crop_file_ext;
			unlink($crop_uploadfile); //remove the file
			move_uploaded_file($_FILES['croppedImage']['tmp_name'], $crop_uploadfile);
			$crop_file_path = 'media/images/project'.$project_id.'/areas/'.$id.'/'.$uniqid.'_cropped.'.$crop_file_ext;

			$imageCanvasData = $_POST['imageCanvasData'];
			$imageCropData = $_POST['imageCropData'];
		}

		mysqli_query($con,"INSERT INTO mbira_area_media (area_id, file_path, thumb_path, isThumb, thumbCanvasData, thumbCropData, cropped_image_path, imageCanvasData, imageCropData, title, alt_desc, description) VALUES ('$id', '$file_path', '$thumb_file_path', 'yes', '$thumbCanvasData', '$thumbCropData', '$crop_file_path', '$imageCanvasData', '$imageCropData', '$title', '$altDesc', '$description')"); 

		$sql = "UPDATE mbira_areas SET thumb_path='".$thumb_file_path."' WHERE id=".$id;
		mysqli_query($con, $sql);

		mysqli_query($con,"DELETE FROM mbira_area_media WHERE area_id='$id' AND file_path='app/assets/images/Default.png'");
	} else {
		$areaResult = mysqli_query($con,"SELECT file_path, thumb_path, cropped_image_path FROM mbira_area_media WHERE area_id='$id' AND isThumb = 'yes'");
		while($areaRow = mysqli_fetch_array($areaResult)) {
			$file_path = $areaRow['file_path'];
			unlink("../../".$areaRow['thumb_path']); //remove the file
			$crop_path_old = $areaRow['cropped_image_path'];
			
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
			unlink("../../".$crop_path_old); //remove the file

			$crop_file_ext = explode('/', $_FILES['croppedImage']['type'])[1];
			$crop_uploadfile = $uploaddir .$uniqid.'_cropped.'.$crop_file_ext;

			move_uploaded_file($_FILES['croppedImage']['tmp_name'], $crop_uploadfile);
			$crop_file_path = 'media/images/project'.$project_id.'/areas/'.$id.'/'.$uniqid.'_cropped.'.$crop_file_ext;

			$imageCanvasData = $_POST['imageCanvasData'];
			$imageCropData = $_POST['imageCropData'];
		}

		mysqli_query($con, "UPDATE mbira_area_media SET imageCanvasData='$imageCanvasData', imageCropData='$imageCropData', cropped_image_path='$crop_file_path', thumbCanvasData='$thumbCanvasData', thumbCropData='$thumbCropData', title='$title', alt_desc='$altDesc', description='$description' WHERE area_id='$id' AND isThumb='yes'");
	}
}

function byProject($con) {
	$id = $_POST['id'];
	$results = mysqli_query($con, "SELECT * FROM mbira_areas WHERE project_id = '$id'");
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