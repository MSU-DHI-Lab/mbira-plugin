<?php

/**
Copyright (2008) Matrix: Michigan State University

This file is part of KORA.

KORA is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

KORA is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>. */

require_once("../../pluginsConfig.php");

//chdir(basePathPlugin. "../");
//require_once(basePathPlugin.'includes/includes.php');
//chdir(basePathPlugin . "plugins");


if (!defined('sessionTimeout')) define('sessionTimeout', 30*60);
ini_set('session.gc_maxlifetime',sessionTimeout);
@session_start();
  
 // THESE SHOULD BE CONSTANT
require_once(basePathPlugin.'includes/conf.php');
require_once(basePathPlugin.'includes/utilities.php');
require_once(basePathPlugin.'includes/gettextSupport.php');

// WHICH OF THESE WILL WE DEPRECIATE OVER TIME?
require_once(basePathPlugin.'includes/clientUtilities.php');

// NOW ALL OF THE CONTROL CLASSES GET INCLUDED
require_once(basePathPlugin.'model/manager.php');
require_once(basePathPlugin.'model/project.php');
require_once(basePathPlugin.'model/scheme.php');
require_once(basePathPlugin.'model/record.php');
require_once(basePathPlugin.'model/user.php');
require_once(basePathPlugin.'model/controlcollection.php');
require_once(basePathPlugin.'model/search.php');
require_once(basePathPlugin.'model/importer.php');

// NOW ALL OF THE CONTROL CLASSES GET INCLUDED
require_once(basePathPlugin.'controls/control.php');
foreach (glob(basePathPlugin."controls/*.php") as $filename)
{ if ($filename != basePathPlugin.'controls/index.php') { require_once($filename); } }

// reCAPTCHA
require_once(basePathPlugin.'includes/recaptcha/recaptchalib.php');

// Test for PHP5
if (!version_compare(PHP_VERSION, '5.1.3', '>=')) {
	die(gettext('You must have PHP 5.1.3 or later installed to use KORA.  You currently have version ').PHP_VERSION);
}

// Test for GetText
if( !extension_loaded('gettext')) {
	die("Gettext must be enabled - please enable <a href='http://us3.php.net/manual/en/book.gettext.php'>gettext</a> for PHP ");
}

// Test for Magic Quotes
if (get_magic_quotes_gpc()) die(gettext('Error').': '.gettext('Magic Quotes are enabled.  Please disable magic_quotes_gpc in php.ini.'));

// Test for DB connection
if (isset($dbhost) && isset($dbuser) && isset($dbpass) && isset($dbname))
{
	global $db;
    $db = new mysqli($dbhost, $dbuser, $dbpass, $dbname);

    if (mysqli_connect_errno())
    {
        die(gettext('Cannot connect to the database.  Please verify your configuration settings.'));
    }
    else
    {
        $db->set_charset('utf8');
        $mysql_version = $db->query('SELECT VERSION() as version');
        $mysql_version = $mysql_version->fetch_assoc();
        if (!version_compare($mysql_version['version'], '5.0.3', '>='))
        {
            die(gettext('You must have at least MySQL 5.0.3 installed to use KORA.  You currently have version ').$mysql_version['version']);
        }
    }
}

//some semi-configurable options
//define('CONTROL_DIR',"controls/");
//define('DUBLIN_CORE_CONFIG',"dublinCoreConfig.xml");

//define('HASH_METHOD', 'sha512');
//define('HASH_HEX_SIZE','128');

// permissions model constants
// these should all be powers of 2 to allow for the use of bitwise operations
// define('PROJECT_ADMIN',  1);
// define('INGEST_RECORD',  2);
// define('DELETE_RECORD',  4);
// define('EDIT_LAYOUT',    8);
// define('CREATE_SCHEME', 16);
// define('DELETE_SCHEME', 32);
// define('EXPORT_SCHEME', 64);
// define('MODERATOR',    128);	//permission to approve/deny publically ingested records

// SYSTEM WILL BREAK EXPORT DOWNLOADS LARGER THAN THIS INTO PARTS 
//define('KORA_MAXEXPORTZIPSIZE', 4294967296); // 4GB

//define('KORA_VERSION', '2.5.0');
//define('LATEST_DB_VERSION', '2.5.0');

//reCAPTCHA keys, used for public ingestion
//define('PUBLIC_KEY', '6LdsI_YSAAAAAJCMAC48DQh8agNipar9166E9TvZ');
//define('PRIVATE_KEY','6LdsI_YSAAAAAIQa8UhJ3OwX7IlwHm-Ar3J2Ktre');

// the number of pages adjacent to the current page that will be shown in the
// breadcrumb navigation for search results.  Also, when used in the pagination
// algorihtm, this doesn't work quite as simply as "adjacent pages shown", especially
// when viewing the first few or last few pages.  3 is a good number; any higher is
// probably a bad idea.  2 could work, but 3 is fine.
//define('ADJACENT_PAGES_SHOWN', 3);

// The number of results that will be shown in the "View All" option for Project Admins
//define('RESULTS_IN_VIEWALL_PAGE', 250);

// the mysql max int. it's not the same as the php max int.
if(!defined('MAX_INT_MYSQL')){
	define('MAX_INT_MYSQL', 4294967295);
}

// Invalid control names
//
// When adding values to this list, please put them in all caps as
// names are convereted to upper-case before being checked against this list
// to avoid confusion with case-sensitive variations of reserved keywords.
// Also, always document why a keyword is reserved.
global $invalidControlNames;
$invalidControlNames = array(
    'ANY',      // reserved keyword for searching
    'ALL',      // reserved keyword for searching
    'KID',      // reserved keyword for searching
    'LINKERS',  // reserved keyword for search results
    'PID',      // reserved keyword for search results
    'SCHEMEID', // reserved keyword for search results
);
if (!defined('sessionTimeout')) define('sessionTimeout', 30*60);
ini_set('session.gc_maxlifetime',sessionTimeout);
@session_start(); 
?>