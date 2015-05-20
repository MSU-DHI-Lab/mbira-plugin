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
					<a><img ng-click='deleteUser(user)' class="removeUser" src='img/remove_x.png'></a>
					<a ui-sref="viewUser({user: user.id, previous: 'ALL USERS'})"> 
						<div class="user_title"><h3>{{user.firstName}} {{user.lastName}}</h3></div>
						<div class="username">{{user.username}}</div>
					</a>
					<div class="badges">
					    <div ng-click='toggle(user.email, user.isExpert, user.project, user.id, "citExp")' ng-if="user.isExpert == 'citExp'">
						  <img src='img/citizenExpert.png'>
					    </div>
					    <div ng-click='toggle(user.email, user.isExpert, user.project, user.id, "citExp")' ng-if="user.isExpert != 'citExp'">
						  <img src='img/citizenExpert.png' style='opacity:.5'>
					    </div>
                        
                        <div ng-click='toggle(user.email, user.isExpert, user.project, user.id, "projExp")' ng-if="user.isExpert == 'projExp'">
						  <img src='img/projectExpert.png'>
					    </div>
					    <div ng-click='toggle(user.email, user.isExpert, user.project, user.id, "projExp")' ng-if="user.isExpert != 'projExp'">
						  <img src='img/projectExpert.png' style='opacity:.5'>
					    </div>

					    <div ng-click='toggle(user.email, user.isExpert, user.project, user.id, "projMem")' ng-if="user.isExpert == 'projMem'">
						  <img src='img/projectPerson.png'>
					    </div>
					    <div ng-click='toggle(user.email, user.isExpert, user.project, user.id, "projMem")' ng-if="user.isExpert != 'projMem'">
						  <img src='img/projectPerson.png' style='opacity:.5'>
					    </div>

					    
					</div>
				</div>
			</div>
	
		</div>

	</body>
</html>