<!DOCTYPE html>
<html>
   <head>
       <link rel="stylesheet" type="text/css" href="css/location_all.css"/>
   </head>
   <body ng-app="mbira">
       <div class="header">
           <h1>LOCATIONS</h1>
       </div>
       <div class="locations" ng-controller='viewLocationsCtrl'>
           <div class="project" ng-repeat='project in projects'>

                <div class="project_title">
                    <h3>
                        {{project.name}}
                    </h3>
                    <div class="link-wrapper">
                        <a ui-sref="projectInfo({project: project.id, pid: pid, previous: 'ALL LOCATIONS'})" >
                            <img src="img/info.png">
                        </a>
                        <a ui-sref="viewProject({project: project.id, pid: project.pid, previous: 'ALL LOCATIONS'})">
                            <img class="viewProject" src="img/ProjectOptions.svg" height="25px">
                        </a>
                    </div>
                </div>
                <div class="location" ng-repeat='location in project.locations' ng-class-odd="'odd'" ng-class-even="'even'">
                  <a ui-sref="viewLocation({location: location.id, pid: location.pid, project: location.project_id, previous: 'ALL LOCATIONS'})">
                    <div class="location-wrapper">
                        <div class="location_title">
                            <h3>
                                {{location.name}}
                            </h3>
                        </div>
                        <div class="description">
                            {{location.description}}
                        </div>
                    </div>
<!--                         <div class="forward-wrapper">

                            <img src="img/forward.png">

                    </div> -->
                  </a>
                </div>
               <div class="odd none" ng-show="!project.locations.length">
                   <h3>No Locations</h3>
               </div>
           </div>
       </div>
   </body>
</html>
