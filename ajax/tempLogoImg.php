<?php
	$id = "";
	if(isset($_POST['id'])) {
		$id = $_POST['id'];
	}

	if (!file_exists('../tmp')) {
	    mkdir('../tmp', 0775, true);
	}

	$uploadfile = "../tmp/temp_logo".$id.".jpg";
	move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);

?>