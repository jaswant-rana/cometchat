<?php

/*

CometChat
Copyright (c) 2016 Inscripts

CometChat ('the Software') is a copyrighted work of authorship. Inscripts
retains ownership of the Software and any copies of it, regardless of the
form in which the copies may exist. This license is not a sale of the
original Software or any copies.

By installing and using CometChat on your server, you agree to the following
terms and conditions. Such agreement is either on your own behalf or on behalf
of any corporate entity which employs you or which you represent
('Corporate Licensee'). In this Agreement, 'you' includes both the reader
and any Corporate Licensee and 'Inscripts' means Inscripts (I) Private Limited:

CometChat license grants you the right to run one instance (a single installation)
of the Software on one web server and one web site for each license purchased.
Each license may power one instance of the Software on one domain. For each
installed instance of the Software, a separate license is required.
The Software is licensed only to you. You may not rent, lease, sublicense, sell,
assign, pledge, transfer or otherwise dispose of the Software in any form, on
a temporary or permanent basis, without the prior written consent of Inscripts.

The license is effective until terminated. You may terminate it
at any time by uninstalling the Software and destroying any copies in any form.

The Software source code may be altered (at your risk)

All Software copyright notices within the scripts must remain unchanged (and visible).

The Software may not be used for anything that would represent or is associated
with an Intellectual Property violation, including, but not limited to,
engaging in any activity that infringes or misappropriates the intellectual property
rights of others, including copyrights, trademarks, service marks, trade secrets,
software piracy, and patents held by individuals, corporations, or other entities.

If any of the terms of this Agreement are violated, Inscripts reserves the right
to revoke the Software license at any time.

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

include_once(dirname(dirname(dirname(__FILE__))).DIRECTORY_SEPARATOR."plugins.php");
include_once(dirname(__FILE__).DIRECTORY_SEPARATOR."config.php");

include_once(dirname(__FILE__).DIRECTORY_SEPARATOR."lang".DIRECTORY_SEPARATOR."en.php");
if (file_exists(dirname(__FILE__).DIRECTORY_SEPARATOR."lang".DIRECTORY_SEPARATOR.$lang.".php")) {
	include_once(dirname(__FILE__).DIRECTORY_SEPARATOR."lang".DIRECTORY_SEPARATOR.$lang.".php");
}

if ($p_<3) exit;

if ($drawPluginType=='1' && empty($hostAddress)) {
	echo "<div style='background:white;'>Please configure this plugin using administration panel before using. <a href='http://www.cometchat.com/documentation/admin/plugins/whiteboard-plugin/' target='_blank'>Click here</a> for more information.</div>";
	exit;
}

if ($_REQUEST['action'] == 'request') {
	sendMessage($_REQUEST['to'],$whiteboard_language[2]." <a href='javascript:void(0);' class='accept_White' to='".$userid."' random='".$_REQUEST['id']."' chatroommode='0' mobileAction=\"javascript:jqcc.ccwhiteboard.accept('".$userid."','".$_REQUEST['id']."');\">".$whiteboard_language[3]."</a> ".$whiteboard_language[4],1);

	sendMessage($_REQUEST['to'],$whiteboard_language[5],2);


	if (!empty($_REQUEST['callback'])) {
		header('content-type: application/json; charset=utf-8');
		echo $_REQUEST['callback'].'()';
	}

}

if ($_REQUEST['action'] == 'accept') {
	sendMessage($_REQUEST['to'],$whiteboard_language[6],1);

	if (!empty($_REQUEST['callback'])) {
		header('content-type: application/json; charset=utf-8');
		echo $_REQUEST['callback'].'()';
	}
}

if ($_REQUEST['action'] == 'whiteboard') {

	$id = $_REQUEST['id'];
	$type = 'whiteboard';
	if($drawPluginType == '1') {
		if (!empty($_REQUEST['chatroommode'])) {
			if (!empty($_REQUEST['subaction'])) {
			sendChatroomMessage($_REQUEST['id'],$whiteboard_language[7]." <a href='javascript:void(0);' class='accept_White' to='".$id."' random='0' room='' chatroommode='1' mobileAction=\"javascript:jqcc.ccwhiteboard.accept('".$id."','0','".$_REQUEST['chatroommode']."');\">".$whiteboard_language[8]."</a>",0);
			}
			$id .= "chatroom";

		} else{
	        if($userid < $id) {
	            $id =  md5(md5($userid).md5($id))."users";
	        } else {
	            $id =  md5(md5($id).md5($userid))."users";
	        }
	        if(!empty($_REQUEST['random'])){
				sendMessage($_REQUEST['id'],$whiteboard_language[5],2);
				incrementCallback();
		        sendMessage($_REQUEST['id'],$whiteboard_language[2]." <a href='javascript:void(0);' class='accept_White' to='".$userid."' random='".$_REQUEST['random']."' room='' chatroommode='0' mobileAction=\"javascript:jqcc.ccwhiteboard.accept('".$userid."','".$_REQUEST['random']."');\">".$whiteboard_language[3]."</a> ".$whiteboard_language[4],1);
			}
		}
		ini_set('display_errors', 0);

		$displayName = "Unknown".rand(0,999);
		$username = $displayName;

	    $sql = getUserDetails($userid);

		if ($guestsMode && $userid >= 10000000) {
			$sql = getGuestDetails($userid);
		}

		$result = mysqli_query($GLOBALS['dbh'],$sql);

		if($row = mysqli_fetch_assoc($result)) {

			if (function_exists('processName')) {
				$row['username'] = processName($row['username']);
			}

			$displayName = $row['username'];
			$username = $row['username'];
		}

		$role = 0;

		if(!empty($port)) {
			$connectUrl = "rtmp://" . $hostAddress .":".$port. "/" . $application;
		}else{
			$connectUrl = "rtmp://" . $hostAddress . "/" . $application;
		}

		$baseURL = str_replace('_','',str_replace(':','_', str_replace('.','_',str_replace('/','_',BASE_URL.$_SERVER['SERVER_NAME']))));
		$connectUrl = "{$connectUrl}/{$id}";
		$boundry_limit = "{$whiteboard_language[10]}";

echo <<<EOD
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="user-scalable=1,width=device-width, initial-scale=1.0" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<title>{$whiteboard_language[0]}</title>
<style>
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, font, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td {
	margin: 0;
	padding: 0;
	border: 0;
	outline: 0;
	font-weight: inherit;
	font-style: inherit;
	font-size: 100%;
	font-family: inherit;
	vertical-align: baseline;
    text-align: center;
}

html {
  height: 100%;
  overflow: hidden; /* Hides scrollbar in IE */
}

body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#flashcontent {
  height: 100%;
}

#whiteboard {
  width: 100%;
  height:100%;
}


</style>
  <script src="../../js.php?type=core&name=jquery"></script>
  <script>
  	$ = jQuery = jqcc;
  </script>
  <script type="text/javascript" src="../../js.php?type=plugin&name=whiteboard"></script>

        <script type="text/javascript">
            var swfVersionStr = "10.1.0";
            var xiSwfUrlStr = "playerProductInstall.swf";
            var flashvars = {connectUrl: "{$connectUrl}", whitebWidth: {$whitebWidth}, whitebHeight: {$whitebHeight}, boundrylang: "{$boundry_limit}" };
            var params = {};
            params.quality = "high";
            params.bgcolor = "#000000";
            params.allowscriptaccess = "sameDomain";
            params.allowfullscreen = "true";
			params.wmode = "transparent";
            var attributes = {};
            attributes.id = "whiteboard";
            attributes.name = "whiteboard";
            attributes.align = "middle";
            swfobject.embedSWF(
                "whiteboard.swf", "flashContent",
                "{$whitebWidth}", "{$whitebHeight}",
                swfVersionStr, xiSwfUrlStr,
                flashvars, params, attributes);
			swfobject.createCSS("#flashContent", "display:block;text-align:left;");
        </script>

</head>
<body>


  <div id="flashContent">
        	<p>
	        	To view this page ensure that Adobe Flash Player version
				10.1.0 or greater is installed.
			</p>
			<script type="text/javascript">
				var pageHost = ((document.location.protocol == "https:") ? "https://" :	"http://");
				document.write("<a href='http://www.adobe.com/go/getflashplayer'><img src='"
								+ pageHost + "www.adobe.com/images/shared/download_buttons/get_flash_player.gif' alt='Get Adobe Flash player' /></a>" );
			</script>
        </div>
</body>
</html>
EOD;
	} else if($drawPluginType == '0') {
		$id = $_REQUEST['id'];
		if(!empty($_REQUEST['room']) && $_REQUEST['room']!=''){
			$room = $_REQUEST['room'];
		}else{
			$room = "whiteboard".$id.rand();
			$room = md5($room);
		}
		if (!empty($_REQUEST['chatroommode'])) {
			if (!empty($_REQUEST['subaction'])) {
			sendChatroomMessage($_REQUEST['id'],$whiteboard_language[7]." <a href='javascript:void(0);' class='accept_White' to='".$id."' random='0' room='".$room."' chatroommode='1' mobileAction=\"javascript:jqcc.ccwhiteboard.accept('".$id."','0','".$_REQUEST['chatroommode']."','".$room."');\">".$whiteboard_language[8]."</a>",0);
			}
		} else {
			if(!empty($_REQUEST['random'])){
				sendMessage($_REQUEST['id'],$whiteboard_language[5],2);
				incrementCallback();
		        sendMessage($_REQUEST['id'],$whiteboard_language[2]." <a href='javascript:void(0);' class='accept_White' to='".$userid."' random='".$_REQUEST['random']."' room='".$room."' chatroommode='0' mobileAction=\"javascript:jqcc.ccwhiteboard.accept('".$userid."','".$_REQUEST['random']."','".$room."');\">".$whiteboard_language[3]."</a> ".$whiteboard_language[4],1);
			}
		}
		if(!empty($_REQUEST['callbackfn']) && $_REQUEST['callbackfn'] == 'mobileapp'){
			header('content-type: application/json; charset=utf-8');
			echo json_encode(array('room'=>$room));
		} else{
echo <<<EOD
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="user-scalable=1,width=device-width, initial-scale=1.0" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<title>{$whiteboard_language[0]}</title>
<style>
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, font, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td {
	margin: 0;
	padding: 0;
	border: 0;
	outline: 0;
	font-weight: inherit;
	font-style: inherit;
	font-size: 100%;
	font-family: inherit;
	vertical-align: baseline;
    text-align: center;
}

html {
  height: 100%;
  overflow: hidden; /* Hides scrollbar in IE */
}

body {
  height: 100%;
  margin: 0;
  padding: 0;
}

</style>
<script>
	function resizePopup(){
		window.resizeTo(754, 612);
	}
</script>
</head>
<body onload="resizePopup()">
	<iframe src="{$drawURL}/d/draw-{$room}" width="100%" height="100%" frameborder="0">
</body>
</html>
EOD;
	}
}
}