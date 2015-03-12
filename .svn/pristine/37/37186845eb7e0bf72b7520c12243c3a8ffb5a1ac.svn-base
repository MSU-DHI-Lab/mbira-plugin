<!DOCTYPE html>
<html>
    <head>
	<!--	<link rel="stylesheet" type="text/css" href="css/project_all.css"/>-->
    </head>
	<body ng-app="mbira">

		<div class="header">
			<h1>NOTIFICATIONS</h1>
		</div>
		
		<div class="notifications" ng-controller='viewNotificationsCtrl'>
			<div class="notification" ng-repeat='notification in notifications' ng-class-odd="'odd'" ng-class-even="'even'">
				<a ui-sref="viewNotification({notification: notification.id, pid: notification.pid})"> 
					
					<div class="notification_title"><h3>{{notification.name}}</h3></div>
				</a>
			</div>
		</div>

	</body>
</html>