<?php
	$uploadfile = '../images/temp.jpg';
	move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);

?>