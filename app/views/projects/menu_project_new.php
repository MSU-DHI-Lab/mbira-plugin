<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" type="text/css" href="css/newproject.css"/>
        <link rel="stylesheet" type="text/css" href="app/assets/stylesheets/projects.css"/>
    </head>
    <body ng-app="mbira">
        <div class="header">
            <div class="back">
                <a onclick="window.history.go(-1); return false;">
                    <img src="app/assets/images/back.png"/>
                    <p>ALL PROJECTS</p>
                </a>
            </div>
            <h1>NEW PROJECT</h1>
        </div>
        <div class="main" ng-controller="newProjectCtrl">
            <div id="loading" class="loading">
                <div class="flex center wrap-column align-center" style="height:100%">
                    <div class="loader-inner ball-pulse">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <div class="loading-text"></div>
                </div>
            </div>
            <div id="media-modal-1" class="overlay" ng-click="resetCropper()">
                <div class="media-modal">
                    <div class="media-modal-header">
                        <div ng-show="mediaCheckBox" class="crop-steps animate-show flex wrap-row space-between">
                            <span class="modal-step" ng-class="{'current-step': modal.current == 'Thumbnail', 'pointer': modal.mode == 'edit'}" ng-click="modal.mode == 'edit' ? stepInto('Thumbnail', 533) : null">1. Thumbnail</span> 
                            <span class="modal-step" ng-class="{'current-step': modal.current == 'Crop', 'pointer': modal.mode == 'edit'}" ng-click="modal.mode == 'edit' ? stepInto('Crop', 533) : null">2. Crop</span> 
                            <span class="modal-step" ng-class="{'current-step': modal.current == 'Details', 'pointer': modal.mode == 'edit'}" ng-click="modal.mode == 'edit' ? stepInto('Details', 350) : null">3. Details</span>
                        </div>
                        <div class="close" ng-click="resetCropper()">&times;</div>
                    </div>
                    <div ng-show="modal.current == 'Thumbnail' || modal.current == 'Crop'" ng-include src="'app/views/media/partials/_thumbnail_image_crop.html'"></div>
                    <div class="animate-hide" id="details" ng-show="modal.current == 'Details'" ng-include src="'app/views/media/partials/_image_details.html'"></div>
                </div>
            </div>
            <form id="newprojectform" name="newprojectform" novalidate ng-submit="submit()" role="form">
                <div class="thumbnail-header dropzone projHeader">
                    <img class="headerImg" src="app/assets/images/Default-Header.png">
                    <div class="thumbnail_title">
                        <h3>{{"EDIT PROJECT HEADER"}}</h3>
                    </div>
                    <div class="form-group-file-header">                        
                        <input type="file" id="fileHeaderSelect" name="file" ng-file-select="onHeaderSelect($files)">
                    </div>
                </div>
                <div class="thumbnail dropzone">
                    <div class="thumbnail-img">
                        <img src="app/assets/images/Default.png" height="239" width="239">
                    </div>
                    <div class="thumbnail_title">
                        <h3>{{newProject.name || "Drop/Add Thumbnail"}}</h3>
                    </div>
                    <div class="form-group-file">
                        <input type="file" id="fileSelect" name="file" ng-file-select="onThumbSelect($files)">
                    </div>
                </div>
                <div class="thumbnail dropzone">
                    <img class="logoImg" src="app/assets/images/Default.png">
                    <div class="thumbnail_title">
                        <h3>{{"Drop/Add Logo"}}</h3>
                    </div>
                    <div class="form-group-file">                       
                        <input type="file" id="fileSelect" name="file" ng-file-select="onLogoSelect($files)">
                    </div>
                </div>
                <div class="">                        
                    <input type="text" required class="form-control npInput" id="name" name="name" ng-model="newProject.name" placeholder="Project Name">
                </div>
                <div class="short">
                    <textarea required class="form-control npInput short_inner" name="short" ng-model="newProject.shortDescription" medium-editor bind-options="{placeholder: {text: 'Short Project Description',hideOnClick: false}}" ng-change="getLength(newProject.shortDescription)" ></textarea>
                    <div class="counter">{{newProject.shortDescription_length}}/150</div>
                </div>
                <div class="">                        
                    <textarea required class="form-control npInput description" medium-editor bind-options="{placeholder: {text: 'About the Project',hideOnClick: false}}"name="description" ng-model="newProject.description" ></textarea>
                </div>
                <button type="submit" id="submit" class="btn btn-default" ng-disabled="newprojectform.$invalid" ng-class="{'btn-disabled': newprojectform.$invalid}">CREATE PROJECT</button>
            </form>
        </div>
        <script type='text/javascript'>
            $(".overlay *").click(function(e) {
                e.stopPropagation();
            });
            
            var cropper;
            
            var vtoggle = -1
            var htoggle = -1
            
            function toggleFlip(type) {
                if (type == "vertical") {
                    cropper.scaleY(vtoggle)
                    vtoggle == -1 ? vtoggle = 1 : vtoggle = -1;
                } else {
                    cropper.scaleX(htoggle)
                    htoggle == -1 ? htoggle = 1 : htoggle = -1;
                }
            }
            
        </script>
    </body>
</html>
