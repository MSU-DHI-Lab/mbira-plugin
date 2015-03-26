<!DOCTYPE html>
<html>
    <head>
    	<link rel="stylesheet" type="text/css" href="css/user_all.css"/>
    </head>
	<body ng-app="mbira">

		<div class="header">
			<h1>USERS</h1>
		</div>
		
		<div class="users" ng-controller='viewUsersCtrl'>
			<div class="project" ng-repeat='project in projects'>
				<div class="project_title"><a ui-sref="viewProject({project: project.id, pid: project.pid})"><div><h3>{{project.name}}</h3></div></a>
				<a ui-sref="addUsers({project: project.id, pid: project.pid})"><img class="addUser" src='img/project_new_plus_icon.png'></a>
				</div>
				<div class="user" ng-repeat='user in project.users' ng-class-odd="'odd'" ng-class-even="'even'">
					<a><img class="removeUser" src='img/remove_x.png'></a>
					<a ui-sref="viewUser({user: user.id, pid: user.pid, project: user.project_id, previous: 'ALL USERS'})"> 
						<div class="user_title"><h3>{{user.firstName}} {{user.lastName}}</h3></div>
						<div class="username">{{user.username}}</div>
					</a>
					<div>
					    <div ng-click='toggle(user.email, user.isExpert)' ng-if="user.isExpert == 'true'">
						  Expert
					    </div>
					    <div ng-click='toggle(user.email, user.isExpert)' ng-if="user.isExpert == 'false'">
						  Not Expert
					    </div>
					</div>
				</div>
			</div>
	
		</div>

	</body>
</html>