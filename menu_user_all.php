<!DOCTYPE html>
<html>
    <head>
    	<link rel="stylesheet" type="text/css" href="css/user_all.css"/>
    </head>
	<body ng-app="mbira">

		<div class="header">
			<h1>USERS</h1>
            <div class="newUser"><a ui-sref="newUser"><img src="app/assets/images/plusicon.png" width="20px"/></a></div>
		</div>
		
		<div class="users" ng-controller='viewUsersCtrl'>
			
			<div class="project" ng-repeat='project in projects'>
				<div class="project_title"><a ui-sref="viewProject({project: project.id, pid: project.pid})"><div><h3>{{project.name}}</h3></div></a>
				<a ui-sref="addUsers({project: project.id, pid: project.pid})"><img class="addUser" src="app/assets/images/plusicon.png" width="15px"/></a>
				</div>
				<div class="user" ng-repeat='user in project.users' ng-class-odd="'odd'" ng-class-even="'even'">
					<div class="modUser">
						<a class="editUser" ui-sref="editUser({user: user.id, previous: 'ALL USERS'})"><i class="fa fa-pencil fa-1" aria-hidden="true"></i></a>
						<a class="removeUser"><i ng-click='deleteUser(user)' class="fa fa-times fa-1" aria-hidden="true"></i></a>
					</div>
					<a ui-sref="editUser({user: user.id, previous: 'ALL USERS'})"> 
						<div class="user_title"><h3>{{user.firstName}} {{user.lastName}}</h3></div>
						<div class="username">{{user.username}}</div>
					</a>
					<div class="badges">
					    <div ng-click='toggle(user.email, user.isExpert, user.project, user.id, "citExp")' ng-if="user.isExpert == 'citExp'">
						  <img src='app/assets/images/citizenExpert.png'>
					    </div>
					    <div ng-click='toggle(user.email, user.isExpert, user.project, user.id, "citExp")' ng-if="user.isExpert != 'citExp'">
						  <img src='app/assets/images/citizenExpert.png' style='opacity:.5'>
					    </div>
                        
                        <div ng-click='toggle(user.email, user.isExpert, user.project, user.id, "projExp")' ng-if="user.isExpert == 'projExp'">
						  <img src='app/assets/images/projectExpert.png'>
					    </div>
					    <div ng-click='toggle(user.email, user.isExpert, user.project, user.id, "projExp")' ng-if="user.isExpert != 'projExp'">
						  <img src='app/assets/images/projectExpert.png' style='opacity:.5'>
					    </div>

					    <div ng-click='toggle(user.email, user.isExpert, user.project, user.id, "projMem")' ng-if="user.isExpert == 'projMem'">
						  <img src='app/assets/images/projectPerson.png'>
					    </div>
					    <div ng-click='toggle(user.email, user.isExpert, user.project, user.id, "projMem")' ng-if="user.isExpert != 'projMem'">
						  <img src='app/assets/images/projectPerson.png' style='opacity:.5'>
					    </div>

					    
					</div>
				</div>
			</div>
	
		</div>

	</body>
</html>