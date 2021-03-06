<?php

include_once(dirname(__FILE__).DIRECTORY_SEPARATOR.'config.php');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* SETTINGS START */

$announcementpushid = setConfigValue('announcementpushid','');

/* SETTINGS END */

$noOfAnnouncements = 10;	// The number of latest announcements to be displayed

$announcementpushchannel = $announcementpushid;
if(empty($announcementpushchannel)){
	if(preg_match('/www\./', $_SERVER['HTTP_HOST'])) {
		$announcementpushchannel .= $_SERVER['HTTP_HOST'];
	}else {
		$announcementpushchannel .= 'www.'.$_SERVER['HTTP_HOST'];
	}
}

$announcementpushchannel = "ANN_".md5($announcementpushchannel);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////