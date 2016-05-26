<?php

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$addonfolder = str_replace(DIRECTORY_SEPARATOR.'lang'.DIRECTORY_SEPARATOR.'en.php','', __FILE__);
$addonarray = explode(DIRECTORY_SEPARATOR, $addonfolder);
$addonname = end($addonarray);
$addontype = rtrim(prev($addonarray),'s');

/* LANGUAGE */

${$addonname.'_language'}['title'] 					= setLanguageValue('title','Share a collaborative document',$lang,$addontype,$addonname);
${$addonname.'_language'}['wait_message'] 			= setLanguageValue('wait_message','Please wait atleast 10 seconds before trying to share again.',$lang,$addontype,$addonname);
${$addonname.'_language'}['shared_document_other'] 	= setLanguageValue('shared_document_other','has shared a document.',$lang,$addontype,$addonname);
${$addonname.'_language'}['click_to_view'] 			= setLanguageValue('click_to_view','Click here to view the document',$lang,$addontype,$addonname);
${$addonname.'_language'}['ignore_message'] 		= setLanguageValue('ignore_message','or simply ignore this message.',$lang,$addontype,$addonname);
${$addonname.'_language'}['shared_document_self'] 	= setLanguageValue('shared_document_self','has successfully shared a document.',$lang,$addontype,$addonname);
${$addonname.'_language'}['viewing_document'] 		= setLanguageValue('viewing_document','is now viewing your document.',$lang,$addontype,$addonname);
${$addonname.'_language'}['collaborative_document'] = setLanguageValue('collaborative_document','Collaborative document',$lang,$addontype,$addonname);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


${$addonname.'_key_mapping'} = array(
	'0'		=>	'title',
	'1'		=>	'wait_message',
	'2'		=>	'shared_document_other',
	'3'		=>	'click_to_view',
	'4'		=>	'ignore_message',
	'5'		=>	'shared_document_self',
	'6'		=>	'viewing_document',
	'7'		=>	'collaborative_document'
);


${$addonname.'_language'} = mapLanguageKeys(${$addonname.'_language'},${$addonname.'_key_mapping'},$addontype,$addonname);