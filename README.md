![mbira logo](http://mbira.matrix.msu.edu/wp-content/uploads/2015/03/Mbira_Logo_Horizontal.png "mbira logo")

mbira
=====

Currently in development at [MATRIX: The Center for Digital Humanities and Social Sciences](http://matrix.msu.edu), mbira is a platform to build, serve, and manage native and web-based mobile heritage experiences. The goal of the project is to create a constellation of open source tools (existing and purpose built) that will lower the technical bar for individuals, projects, and institutions interested in building rich, engaging, and sustainable place-based and mobile heritage experiences.  

###“Space and Landscape as Museum”###

Based on the metaphor of “space and landscape as museum,” mbira lets users create mobile experience in which locations and areas are organized into curated exhibits displayed within a rich, interactive map interface. Each exhibit location contains information and rich media (video, audio, and imagery) about that location and well as the narrative about the associated scholarly work (excavation, survey, historical and heritage research, etc)

###A Constellation of Open Source Tools###

1. Cloud-based Content Management System: mbira projects are created and managed using a cloud-based digital repository platform or CMS. All content (exhibits, locations, and location content) are added, edited, and updated from within an open source digital repository platform or CMS. When app creators or editors add new project content or edit existing project content, changes dynamically appear in the project’s public native mobile app or mobile website.  This public alpha release was developed to function on top of [KORA](http://kora.matrix.msu.edu).  The ultimate goal is to develop mbira for additional digital repository platforms and CMSs, such as [Omeka](http://www.omeka.org), [WordPress](http://wordpress.org), [Drupal](http://drupal.org), [ArchiveSpace](http://archivespace.org), and [Arches](http://archesproject.org)

2. mbira plugin: the mbira plugin (which is installed on top of the user’s chosen digital repository platform or content management system) is the core authoring environment in mbira’s constellation of open source tools. The mbira plugin facilitates the creation of mobile projects and their associated exhibits, as well as all locations, areas, and explorations (and their associated content).  The mbira plugin also allows creators and editors to manage all social aspects of their mobile applications. In addition, the plugin lets users manage all of the device specific deployments of their mobile heritage experience (iOS, Android, mobile-first responsive web).

3. Mobile Front-end Templates: the mbira constellation of tools includes elegantly designed (and well documented) native mobile (iOS and Android) and mobile-web stock templates that individuals, projects, or institutions can use as-is or modify as they see fit. While the templates are designed primarily for those with minimal programming experience, they can also serve as a project jump-start for more seasoned developers. The templates are built specifically to dynamically display content (exhibits, places, spaces, explorations) authored in the mbira plugin. As with all of the other components of the mbira platform, the mobile templates are available to users for free under an open source license. The mobile first responsive web templates will be built in HTML, CSS, PHP, and JavaScript.
 
###Current Development Status & Roadmap###

The initial phase of the project has focused (and will continue to focus) on developping the mbira authoring tool for [KORA](http://kora.matrix.msu.edu).  While the ultimate master plan is to develop for a variety of other digital repository platforms and content management systems (such as Omake, WordPress, Arches, and ArchiveSpace), we're a ways off from thinking about anything but KORA for now.  The current version of the mbira authoring tool should be considered alpha software.  It isn't feature complete and its got bugs.  However, we feel that it is at the point where people can start playing and experimenting with the platform.  **We are actively bug fixing and we strongly encourage people to sub issue and bug reports vit GitHub.**  

Here is what we have fully implemented:

* Creating, editing, and Creating deleting projects
* Creating, editing, and deleting exhibits
* Creating, editing, and deleting areas
* Creating, editing, and deleting locations
* Creating, editing, and deleting explorations

Here is what we've partially implemented (and are currently working to fully implement):

* Connecting mbira project with a mobile front end (currenlty working to implment connectively tonative Andorid front-end template.  Mobile first responsive web template and iOS template will hopefully be fuly implemented over the summer)

Here is what hasn't been implemented at all:

* Notifications
* User management

Known bugs (that we're working to fix):

* Popup on an area displays in the corner rather than the center
* UI styling is broken on Safari. Chrome is optimized
* When editing an area, the user can create a point inside the polygon but not outside. 
* Add Media feature does not work when you are creating a new Area
* Add Media feature does not work when you are creating a new Location

###Installation Instructions###

The current version of the mbira authoring tool requires [KORA 2.6.2](https://github.com/matrix-msu/kora)

Once you have downloaded and installed KORA, follow these instructions for instructions to install the mbira authoring plugin:

1. Create a folder called "mbira" (without the quotation marks) in the /plugins folder of your KORA installation
2. Copy the mbira plugin files to the root of the new /mbira folder
3. login to your KORA installation
4. Click on the Plugin Settings link in the KORA sidebar
5. Click the Activate link for the mbira plugin
6. you should be good to go!

###mbira Sandbox###

Want to play around with the current build of KORA's mbira authoring plugin (complete with all of the bugs and un-implemented features)?  Head on over to [mbira sandbox](http://mbira.matrix.msu.edu/try) to give it a test drive (username: demo & password: demodemo).
