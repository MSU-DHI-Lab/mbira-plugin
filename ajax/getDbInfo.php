<?php
	require_once('../../pluginsConfig.php');

	echo json_encode([$dbhost, $dbuser, $dbpass, $dbname]);