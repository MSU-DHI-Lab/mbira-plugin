<!DOCTYPE html>
<html>
    <head>
    	<link rel="stylesheet" type="text/css" href="app/assets/stylesheets/notifications.css"/>
    </head>
	<body ng-app="mbira">		
		<div class="notifications" ng-controller='viewNotificationsCtrl'>

			<div class="header">
				<h1>NOTIFICATIONS</h1>
			</div>

			<div class="notifs-wrap">
				<a ui-sref="viewLocation({location: location.id, pid: location.pid, project: location.project_id, previous: 'ALL LOCATIONS'})" ng-repeat='notif in notifications'>
					<div class="notif-wrap flex wrap-row align-center">
						<div class="notif-icon flex align-center center">
							<i ng-if="notif['type'] == 'comment'" class="fa fa-comments-o" aria-hidden="true"></i>
							<i ng-if="notif['type'] == 'media'" class="fa fa-camera" aria-hidden="true"></i>
						</div>
						<div class="notif-text flex align-center start">{{notif['name']}} {{ notif['reply'] ? 'replied to a comment' : 'commented' }} in the {{notif['place']}} "{{notif['place_name']}}"</div>
						<div class="notif-date flex align-center center">{{notif['date']}}</div>
						<div class="notif-chevron flex align-center center"><i class="fa fa-chevron-right" aria-hidden="true"></i></div>
					</div>
				</a>
			</div>

<!-- 			<div class="notifs-wrap">
				<div class="old-notif-wrap flex wrap-row align-center" ng-repeat='a in [1,2,3,4]' ng-class-odd="'old-notif-odd'" ng-class-even="'old-notif-even'">
					<div class="old-notif-icon flex align-center center"><i class="fa fa-comments-o" aria-hidden="true"></i></div>
					<div class="notif-text flex align-center start">Bogdan replied to a comment in the location "Ex"</div>
					<div class="notif-date flex align-center center">8.14.15</div>
					<div class="notif-chevron flex align-center center"><i class="fa fa-chevron-right" aria-hidden="true"></i></div>
				</div>
			</div> -->
	
		</div>

	</body>
</html>