<?php
	require_once('../../../pluginsConfig.php');
	$con = new PDO("mysql:dbname=$dbname;host=$dbhost;charset=utf8", $dbuser, $dbpass);
	$con->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
	$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	function random_salt($len = 16) {
		$chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()-=_+';
		$l = strlen($chars) - 1;
		$str = '';
		for ($i = 0; $i < $len; ++$i) {
			$str .= $chars[rand(0, $l)];
		}
		return $str;
	}

	function getComments($con) {
		$type = $_POST['type'];
		$id = $_POST['id'];
			
		$results = $con->prepare("SELECT id, user_id, ".$type."_id, replyTo, isPending, UNIX_TIMESTAMP(created_at), deleted, comment FROM mbira_".$type."_comments WHERE ".$type."_id=:id");
		$results -> execute(array('id' => $id));
		$resultArray = Array();

		foreach ($results as $row) {
		    array_push($resultArray, $row);
		}
		
		echo json_encode($resultArray);
	}

	function approve($con) {
		$id = $_POST['id'];
		$type = $_POST['type'];

		$results = $con->prepare("UPDATE mbira_".$type."_comments SET isPending=:pending WHERE id=:id");
		$results -> execute(array('id' => $id, 'pending' => 'no'));
	}

	function reinstate($con) {
		$id = $_POST['id'];
		$type = $_POST['type'];

		$results = $con->prepare("UPDATE mbira_".$type."_comments SET deleted=:deleted WHERE id=:id");
		$results -> execute(array('id' => $id, 'deleted' => 'no'));
	}

	function deleteRow($con) {
		$id = $_POST['id'];
		$type = $_POST['type'];

		$results = $con->prepare("UPDATE mbira_".$type."_comments SET isPending=:pending, deleted=:deleted WHERE id=:id");
		$results -> execute(array('id' => $id, 'pending' => 'no', 'deleted' => 'yes'));
	}

if($_POST['task'] == 'get'){
	getComments($con);
} else if($_POST['task'] == 'approve'){
	approve($con);
} else if($_POST['task'] == 'delete'){
	deleteRow($con);
} else if($_POST['task'] == 'reinstate'){
	reinstate($con);
}

?>
	
