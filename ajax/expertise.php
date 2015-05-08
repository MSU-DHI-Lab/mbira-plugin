<?php
	require_once('../../pluginsConfig.php');
	
	$con=mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);
	// Check connection
	if (mysqli_connect_errno()) {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}
		
	function makeArray($project, $users, $usersInProjects) {
		$theArray = array();
		for($j=0;$j<count($usersInProjects);$j++){
			if ($project === $usersInProjects[$j]['mbira_projects_id']){
				for($q=0;$q<count($users);$q++){
					if ($usersInProjects[$j]['mbira_users_id'] == $users[$q]['id']){
						$users[$q]['isExpert'] = $usersInProjects[$j]['isExpert'];
						$users[$q]['project'] = $project;
						array_push($theArray, $users[$q]);
					}
				}
			}
		}
		return $theArray;
	}
	
	$userResults = mysqli_query($con, "SELECT * FROM mbira_users");
	$userResultsArray = Array();
	while($row = mysqli_fetch_array($userResults)) {
		array_push($userResultsArray, $row);
	}
	
	$uInProjResults = mysqli_query($con, "SELECT * FROM mbira_projects_has_mbira_users");
	$uInProjResultsArray = Array();
	while($row = mysqli_fetch_array($uInProjResults)) {
		array_push($uInProjResultsArray, $row);
	}
	
	$projResults = mysqli_query($con, "SELECT * FROM mbira_projects");
	$projResultsArray = Array();
	while($row = mysqli_fetch_array($projResults)) {
		array_push($projResultsArray, $row);

	
	}
	for($i=0;$i<count($projResultsArray);$i++){
		$userArray = makeArray($projResultsArray[$i]['id'], $userResultsArray, $uInProjResultsArray);
		$projResultsArray[$i]['users'] = $userArray;
	}
	
	echo json_encode($projResultsArray);
?>