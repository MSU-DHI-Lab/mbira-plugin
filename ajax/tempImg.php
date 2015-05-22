<?php
	if(isset($_POST['id'])) {
		$id = $_POST['id'];
	} else {
			$id == "";
	}
	$uploadfile = "../images/temp".$id.".jpg";
	move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);

?>