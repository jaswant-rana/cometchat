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


?>

if (typeof(jqcc) === 'undefined') {
	jqcc = jQuery;
}
(function($) {
    var settings = {};
    settings = jqcc.cometchat.getcrAllVariables();
    var calleeAPI = jqcc.cometchat.getChatroomVars('calleeAPI');

    $.crstandard = (function() {
            return {
                playsound: function() {
                        try	{
                            document.getElementById('messageBeep').play();
                        } catch (error) {
                            jqcc.cometchat.setChatroomVars('messageBeep',0);
                        }
                },
                sendChatroomMessage: function(chatboxtextarea) {
                    $(chatboxtextarea).val('');
                    $(chatboxtextarea).css('height','18px');
                    var height = $[calleeAPI].crgetWindowHeight();
                    var contentDivHeight = height-parseInt($('.topbar').css('height'));
                    $("div.content_div").css('height',contentDivHeight);
                    var textareaHeight = parseInt($('textarea.cometchat_textarea').css('height')) + 4 + 4;//Padding + padding of container
                    var prependHeight = parseInt($('.cometchat_prependMessages_container').outerHeight(true));
                    $("#currentroom_convo").css('height',contentDivHeight-textareaHeight-prependHeight);
                    $("#currentroom_left").find("div.slimScrollDiv").css('height',$("#currentroom_convo").css('height'));
                    $(chatboxtextarea).css('overflow-y','hidden');
                    $(chatboxtextarea).focus();
                },
                createChatroom: function() {
                    $[calleeAPI].hidetabs();
                    jqcc.cometchat.setChatroomVars('currentroom',0);
                    var controlparameters = {"name":"open", "val":"0"};
                    jqcc.cometchat.setCrSessionVariable(controlparameters);
                    $('#createtab').addClass('tab_selected');
                    $('#create').css('display','block');
                    $('div.welcomemessage').html('<?php echo $chatrooms_language[5];?>');
                },
                getTimeDisplay: function(ts,id) {
                    var style ="style=\"display:none;\"";

                    if (typeof(jqcc.ccchattime)!='undefined' && jqcc.ccchattime.getEnabled(id,1)) {
                            style="style=\"display:inline-block;\"";
                    }
					var time = getTimeDisplay(ts);
					if (ts < jqcc.cometchat.getChatroomVars('todays12am')) {
							return "<span class=\"cometchat_ts\" "+style+">("+time.hour+":"+time.minute+time.ap+" "+time.date+time.type+" "+time.month+")</span>";
                    } else {
							return "<span class=\"cometchat_ts\" "+style+">("+time.hour+":"+time.minute+time.ap+")</span>";
                    }
                },
                addChatroomMessage: function(fromid,incomingmessage,incomingid,selfadded,sent,fromname,calledfromsend,chatroomid) {
                    if(typeof(fromname) === 'undefined' || fromname == 0 || fromid == settings.myid){
                        fromname = '<?php echo $chatrooms_language[6]; ?>';
                    }
                    var temp = '';
                    var lastMessageId = incomingid;
                    var crUnreadMessages = jqcc.cometchat.getChatroomVars('crUnreadMessages');
                    var chatroomreadmessages = jqcc.cometchat.getFromStorage("crreadmessages");
                    var receivedcrunreadmessages = jqcc.cometchat.getFromStorage('crreceivedunreadmessages');
                    var controlparameters = {"id":incomingid, "from":fromname, "fromid":fromid, "message":incomingmessage, "sent":sent};
                    if (calledfromsend != '1') {
                        settings.timestamp=incomingid;
                    }
                    separator = '<?php echo $chatrooms_language[7]; ?>';
                    var message = jqcc.cometchat.processcontrolmessage(controlparameters);
                    if(message != '' && chatroomid == jqcc.cometchat.getChatroomVars('currentroom')) {
                        if ($("#cometchat_message_"+incomingid).length > 0) {
                            $("#cometchat_message_"+incomingid).find("span.cometchat_chatboxmessagecontent").html(message);
                        } else {
                            sentdata = '';
                            if (sent != null) {
                                var ts = new Date(parseInt(sent));
                                sentdata = $[calleeAPI].getTimeDisplay(ts,incomingid);
                            }
                            if (fromid != settings.myid) {
                                temp += ('<div class="cometchat_chatboxmessage" id="cometchat_message_'+incomingid+'"><span class="cometchat_chatboxmessagefrom"><strong>');
                                if (jqcc.cometchat.getChatroomVars('checkBarEnabled')==1 && fromid != 0) {
                                    temp += ('<a href="javascript:void(0)" onclick="javascript:parent.jqcc.cometchat.chatWith(\''+fromid+'\');">');
                                }
                                temp += fromname+separator;
                                if (jqcc.cometchat.getChatroomVars('checkBarEnabled')==1 && fromid != 0) {
                                    temp += ('</a>');
                                }
                                temp += ('</strong></span><span class="cometchat_chatboxmessagecontent">'+message+'</span>'+sentdata+'</div>');
                            } else {
                                temp += ('<div class="cometchat_chatboxmessage" id="cometchat_message_'+incomingid+'"><span class="cometchat_chatboxmessagefrom"><strong>'+fromname+separator+'</strong></span><span class="cometchat_chatboxmessagecontent">'+message+'</span>'+sentdata+'</div>');
                            }
                            $("#currentroom_convotext").append(temp);
                            if ($.cookie(jqcc.cometchat.getChatroomVars('cookiePrefix')+"sound") && $.cookie(jqcc.cometchat.getChatroomVars('cookiePrefix')+"sound") == 'true') { } else {
                                $[calleeAPI].playsound();
                            }
                        }
                    }
                    if(jqcc.cometchat.getChatroomVars('owner')|| jqcc.cometchat.getChatroomVars('isModerator') || (jqcc.cometchat.getChatroomVars('allowDelete') == 1 && fromid == settings.myid)) {
                        if ($("#cometchat_message_"+incomingid).find("span.delete_msg").length < 1) {
                            jqcc('#cometchat_message_'+incomingid).find('span.cometchat_ts').after('<span class="delete_msg" onclick="javascript:jqcc.cometchat.confirmDelete(\''+incomingid+'\');">(<span class="hoverbraces"><?php echo $chatrooms_language[46]; ?></span>)</span>');
                        }
                        $(".cometchat_chatboxmessage").live("mouseover",function() {
                            $(this).find(".delete_msg").css('visibility','visible');
                        });
                        $(".cometchat_chatboxmessage").live("mouseout",function() {
                            $(this).find(".delete_msg").css('visibility','hidden');
                        });
                        $("span.delete_msg").mouseover(function() {
                            $(this).css('visibility','visible');
                        });
                    }
                    var forced = (fromid == settings.myid) ? 1 : 0;
                    if((message).indexOf('<img')!=-1 && (message).indexOf('src')!=-1){
                        $( "#cometchat_message_"+incomingid+" img" ).load(function() {
                            $[calleeAPI].chatroomScrollDown(forced);
                        });
                    }else{
                        $[calleeAPI].chatroomScrollDown(forced);
                    }

                    var chatroomFlag = 1;
                    if($.cookie(settings.cookiePrefix+'state')!=null) {
                        var cc_state = $.cookie(settings.cookiePrefix+'state');
                        var cc_states = cc_state.split(/:/);
                        if(cc_states[5]==' ' || cc_states[5]=='' || cc_states[5]!='chatrooms'){
                            chatroomFlag = 0;
                        }
                    }
                    if (message != '' && (chatroomid != jqcc.cometchat.getChatroomVars('currentroom') || chatroomFlag == 0) && (typeof(receivedcrunreadmessages[chatroomid])=='undefined' || receivedcrunreadmessages[chatroomid] < incomingid)){
                        if(!crUnreadMessages.hasOwnProperty(chatroomid)){
                            crUnreadMessages[chatroomid] = 1;
                        } else {
                            var newUnreadMessages = parseInt(crUnreadMessages[chatroomid]) + 1;
                            crUnreadMessages[chatroomid] = newUnreadMessages;
                        }
                        $[calleeAPI].updateCRReceivedUnreadMessages(chatroomid,incomingid);
                    }
                    jqcc.cometchat.setChatroomVars('crUnreadMessages',crUnreadMessages);
                    receivedcrunreadmessages = jqcc.cometchat.getFromStorage('crreceivedunreadmessages');
                    $.each(crUnreadMessages, function(chatroomid,unreadMessageCount) {
                        var chatroomreadmessagesId = chatroomreadmessages[chatroomid];
                        var receivedcrunreadmessagesId = receivedcrunreadmessages[chatroomid];
                        if(receivedcrunreadmessagesId != 'undefined'){
                            if(receivedcrunreadmessagesId > chatroomreadmessagesId){
                                $[calleeAPI].chatroomUnreadMessages(jqcc.cometchat.getChatroomVars('crUnreadMessages'),chatroomid);
                            }
                        }
                    });
                    if (typeof(jqcc[jqcc.cometchat.getChatroomVars('calleeAPI')].addMessageCounter) == "function"){
                        jqcc[jqcc.cometchat.getChatroomVars('calleeAPI')].addMessageCounter();
                    }

                    var popoutmode = 0;
                    if (settings.apiAccess == 1 && typeof (parent.jqcc.cometchat.setAlert) != 'undefined' && popoutmode == 0) {
                        if($.cookie(settings.cookiePrefix+'crstate') !== 'undefined' && $.cookie(settings.cookiePrefix+'crstate')!=null) {
                            var cc_crstate = JSON.parse($.cookie(settings.cookiePrefix+'crstate'));
                            var chatroomData = cc_crstate.active;
                            var messageCount = 0;
                            if(Object.keys(chatroomData).length > 0){
                                $.each(chatroomData, function(chatroomid,data) {
                                    messageCount = messageCount + parseInt(data.c);
                                });
                            }
                            parent.jqcc.cometchat.setAlert('chatrooms',messageCount);
                        }
                    }
                    $[calleeAPI].updateCRReadMessages(jqcc.cometchat.getChatroomVars('currentroom'));
                    var crreadmessages = jqcc.cometchat.getFromStorage("crreadmessages");
                    jqcc.cometchat.setChatroomVars('crreadmessages',crreadmessages);
                },
                updateCRReadMessages: function(id){
                    if(typeof(id) == 'object'){
                        jqcc.each(id, function(chatroomId,lastmessage) {
                            chatroomId = chatroomId.replace('_','');
                            if(typeof (jqcc.cometchat.updateToStorage)!=='undefined'){
                                var alreadycrreadmessages = jqcc.cometchat.getFromStorage('crreadmessages');
                                if((typeof(alreadycrreadmessages[chatroomId])!='undefined' && parseInt(alreadycrreadmessages[chatroomId])<parseInt(lastmessage)) || typeof(alreadycrreadmessages[chatroomId])=='undefined'){
                                    var crreadmessages = {};
                                    crreadmessages[chatroomId] = parseInt(lastmessage);
                                    jqcc.cometchat.updateToStorage('crreadmessages',crreadmessages);
                                    jqcc.cometchat.setChatroomVars('crreadmessages',jqcc.cometchat.getFromStorage("crreadmessages"));
                                }
                            }
                        });
                    } else {
                        if($('#currentroom_convotext').find('.cometchat_chatboxmessage:last').length){
                            if(typeof (jqcc.cometchat.updateToStorage)!=='undefined'){
                                var alreadycrreadmessages = jqcc.cometchat.getFromStorage('crreadmessages');
                                var lastid = parseInt($('#currentroom_convotext').find('.cometchat_chatboxmessage:last').attr('id').replace('cometchat_message_',''));
                                if((typeof(alreadycrreadmessages[id])!='undefined' && parseInt(alreadycrreadmessages[id])<parseInt(lastid)) || typeof(alreadycrreadmessages[id])=='undefined'){
                                    var crreadmessages = {};
                                    crreadmessages[id] = parseInt(lastid);
                                    jqcc.cometchat.updateToStorage('crreadmessages',crreadmessages);
                                    jqcc.cometchat.setChatroomVars('crreadmessages',jqcc.cometchat.getFromStorage("crreadmessages"));
                                }
                            }
                        }
                    }
                },
                updateCRReceivedUnreadMessages: function(id,lastid){
                    if(typeof (jqcc.cometchat.updateToStorage)!=='undefined'){
                        var alreadycrreceivedmessages = jqcc.cometchat.getFromStorage('crreceivedunreadmessages');
                        if((typeof(alreadycrreceivedmessages[id])!='undefined' && parseInt(alreadycrreceivedmessages[id])<parseInt(lastid)) || typeof(alreadycrreceivedmessages[id])=='undefined'){
                            var crreceivedmessages = {};
                            crreceivedmessages[id] = parseInt(lastid);
                            jqcc.cometchat.updateToStorage('crreceivedunreadmessages',crreceivedmessages);
                        }
                    }
                },
                chatroomBoxKeyup: function(event,chatboxtextarea) {
                    var adjustedHeight = chatboxtextarea.clientHeight;
                    var maxHeight = 94;
                    var height = $[calleeAPI].crgetWindowHeight();

                    if (maxHeight > adjustedHeight) {
                        adjustedHeight = Math.max(chatboxtextarea.scrollHeight, adjustedHeight);
                        if (maxHeight)
                            adjustedHeight = Math.min(maxHeight, adjustedHeight);
                        if (adjustedHeight > chatboxtextarea.clientHeight) {
                            $(chatboxtextarea).css('height',adjustedHeight+6 +'px');

                            var contentDivHeight = height-parseInt($('.topbar').css('height'));
                            $("div.content_div").css('height',contentDivHeight);
                            var textareaHeight = parseInt($('textarea.cometchat_textarea').css('height')) + 4 + 4;//Padding + padding of container
                            var prependHeight = parseInt($('.cometchat_prependMessages_container').outerHeight(true));
                            $("#currentroom_convo").css('height',contentDivHeight-textareaHeight-prependHeight);
                            $("#currentroom_left").find("div.slimScrollDiv").css('height',$("#currentroom_convo").css('height'));
                            $[calleeAPI].chatroomScrollDown(1);
                        }
                    } else {
                        $(chatboxtextarea).css('overflow-y','auto');
                    }
                },
                hidetabs: function() {
                    $('#lobbytab').removeClass('tab_selected');
                    $('#createtab').removeClass('tab_selected');
                    $('#currentroomtab').find('span').removeClass('tab_selected');
                    $('#lobby').css('display','none');
                    $('#currentroom').css('display','none');
                    $('#create').css('display','none');
                    $('#plugins').css('display','none');
                },
                loadLobby: function(forced) {
                    $[calleeAPI].hidetabs();
                    jqcc.cometchat.setChatroomVars('currentroom',0);
                    $('#lobbytab').addClass('tab_selected');
                    $('#lobby').css('display','block');
                    $('div.welcomemessage').html('<?php echo $chatrooms_language[1];?>');
                    clearTimeout(jqcc.cometchat.getChatroomVars('heartbeatTimer'));
                    jqcc[jqcc.cometchat.getChatroomVars('calleeAPI')].addMessageCounter();
                    jqcc.cometchat.chatroomHeartbeat(forced);
                },
                crcheckDropDown: function(dropdown) {
                    var id = dropdown.value;
                    if (id == 1) {
                        $('div.password_hide').css('display','block');
                    } else {
                        $('div.password_hide').css('display','none');
                    }
                },
                loadRoom: function() {
                    var roomname = jqcc.cometchat.getChatroomVars('currentroomname');
                    var roomno = jqcc.cometchat.getChatroomVars('currentroom');
                    var inviteLink = '';
                    var messageCounter = '0';
                    if(jqcc.cometchat.getChatroomVars('checkBarEnabled') == 1){
                        inviteLink = '<span> | </span><?php echo $chatrooms_language[48];?>';
                    }
                    $[calleeAPI].hidetabs();
                    $('#plugins').css('display','block');
                    $('#currentroom').css('display','block');
                    $('#currentroomtab').css('display','block');
                    $('#currentroomtab').find('.activeRoom_'+roomno).addClass('tab_selected');
                    $('div.welcomemessage').html('<?php echo $chatrooms_language[4];?>'+inviteLink+'<?php echo $chatrooms_language[39];?>');
                    
                    var cc_chatroom = JSON.parse($.cookie(settings.cookiePrefix+'crstate'));
                    var room_no = '_'+roomno;
                    var chatroomdata = cc_chatroom.active;
                    if(!chatroomdata.hasOwnProperty(room_no)){
                        var chatroomData = {};
                        var controlparameters = {"name":"active", "val":chatroomData, "roomno":roomno, "messageCounter":messageCounter, "isOpen": "1"};
                        jqcc.cometchat.setCrSessionVariable(controlparameters);
                    }
                    var crUnreadMessages = jqcc.cometchat.getChatroomVars('crUnreadMessages');
                    crUnreadMessages[roomno] = 0;
                    jqcc.cometchat.setChatroomVars('crUnreadMessages',crUnreadMessages);

                    if ($('#currentroomtab').find('a').attr('show')==0) {
                        $('#unbanuser').remove();
                    }
                    $('.cometchat_prependMessages_container > .cometchat_prependMessages').attr('onclick','jqcc.standard.prependCrMessagesInit('+roomno+')');
                    var pluginshtml = '';
                    var plugins = jqcc.cometchat.getChatroomVars('plugins');
                    var topbarWidth = jqcc('.topbar_text').css('width');

                    if (plugins.length > 0) {
                        pluginshtml += '<div class="cometchat_plugins">';
                        for (var i = 0;i < plugins.length;i++) {
                            var name = 'cc'+plugins[i];
                            if (typeof($[name]) == 'object') {
                                pluginshtml += '<div class="cometchat_pluginsicon cometchat_'+ settings.plugins[i] + '" title="' + $[name].getTitle() + '" name="'+name+'" to="'+roomno+'" chatroommode="1" ></div>';
                            }
                        }
                        pluginshtml += '</div>';
                    }
                    $('#plugins').html(pluginshtml);
                    $('.cometchat_pluginsicon').click(function(){
                        var name = $(this).attr('name');
                        var to = $(this).attr('to');
                        var chatroommode = $(this).attr('chatroommode');
                        var roomname = jqcc.cometchat.getChatroomVars('currentroomname');
                        var roomid = jqcc.cometchat.getChatroomVars('currentroom');
                        if(typeof(parent) != 'undefined' && parent != null && parent != self && name != 'ccsave' && name != 'ccclearconversation' && name != 'ccchattime'){
                            var controlparameters = {"type":"plugins", "name":name, "method":"init", "params":{"to":to, "chatroommode":chatroommode, "roomname":roomname, "roomid":roomid, "caller":"cometchat_trayicon_chatrooms_iframe"}};
                            controlparameters = JSON.stringify(controlparameters);
                            parent.postMessage('CC^CONTROL_'+controlparameters,'*');
                        } else {
                            var controlparameters = {"to":to, "chatroommode":chatroommode, "roomname":roomname, "roomid":roomid};
                            jqcc[name].init(controlparameters);
                        }
                    });
                    $[calleeAPI].chatroomWindowResize();
                },
                chatroomWindowResize: function() {
                    var height = $[calleeAPI].crgetWindowHeight();
                    var forced = 0;
                    if(jqcc('#createtab').length > 0){
                        var topbarWidth = jqcc('.topbar').outerWidth(true);
                        var lobbytabWidth = jqcc('#lobbytab').outerWidth(true);
                        var createtabWidth = jqcc('#createtab').outerWidth(true);
                        var currentroomtabWidth = parseInt(topbarWidth - lobbytabWidth - createtabWidth);
                        jqcc('#currentroomtab').css('width',currentroomtabWidth);
                    }
                    var contentDivHeight = height-parseInt($('.topbar').css('height'));
                    $("div.content_div").css('height',contentDivHeight);
                    var textareaHeight = parseInt($('textarea.cometchat_textarea').css('height')) + 4 + 4;//Padding + padding of container
                    var prependHeight = parseInt($('.cometchat_prependMessages_container').outerHeight(true));
                    $("#currentroom_convo").css('height',contentDivHeight-textareaHeight-prependHeight);

                    var width = $[calleeAPI].crgetWindowWidth();
                    $('#currentroom_left').css('width',width-144-48);
                    $('textarea.cometchat_textarea').css('width',width-174-48);
                    if($('#currentroom_convo').height() <= 0){
                        forced = 1;
                    }
                    $[calleeAPI].chatroomScrollDown(forced);
                    try {
                        if (jqcc().slimScroll) {
                            $("#currentroom_left").find("div.slimScrollDiv").css('height',$("#currentroom_convo").css('height'));
                            $("#currentroom_right").find("div.slimScrollDiv").css('height',$("#currentroom_right").css('height'));
                        }
                    } catch(e){}
                },
                kickid: function(kickid) {
                    $("#chatroom_userlist_"+kickid).remove();
                },
                banid: function(banid) {
                    $("#chatroom_userlist_"+banid).remove();
                },
                chatroomScrollDown: function(forced) {
                    try {
                        if(settings.newMessageIndicator == 1 && ($('#currentroom_convotext').outerHeight(false)+$('#currentroom_convotext').offset().top-$('#currentroom_convo').height()-$('#currentroom_convo').offset().top-$('.cometchat_chatboxmessage').height()-$('.cometchat_chatboxmessage').height()>0)){
                            if(($('#currentroom_convo').height()-$('#currentroom_convotext').outerHeight(false)) < 0){
                                if(forced) {
        	                        if (jqcc().slimScroll) {
        	                            $('#currentroom_convo').slimScroll({scroll: '1'});
        	                        } else {
        	                            setTimeout(function() {
        	                            $("#currentroom_convo").scrollTop(50000);
        	                            },100);
        	                        }
        	                        if($('.talkindicator').length != 0){
        	                            $('.talkindicator').fadeOut();
                                    }
        	                    }else{
                                    if($('.talkindicator').length){
                                        $('.talkindicator').fadeIn();
                                    }else{
                                        var indicator = "<a class='talkindicator' href='#'><?php echo $chatrooms_language[52];?></a>";
                                        $('#currentroom_convo').append(indicator);
                                        $('.talkindicator').click(function(e) {
                                            e.preventDefault();
                                            if (jqcc().slimScroll) {
                                                $('#currentroom_convo').slimScroll({scroll: '1'});
                                            } else {
                                                setTimeout(function() {
                                                    $("#currentroom_convo").scrollTop(50000);
                                                },100);
                                            }
                                            $('.talkindicator').fadeOut();
                                        });
                                        $('#currentroom_convo').scroll(function(){
                                            if($('#currentroom_convotext').outerHeight(false) + $('#currentroom_convotext').offset().top - $('#currentroom_convo').offset().top <= $('#currentroom_convo').height()){
                                                $('.talkindicator').fadeOut();
                                            }
                                        });
                                    }
                            	}
                            }
                        }else{
                            if (jqcc().slimScroll) {
                                $('#currentroom_convo').slimScroll({scroll: '1'});
                            } else {
                                setTimeout(function() {
                                    $("#currentroom_convo").scrollTop(50000);
                                },100);
                            }
                        }
                    } catch(e) {}
                },
                createChatroomSubmitStruct: function() {
                    var string = $('input.create_input').val();
                    var room={};
                    if (($.trim( string )).length == 0) {
                        return false;
                    }
                    var name = document.getElementById('name').value;
                    var type = document.getElementById('type').value;
                    var password = document.getElementById('password').value;
                    if (name != '' && name != null && name != '<?php echo $chatrooms_language[63];?>') {
                        name = name.replace(/^\s+|\s+$/g,"");
                        if (type == 1 && password == '') {
                            alert ('<?php echo $chatrooms_language[26];?>');
                            return false;
                        }
                        if (type == 0 || type == 2) {
                            password = '';
                        }
                        room['name'] = name;
                        room['password'] = password;
                        room['type'] = type;
                    }else{
                        alert('<?php echo $chatrooms_language[50];?>');
                        return false;
                    }
                    document.getElementById('name').value = '';
                    document.getElementById('password').value = '';
                    return room;
                },
                crgetWindowHeight: function() {
                    var windowHeight = 0;
                    if (typeof(window.innerHeight) == 'number') {
                        windowHeight = window.innerHeight;
                    } else {
                        if (document.documentElement && document.documentElement.clientHeight) {
                            windowHeight = document.documentElement.clientHeight;
                        } else {
                            if (document.body && document.body.clientHeight) {
                                windowHeight = document.body.clientHeight;
                            }
                        }
                    }
                    return windowHeight;
                },
                crgetWindowWidth: function() {
                    var windowWidth = 0;
                    if (typeof(window.innerWidth) == 'number') {
                        windowWidth = window.innerWidth;
                    } else {
                        if (document.documentElement && document.documentElement.clientWidth) {
                            windowWidth = document.documentElement.clientWidth;
                        } else {
                            if (document.body && document.body.clientWidth) {
                                windowWidth = document.body.clientWidth;
                            }
                        }
                    }
                    return windowWidth;
                },
                selectChatroom: function(currentroom,id) {
                    jqcc("#cometchat_chatroomlist_"+currentroom).removeClass("cometchat_chatroomselected");
                    jqcc("#cometchat_chatroomlist_"+id).addClass("cometchat_chatroomselected");
                },
                checkOwnership: function(owner,isModerator,name) {
                    var id = jqcc.cometchat.getChatroomVars('currentroom');
                    var switchroom = 'javascript:jqcc["'+calleeAPI+'"].switchChatroom('+id+',"1")';
                    var show = 0;
                    if (owner || isModerator) {
                        show = 1;
                    }
                    if(!jqcc('#currentroomtab').is(":visible")){
                        jqcc('#currentroomtab').html('<span class="activeRoom_'+id+' activeRooms tab_selected"><a href="javascript:void(0);" show="'+show+'" onclick='+switchroom+'>'+name+'</a></span>');
                    } else {
                        jqcc('#currentroomtab').html('<span class="activeRoom_'+id+' activeRooms tab_selected"><a href="javascript:void(0);" show="'+show+'" onclick='+switchroom+'>'+name+'</a></span>');
                    }
                    jqcc('#currentroom_convotext').html('');
                    jqcc("#currentroom_users").html('');
                },
                leaveRoomClass : function(currentroom) {
                    jqcc("#cometchat_chatroomlist_"+currentroom).removeClass("cometchat_chatroomselected");
                },
                removeCurrentRoomTab : function(id) {
                    jqcc("#currentroomtab").html('');
                },
                chatroomLogout : function() {
                    window.location.reload();
                },
                loadChatroomList : function(item) {
                    var chatroomitem = $[calleeAPI].getActiveChatrooms(item);
                    var activeChatroomIds = Object.keys(chatroomitem);
                    var activeChatroomhtml = jqcc.standard.activeChatrooms(item);
                    var temp = '';
                    if(Object.keys(item).length == activeChatroomIds.length){
                        temp = activeChatroomhtml;
                    } else {
                        temp = activeChatroomhtml+'<div class="cometchat_chatroomtitle"><hr class="hrleft"><?php echo $chatrooms_language[77];?><hr class="hrright"></div>';
                    }
                    var onlineNumber = 0;
                    var userCountCss = "style='display:none'";
                    if(settings.showChatroomUsers == 1){
                        userCountCss = '';
                    }
                    $.each(item, function(i,room) {
                        if(activeChatroomIds.indexOf(i) < 0){
                            longname = room.name;
                            shortname = room.name;

                            if (room.status == 'available') {
                                onlineNumber++;
                            }
                            var selected = '';

                            if (jqcc.cometchat.getChatroomVars('currentroom') == room.id) {
                                selected = ' cometchat_chatroomselected';
                            }
                            var roomtype = '';
                            var roomowner = '';
                            var deleteroom = '';
                            var renameChatroom = '';

                            if (room.type == 1) {
                                roomtype = '<?php echo $chatrooms_language[24];?>';
                            }

                            if (room.s == 1) {
                                roomowner = '<?php echo $chatrooms_language[25];?>';
                            }

                            if((room.s == 1 || jqcc.cometchat.checkModerator() == 1) && room.createdby != 0){
                                deleteroom = '<img src="remove.png" />';
                                renameChatroom = '<img src="pencil.png" />';
                            }

                            if (room.s == 2) {
                                room.s = 1;
                            }

                            temp += '<div id="cometchat_chatroomlist_'+room.id+'" class="lobby_room'+selected+'" onmouseover="jQuery(this).addClass(\'cometchat_chatroomlist_hover\');" onmouseout="jQuery(this).removeClass(\'cometchat_chatroomlist_hover\');" onclick="javascript:jqcc.cometchat.chatroom(\''+room.id+'\',\''+urlencode(shortname)+'\',\''+room.type+'\',\''+room.i+'\',\''+room.s+'\',\'0\',\'1\');" ><span class="lobby_room_1"><span class="currentroomname">'+longname+'</span></span><span class="lobby_room_2" '+userCountCss+'>'+room.online+' <?php echo $chatrooms_language[34];?></span><span class="lobby_room_3">'+roomtype+'</span><span class="lobby_room_4" title="<?php echo $chatrooms_language[58];?>" onclick="javascript:jqcc.cometchat.deleteChatroom(event,\''+room.id+'\');">'+deleteroom+'</span><span class="lobby_room_5">'+roomowner+'</span><span class="lobby_room_6" title="<?php echo $chatrooms_language[80];?>" onclick="javascript:jqcc.'+[calleeAPI]+'.renameChatroom(event,\''+room.id+'\');">'+renameChatroom+'</span><div style="clear:both"></div></div>';
                        }
                    });
                    if (Object.keys(item).length != 0) {
                        jqcc('#lobby_rooms').html(temp);
                    }else{
                        jqcc('#lobby_rooms').html('<div class="lobby_noroom"><?php echo $chatrooms_language[53]; ?></div>');
                    }
                },
                displayChatroomMessage: function(item,fetchedUsers) {
                    var beepNewMessages = 0;
                    var lastMessageId = 0;
                    var newMessages = 0;
                    var crUnreadMessages = jqcc.cometchat.getChatroomVars('crUnreadMessages');
                    var chatroomreadmessages = jqcc.cometchat.getFromStorage("crreadmessages");
                    var receivedcrunreadmessages = jqcc.cometchat.getFromStorage('crreceivedunreadmessages');
                    
                    $.each(item, function(i,incoming) {
                        if(incoming.fromid == settings.myid){
                            incoming.from = '<?php echo $chatrooms_language[6];?>';
                        }
                        
                        jqcc.cometchat.setChatroomVars('timestamp',incoming.id);
                        lastMessageId = incoming.id;
                        var message = jqcc.cometchat.processcontrolmessage(incoming);
                        if (message != '' && incoming.chatroomid == jqcc.cometchat.getChatroomVars('currentroom')) {
                            var temp = '';
                            var fromname = incoming.from;
                            if ($("#cometchat_message_"+incoming.id).length > 0) {
                                $("#cometchat_message_"+incoming.id).find("span.cometchat_chatboxmessagecontent").html(message);
                            } else {
                                var ts = new Date(parseInt(incoming.sent)*1000);
                                if (incoming.fromid != settings.myid) {
                                    temp += ('<div class="cometchat_chatboxmessage" id="cometchat_message_'+incoming.id+'"><span class="cometchat_chatboxmessagefrom"><strong>');
                                    if (jqcc.cometchat.getChatroomVars('checkBarEnabled')==1 && incoming.fromid != 0) {
                                        temp += ('<a href="javascript:void(0)" onclick="javascript:parent.jqcc.cometchat.chatWith(\''+incoming.fromid+'\');">');
                                    }
                                    temp += fromname+':';
                                    if (jqcc.cometchat.getChatroomVars('checkBarEnabled')==1 && incoming.fromid != 0) {
                                        temp += ('</a>');
                                    }
                                    temp += ('&nbsp;&nbsp;</strong></span><span class="cometchat_chatboxmessagecontent">'+message+'</span>'+$[calleeAPI].getTimeDisplay(ts,incoming.from)+'</div>');
                                    var msgcount = 0;
                                    jqcc.cometchat.setChatroomVars('newMessages',msgcount);
                                    beepNewMessages++;
                                } else {
                                    temp += ('<div class="cometchat_chatboxmessage" id="cometchat_message_'+incoming.id+'"><span class="cometchat_chatboxmessagefrom"><strong>'+fromname+':&nbsp;&nbsp;</strong></span><span class="cometchat_chatboxmessagecontent">'+message+'</span>'+$[calleeAPI].getTimeDisplay(ts,incoming.from)+'</div>');
                                }
                            }

                            $('#currentroom_convotext').append(temp);
                            if (jqcc.cometchat.getChatroomVars('owner') || jqcc.cometchat.getChatroomVars('isModerator') || (incoming.fromid == settings.myid && jqcc.cometchat.getChatroomVars('allowDelete') == 1)) {
                                if ($("#cometchat_message_"+incoming.id+" .delete_msg").length < 1) {
                                    jqcc('#cometchat_message_'+incoming.id+' .cometchat_ts').after('<span class="delete_msg" onclick="javascript:jqcc.cometchat.confirmDelete(\''+incoming.id+'\');">(<span class="hoverbraces"><?php echo $chatrooms_language[46]; ?></span>)</span>');
                                }
                                $(".cometchat_chatboxmessage").live("mouseover",function() {
                                    $(this).find(".delete_msg").css('visibility','visible');
                                });
                                $(".cometchat_chatboxmessage").live("mouseout",function() {
                                    $(this).find(".delete_msg").css('visibility','hidden');
                                });
                                $(".delete_msg").mouseover(function() {
                                    $(this).css('visibility','visible');
                                    $(this).find(".hoverbraces").css('text-decoration','underline');
                                });
                                $(".delete_msg").mouseout(function() {
                                    $(this).find("span.hoverbraces").css('text-decoration','none');
                                });
                            }
                            var forced = (incoming.fromid == settings.myid) ? 1 : 0;
                            if((message).indexOf('<img')!=-1 && (message).indexOf('src')!=-1){
                                $( "#cometchat_message_"+incoming.id+" img" ).load(function() {
                                     $[calleeAPI].chatroomScrollDown(forced);
                                });
                            }else{
                                $[calleeAPI].chatroomScrollDown(forced);
                            }
                        }

                        var chatroomFlag = 1;
                        if($.cookie(settings.cookiePrefix+'state')!=null) {
                            var cc_state = $.cookie(settings.cookiePrefix+'state');
                            var cc_states = cc_state.split(/:/);
                            if(cc_states[5]==' ' || cc_states[5]=='' || cc_states[5]!='chatrooms'){
                                chatroomFlag = 0;
                            }
                        }
                        
                        if (message != '' && (incoming.chatroomid != jqcc.cometchat.getChatroomVars('currentroom') || chatroomFlag == 0) && (typeof(receivedcrunreadmessages[incoming.chatroomid])=='undefined' || receivedcrunreadmessages[incoming.chatroomid] < incoming.id)){
                            if(!crUnreadMessages.hasOwnProperty(incoming.chatroomid)){
                                crUnreadMessages[incoming.chatroomid] = 1;
                            } else {
                                var newUnreadMessages = parseInt(crUnreadMessages[incoming.chatroomid]) + 1;
                                crUnreadMessages[incoming.chatroomid] = newUnreadMessages;
                            }
                            $[calleeAPI].updateCRReceivedUnreadMessages(incoming.chatroomid,incoming.id);
                        }
                    });

                        jqcc.cometchat.setChatroomVars('crUnreadMessages',crUnreadMessages);
                        receivedcrunreadmessages = jqcc.cometchat.getFromStorage('crreceivedunreadmessages');
                        $.each(crUnreadMessages, function(chatroomid,unreadMessageCount) {
                            var chatroomreadmessagesId = chatroomreadmessages[chatroomid];
                            var receivedcrunreadmessagesId = receivedcrunreadmessages[chatroomid];
                            if(receivedcrunreadmessagesId != 'undefined'){
                                if(receivedcrunreadmessagesId > chatroomreadmessagesId){
                                    $[calleeAPI].chatroomUnreadMessages(jqcc.cometchat.getChatroomVars('crUnreadMessages'),chatroomid);
                                }
                            }
                        });
                        
                        if (typeof(jqcc[jqcc.cometchat.getChatroomVars('calleeAPI')].addMessageCounter) == "function"){
                            jqcc[jqcc.cometchat.getChatroomVars('calleeAPI')].addMessageCounter();
                        }
                        jqcc.cometchat.setChatroomVars('heartbeatCount',1);
                        jqcc.cometchat.setChatroomVars('heartbeatTime',settings.minHeartbeat);
                        var popoutmode = 0;
                        if (settings.apiAccess == 1 && fetchedUsers == 0 && typeof (parent.jqcc.cometchat.setAlert) != 'undefined' && popoutmode == 0) {
                            if($.cookie(settings.cookiePrefix+'crstate') !== 'undefined' && $.cookie(settings.cookiePrefix+'crstate')!=null) {
                                var cc_crstate = JSON.parse($.cookie(settings.cookiePrefix+'crstate'));
                                var chatroomData = cc_crstate.active;
                                var messageCount = 0;
                                if(Object.keys(chatroomData).length > 0){
                                    $.each(chatroomData, function(chatroomid,data) {
                                        messageCount = messageCount + parseInt(data.c);
                                    });
                                }
                                parent.jqcc.cometchat.setAlert('chatrooms',messageCount);
                            }
                        }
                        if ($.cookie(settings.cookiePrefix+"sound") && $.cookie(settings.cookiePrefix+"sound") == 'true') { } else {
                            if (beepNewMessages > 0 && fetchedUsers == 0) {
                                $[calleeAPI].playsound();
                            }
                        }
                        $[calleeAPI].updateCRReadMessages(jqcc.cometchat.getChatroomVars('currentroom'));
                        var crreadmessages = jqcc.cometchat.getFromStorage("crreadmessages");
                        jqcc.cometchat.setChatroomVars('crreadmessages',crreadmessages);
                    },
                    silentRoom: function(id, name, silent) {
                        if (settings.lightboxWindows == 1) {
                            var controlparameters = {"type":"modules", "name":"cometchat", "method":"loadCCPopup", "params":{"url":settings.baseUrl+"modules/chatrooms/chatrooms.php?id="+id+"&basedata="+settings.basedata+"&name="+name+"&silent="+silent+"&action=passwordBox", "action":"passwordBox", "properties":"status=0,toolbar=0,menubar=0,directories=0,resizable=0,location=0,status=0,scrollbars=1, width=320,height=110", "width":320, "height":110, "lang":name}};
                            controlparameters = JSON.stringify(controlparameters);
                            parent.postMessage('CC^CONTROL_'+controlparameters,'*');
                        } else {
                            var temp = prompt('<?php echo $chatrooms_language[8];?>','');
                            if (temp) {
                                jqcc.cometchat.checkChatroomPass(id,name,silent,temp);
                            } else {
                                return;
                            }
                        }
                    },
                    switchChatroom: function(id, force) {
                        jqcc.cometchat.getChatroomDetails(id,1,force);
                        jqcc.cometchat.setChatroomVars('currentroom', id);
                        var controlparameters = {"name":"open", "val":id};
                        jqcc.cometchat.setCrSessionVariable(controlparameters);
                    },
                    renameChatroom: function(event,id){
                        event.stopPropagation();
                        jqcc('.cancel_edit').click();
                        jqcc('#cometchat_chatroomlist_'+id).append('<div class="cometchat_chatroom_overlay"><input class="chatroomName" id="chatroomName_'+id+'" type="textbox" value="0" style="display:none;" /><a title="<?php echo $chatrooms_language[51];?>" class="cancel_edit" href="javascript:void(0);" onclick="javascript:jqcc.'+jqcc.cometchat.getChatroomVars('calleeAPI')+'.canceledit(event,\''+id+'\');" style="display:none;"><?php echo $chatrooms_language[51];?></a></div>');
                        var currentroomname = jqcc('#cometchat_chatroomlist_'+id).find('.currentroomname').html();
                        var currentroomname = jqcc('#cometchat_chatroomlist_'+id).find('.currentroomname').html();
                        var baseUrl = settings.baseUrl;
                        var basedata = settings.basedata;
                        jqcc('#cometchat_chatroomlist_'+id).find('.currentroomname').hide();
                        jqcc('#cometchat_chatroomlist_'+id).find('.chatroomName').show();
                        jqcc('#cometchat_chatroomlist_'+id).find('.cancel_edit').show();
                        jqcc('#cometchat_chatroomlist_'+id).find('.chatroomName').val(currentroomname);
                        jqcc('.chatroomName').on('click', function(e) {
                            e.stopPropagation();
                        });
                        jqcc('.cometchat_chatroom_overlay').on('click', function(e) {
                            e.stopPropagation();
                            var cname = jqcc('#cometchat_chatroomlist_'+id).find('.chatroomName').val();
                            jqcc[jqcc.cometchat.getChatroomVars('calleeAPI')].renameChatroomsubmit(id,currentroomname,cname);
                        });
                        jqcc(".chatroomName").keydown(function(e) {
                            if (e.keyCode == 13) {
                                var cname = jqcc(this).val();
                                jqcc[jqcc.cometchat.getChatroomVars('calleeAPI')].renameChatroomsubmit(id,currentroomname,cname);
                            }
                        });
                    },
                    renameChatroomsubmit: function(id, currentroomname, name) {
                        var baseUrl = settings.baseUrl;
                        var basedata = settings.basedata;
                        name = name.trim();
                        if(currentroomname != name) {
                            jqcc.ajax({
                                url: baseUrl+"modules/chatrooms/chatrooms.php?action=renamechatroom",
                                data: {id: id, basedata: basedata, cname: name},
                                type: 'post',
                                cache: false,
                                timeout: 10000,
                                async: false,
                                success: function(data) {
                                    if (data == 0) {
                                        alert('<?php echo $chatrooms_language[38];?>');
                                    }else{
                                        jqcc('#cometchat_chatroomlist_'+id).find('.cancel_edit').hide();
                                        jqcc('#cometchat_chatroomlist_'+id).find('.currentroomname').show();
                                        jqcc('#cometchat_chatroomlist_'+id).find('.chatroomName').hide();
                                        if(currentroomname == jqcc('.currentroomtab,.activeRooms a').clone().children().remove().end().text()){
                                            jqcc('.currentroomtab,.activeRooms a').text(name);
                                        }
                                        jqcc.cometchat.chatroomHeartbeat(1);
                                    }
                                }
                            });
                        } else {
                            jqcc('#cometchat_chatroomlist_'+id).find('.cancel_edit').click();
                        }
                    },
                    canceledit: function(event,id) {
                        event.stopPropagation();
                        jqcc('#cometchat_chatroomlist_'+id).find('.cometchat_chatroom_overlay').remove();
                        jqcc('#cometchat_chatroomlist_'+id).find('.currentroomname').show();
                        jqcc('#cometchat_chatroomlist_'+id).find('.chatroomName').hide();
                        jqcc('#cometchat_chatroomlist_'+id).find('.cancel_edit').hide();
                    },
                    updateChatroomUsers: function(item,fetchedUsers) {
                        var temp = '';
                        var temp1 = '';
                        var moderatorhtml = '';
                        var userhtml = '';
                        var newUsers = {};
                        var newUsersName = {};
                        fetchedUsers = 1;
                        $.each(item, function(i,user) {
                            if (user.id != jqcc.cometchat.getChatroomVars('kick_ban_id')) {
                                    longname = user.n;
                                    if (settings.users[user.id] != 1 && settings.initializeRoom == 0 && settings.hideEnterExit == 0) {
                                            var ts = new Date();
                                            $("#currentroom_convotext").append('<div class="cometchat_chatboxalert" id="cometchat_message_0">'+user.n+'<?php echo $chatrooms_language[14]?>'+$[calleeAPI].getTimeDisplay(ts,user.id)+'</div>');
                                            $[calleeAPI].chatroomScrollDown();
                                    }
                                    if (parseInt(user.b)!=1) {
                                            var avatar = '';
                                            if (user.a != '') {
                                                    avatar = '<span class="cometchat_userscontentavatar"><img class="cometchat_userscontentavatarimage" src='+user.a+'></span>';
                                            }
                                            newUsers[user.id] = 1;
                                            newUsersName[user.id] = user.n;
                                            userhtml='<div class="cometchat_subsubtitleusers"><hr class="hrleft"><?php echo $chatrooms_language[61];?><hr class="hrright"></div>';
                                            moderatorhtml='<div class="cometchat_subsubtitle"><hr class="hrleft"><?php echo $chatrooms_language[62];?><hr class="hrright"></div>';
                                            if (jQuery.inArray(user.id ,jqcc.cometchat.getChatroomVars('moderators') ) != -1 ) {
                                                    if (user.id == settings.myid) {
                                                            temp1 += '<div id="chatroom_userlist_'+user.id+'" class="cometchat_userlist" style="cursor:default !important;">'+avatar+'<span class="cometchat_userscontentname">'+longname+'</span></div>';
                                                    } else {
                                                            temp1 += '<div id="chatroom_userlist_'+user.id+'" class="cometchat_userlist loadChatroomPro" onmouseover="jqcc(this).addClass(\'cometchat_chatroomlist_hover\');" onmouseout="jqcc(this).removeClass(\'cometchat_chatroomlist_hover\');" userid='+user.id+' owner='+settings.owner+' username="'+user.n+'" >'+avatar+'<span class="cometchat_userscontentname">'+longname+'</span></div>';
                                                    }
                                            } else {
                                                    if (user.id == settings.myid) {
                                                            temp += '<div id="chatroom_userlist_'+user.id+'" class="cometchat_userlist" style="cursor:default !important;">'+avatar+'<span class="cometchat_userscontentname">'+longname+'</span></div>';
                                                    } else {
                                                            temp += '<div id="chatroom_userlist_'+user.id+'" class="cometchat_userlist loadChatroomPro" onmouseover="jqcc(this).addClass(\'cometchat_chatroomlist_hover\');" onmouseout="jqcc(this).removeClass(\'cometchat_chatroomlist_hover\');" userid='+user.id+' owner='+settings.owner+' username="'+user.n+'">'+avatar+'<span class="cometchat_userscontentname">'+longname+'</span></div>';
                                                    }
                                            }
                                    }
                            }
                        });
                        for (user in settings.users) {
                            if (settings.users.hasOwnProperty(user)) {
                                if (newUsers[user] != 1 && settings.initializeRoom == 0 && settings.hideEnterExit == 0) {
                                    var ts = new Date();
                                    $("#currentroom_convotext").append('<div class="cometchat_chatboxalert" id="cometchat_message_0">'+settings.usersName[user]+'<?php echo $chatrooms_language[13]?>'+$[calleeAPI].getTimeDisplay(ts,user.id)+'</div>');
                                    $[calleeAPI].chatroomScrollDown();
                                }
                            }
                        }
                        if(temp1 != "" && temp !="")
                            jqcc('#currentroom_users').html(moderatorhtml+temp1+userhtml+temp);
                        else if(temp == "")
                            jqcc('#currentroom_users').html(moderatorhtml+temp1);
                        else
                            jqcc('#currentroom_users').html(userhtml+temp);
                        jqcc.cometchat.setChatroomVars('users',newUsers);
                        jqcc.cometchat.setChatroomVars('usersName',newUsersName);
                        jqcc.cometchat.setChatroomVars('initializeRoom',0);
                    },
                    loadCCPopup: function(url,name,properties,width,height,title,force,allowmaximize,allowresize,allowpopout){
                        if (jqcc.cometchat.getChatroomVars('lightboxWindows') == 1) {
                            var controlparameters = {"type":"modules", "name":"chatrooms", "method":"loadCCPopup", "params":{"url":url, "name":name, "properties":properties, "width":width, "height":height, "title":title, "force":force, "allowmaximize":allowmaximize, "allowresize":allowresize, "allowpopout":allowpopout}};
                            controlparameters = JSON.stringify(controlparameters);
                            parent.postMessage('CC^CONTROL_'+controlparameters,'*');
                        } else {
                            var w = window.open(url,name,properties);
                            w.focus();
                        }
                    },
                    prependCrMessagesInit: function(id){
                        var messages = jqcc('#currentroom_convotext').find('.cometchat_chatboxmessage');
                        $('.cometchat_prependMessages').text('<?php echo $chatrooms_language[76];?>');
                        jqcc('.cometchat_prependMessages').attr('onclick','');
                        if(messages.length > 0){
                            prepend = messages[0].id.split('_')[2];
                        }else{
                            prepend = -1;
                        }
                        jqcc.cometchat.updateChatroomMessages(id,prepend);
                    },
                    prependCrMessages:function(id,data){
                        var oldMessages = '';
                        var count = 0;
                        $.each(data, function(i, incoming){
                            if(incoming.fromid == settings.myid){
                                incoming.from = '<?php echo $chatrooms_language[6];?>';
                            }
                            lastMessageId = incoming.id;
                            var deleteMessage = '';
                            var message = jqcc.cometchat.processcontrolmessage(incoming);
                            if (message != '') {
                                count = count+1;
                                var fromname = incoming.from;
                                var ts = new Date(parseInt(incoming.sent)*1000);
                                if (jqcc.cometchat.getChatroomVars('owner') || jqcc.cometchat.getChatroomVars('isModerator') || (incoming.fromid == settings.myid && jqcc.cometchat.getChatroomVars('allowDelete') == 1)) {
                                    deleteMessage = '<span class="delete_msg" onclick="javascript:jqcc.cometchat.confirmDelete(\''+incoming.id+'\');">(<span class="hoverbraces"><?php echo $chatrooms_language[46]; ?></span>)</span>';
                                }
                                if (incoming.fromid != settings.myid) {
                                    oldMessages += ('<div class="cometchat_chatboxmessage" id="cometchat_message_'+incoming.id+'"><span class="cometchat_chatboxmessagefrom"><strong>');
                                    if (jqcc.cometchat.getChatroomVars('checkBarEnabled')==1 && incoming.fromid != 0) {
                                        oldMessages += ('<a href="javascript:void(0)" onclick="javascript:parent.jqcc.cometchat.chatWith(\''+incoming.fromid+'\');">');
                                    }
                                    oldMessages += fromname+':';
                                    if (jqcc.cometchat.getChatroomVars('checkBarEnabled')==1 && incoming.fromid != 0) {
                                        oldMessages += ('</a>');
                                    }
                                    oldMessages += ('&nbsp;&nbsp;</strong></span><span class="cometchat_chatboxmessagecontent">'+message+'</span>'+$[calleeAPI].getTimeDisplay(ts,incoming.from)+deleteMessage+'</div>');
                                    var msgcount = 0;
                                    jqcc.cometchat.setChatroomVars('newMessages',msgcount);
                                } else {
                                    oldMessages += ('<div class="cometchat_chatboxmessage" id="cometchat_message_'+incoming.id+'"><span class="cometchat_chatboxmessagefrom"><strong>'+fromname+':&nbsp;&nbsp;</strong></span><span class="cometchat_chatboxmessagecontent">'+message+'</span>'+$[calleeAPI].getTimeDisplay(ts,incoming.from)+deleteMessage+'</div>');
                                }
                            }
                        });
                        jqcc('#currentroom_convotext').prepend(oldMessages);

                        $(".cometchat_chatboxmessage").live("mouseover",function() {
                            $(this).find(".delete_msg").css('visibility','visible');
                        });
                        $(".cometchat_chatboxmessage").live("mouseout",function() {
                            $(this).find(".delete_msg").css('visibility','hidden');
                        });
                        $(".delete_msg").mouseover(function() {
                            $(this).css('visibility','visible');
                            $(this).find(".hoverbraces").css('text-decoration','underline');
                        });
                        $(".delete_msg").mouseout(function() {
                            $(this).find("span.hoverbraces").css('text-decoration','none');
                        });

                        $('.cometchat_prependMessages').text('<?php echo $chatrooms_language[74];?>');

                        if((count - parseInt(settings.prependLimit) < 0)){
                            $('.cometchat_prependMessages').text('<?php echo $chatrooms_language[75];?>');
                            jqcc('.cometchat_prependMessages').attr('onclick','');
                            jqcc('.cometchat_prependMessages').css('cursor','default');
                        }else{
                            jqcc('.cometchat_prependMessages').attr('onclick','jqcc.standard.prependCrMessagesInit('+id+')');
                        }
                    },
                    getActiveChatrooms: function(item){
                        var chatroomitem = {};
                        var cc_chatroom = JSON.parse($.cookie(jqcc.cometchat.getChatroomVars('cookiePrefix')+'crstate'));
                        var chatroomData = cc_chatroom.active;
                        var Ids = new Array();
                        var temp = '';
                        var onlineNumber = 0;

                        for(chatroomId in chatroomData){
                            Ids.push(chatroomId);
                        }
                        for(var key in item) {
                            if(Ids.indexOf(key) >= 0){
                                chatroomitem[key] = item[key];
                            }
                        }
                        return chatroomitem;
                    },
                    activeChatrooms: function(item){
                        var chatroomitem = $[calleeAPI].getActiveChatrooms(item);
                        var temp = '';

                        if(Object.keys(chatroomitem).length > 0){
                            temp = '<div class="cometchat_chatroomtitle"><hr class="hrleft"><?php echo $chatrooms_language[78];?><hr class="hrright"></div>';
                        }
                        var userCountCss = "style='display:none'";
                        if(settings.showChatroomUsers == 1){
                            userCountCss = '';
                        }
                        $.each(chatroomitem, function(i,room) {
                            longname = room.name;
                            shortname = room.name;

                            if (room.status == 'available') {
                                onlineNumber++;
                            }
                            var selected = '';

                            if (jqcc.cometchat.getChatroomVars('currentroom') == room.id) {
                                selected = ' cometchat_chatroomselected';
                            }
                            var roomtype = '';
                            var roomowner = '';
                            var deleteroom = '';
                            var renameChatroom = '';

                            if (room.type == 1) {
                                roomtype = '<img src="lock.png" />';
                            }

                            if (room.s == 1) {
                                roomowner = '<img src="user.png" />';
                            }

                            if((room.s == 1 || jqcc.cometchat.checkModerator() == 1) && room.createdby != 0){
                                deleteroom = '<img src="remove.png" />';
                                renameChatroom = '<img src="pencil.png" />';
                            }

                            if (room.s == 2) {
                                room.s = 1;
                            }

                            temp += '<div id="cometchat_chatroomlist_'+room.id+'" class="lobby_room'+selected+'" onmouseover="jQuery(this).addClass(\'cometchat_chatroomlist_hover\');" onmouseout="jQuery(this).removeClass(\'cometchat_chatroomlist_hover\');" onclick="javascript:jqcc.cometchat.chatroom(\''+room.id+'\',\''+urlencode(shortname)+'\',\''+room.type+'\',\''+room.i+'\',\''+room.s+'\',\'0\',\'1\');" ><span class="lobby_room_1"><span class="currentroomname">'+longname+'</span></span><span class="lobby_room_2" '+userCountCss+'>'+room.online+' <?php echo $chatrooms_language[34];?></span><span class="lobby_room_3">'+roomtype+'</span><span class="lobby_room_4" title="<?php echo $chatrooms_language[58];?>" onclick="javascript:jqcc.cometchat.deleteChatroom(event,\''+room.id+'\');">'+deleteroom+'</span><span class="lobby_room_5">'+roomowner+'</span><span class="lobby_room_6" title="<?php echo $chatrooms_language[80];?>" onclick="javascript:jqcc.'+[calleeAPI]+'.renameChatroom(event,\''+room.id+'\');">'+renameChatroom+'</span><div style="clear:both"></div></div>';
                        });
                        return temp;
                    },
                    chatroomUnreadMessages: function(crUnreadMessages,chatroomid){
                        if(typeof(chatroomid) == 'undefined') {
                            if(Object.keys(crUnreadMessages).length > 0){
                                $.each(crUnreadMessages, function(chatroomid,unreadMessageCount) {
                                    var chatroomData = {};
                                    var controlparameters = {"name":"active", "val":chatroomData, "roomno":chatroomid, "messageCounter":unreadMessageCount, "isOpen":"0"};
                                    jqcc.cometchat.setCrSessionVariable(controlparameters);
                                });  
                            }
                        } else {
                            var cc_chatroom = JSON.parse($.cookie(settings.cookiePrefix+'crstate'));
                            var chatroomData = cc_chatroom.active;
                            var unreadMessageCount = 0;
                            var isOpen = 0;
                            var chatroomId = '_'+chatroomid;
                            if(chatroomData.hasOwnProperty(chatroomId)){
                                isOpen = chatroomData[chatroomId].o;
                                unreadMessageCount = crUnreadMessages[chatroomid];
                            }
                            var chatroomData = {};
                            var controlparameters = {"name":"active", "val":chatroomData, "roomno":chatroomid, "messageCounter":unreadMessageCount, "isOpen":isOpen};
                            jqcc.cometchat.setCrSessionVariable(controlparameters);
                        }
                    },
                    addMessageCounter: function(add){
                        var cc_chatroom = JSON.parse($.cookie(settings.cookiePrefix+'crstate'));
                        var chatroomdata = cc_chatroom.active;
                        $.each(chatroomdata, function (chatroomid, data){
                            chatroomid = chatroomid.replace('_','');
                            var cometchat_chatroommsgcount = $("#currentroomtab").find('.activeRoom_'+chatroomid).find('.cometchat_chatroommsgcount');
                            var cometchat_lobbymsgcount = $('.lobby_rooms').find('#cometchat_chatroomlist_'+chatroomid).find('.cometchat_lobbychatroommsgcount');
                            if(chatroomid != jqcc.cometchat.getChatroomVars('currentroom') && data.c != 0){
                                if(cometchat_chatroommsgcount.length > 0) {
                                    $("#currentroomtab").find('.activeRoom_'+chatroomid).find('.cometchat_chatroommsgcounttext').text(data.c);
                                } else {
                                    $("#currentroomtab").find('.activeRoom_'+chatroomid+' a').prepend("<span class='cometchat_chatroommsgcount'><div class='cometchat_chatroommsgcounttext'>"+data.c+"</div></span>");
                                }
                                if(cometchat_lobbymsgcount.length > 0) {
                                    $('.lobby_rooms').find('#cometchat_chatroomlist_'+chatroomid).find('.cometchat_chatroommsgcounttext').text(data.c);
                                } else {
                                    $('.lobby_rooms').find('#cometchat_chatroomlist_'+chatroomid).find('.lobby_room_3').after("<span class='cometchat_lobbychatroommsgcount'><div class='cometchat_chatroommsgcounttext'>"+data.c+"</div></span>");
                                }
                            }
                        });
                    }
                };
        })();
})(jqcc);

if(typeof(jqcc.standard) === "undefined"){
    jqcc.standard=function(){};
}

jqcc.extend(jqcc.standard, jqcc.crstandard);


jqcc(document).ready(function(){
    var lang = '<?php echo $chatrooms_language[21];?>';
    jqcc('.inviteChatroomUsers').live('click',function(){
        var baseurl = jqcc.cometchat.getBaseUrl();
        var basedata = jqcc.cometchat.getBaseData();
        var roomid = jqcc.cometchat.getChatroomVars('currentroom');
        var roompass = jqcc.cometchat.getChatroomVars('currentp');
        var roomname = urlencode(jqcc.cometchat.getChatroomVars('currentroomname'));
        var popoutmode = jqcc.cometchat.getChatroomVars('popoutmode');
        var url = baseurl+'modules/chatrooms/chatrooms.php?action=invite&roomid='+roomid+'&inviteid='+roompass+'&basedata='+basedata+'&roomname='+roomname;

        if(typeof(parent) != 'undefined' && parent != null && parent != self){
            var controlparameters = {"type":"modules", "name":"cometchat", "method":"inviteChatroomUser", "params":{"url":url, "action":"invite", "lang":lang}};
            controlparameters = JSON.stringify(controlparameters);
            if(typeof(parent) != 'undefined' && parent != null && parent != self){
                parent.postMessage('CC^CONTROL_'+controlparameters,'*');
            } else {
                window.opener.postMessage('CC^CONTROL_'+controlparameters,'*');
            }
        } else {
            var controlparameters = {};
            jqcc.cometchat.inviteChatroomUser();
        }
    });

    jqcc('.unbanChatroomUser').live('click',function(){
        var baseurl = jqcc.cometchat.getBaseUrl();
        var basedata = jqcc.cometchat.getBaseData();
        var roomid = jqcc.cometchat.getChatroomVars('currentroom');
        var roompass = jqcc.cometchat.getChatroomVars('currentp');
        var roomname = urlencode(jqcc.cometchat.getChatroomVars('currentroomname'));
        var popoutmode = jqcc.cometchat.getChatroomVars('popoutmode');
        var url = baseurl+'modules/chatrooms/chatrooms.php?action=unban&roomid='+roomid+'&inviteid='+roompass+'&basedata='+basedata+'&roomname='+roomname+'&time='+Math.random();

        if(typeof(parent) != 'undefined' && parent != null && parent != self){
            var controlparameters = {"type":"modules", "name":"cometchat", "method":"unbanChatroomUser", "params":{"url":url, "action":"invite", "lang":lang}};
            controlparameters = JSON.stringify(controlparameters);
            if(typeof(parent) != 'undefined' && parent != null && parent != self){
                parent.postMessage('CC^CONTROL_'+controlparameters,'*');
            } else {
                window.opener.postMessage('CC^CONTROL_'+controlparameters,'*');
            }
        } else {
            var controlparameters = {};
            jqcc.cometchat.unbanChatroomUser();
        }
    });

    jqcc('.loadChatroomPro').live('click',function(){
        var owner = jqcc(this).attr('owner');
        var uid = jqcc(this).attr('userid');
        username = jqcc(this).attr('username');
        var baseurl = jqcc.cometchat.getBaseUrl();
        var basedata = jqcc.cometchat.getBaseData();
        var roomid = jqcc.cometchat.getChatroomVars('currentroom');
        var roompass = jqcc.cometchat.getChatroomVars('currentp');
        var roomname = urlencode(jqcc.cometchat.getChatroomVars('currentroomname'));
        var popoutmode = jqcc.cometchat.getChatroomVars('popoutmode');
        var url = baseurl+'modules/chatrooms/chatrooms.php?action=loadChatroomPro&apiAccess='+jqcc.cometchat.getChatroomVars('checkBarEnabled')+'&owner='+owner+'&roomid='+roomid+'&basedata='+basedata+'&inviteid='+uid+'&roomname='+roomname;

        if(typeof(parent) != 'undefined' && parent != null && parent != self){
            var controlparameters = {"type":"modules", "name":"cometchat", "method":"unbanChatroomUser", "params":{"url":url, "action":"loadChatroomPro", "lang":username}};
            controlparameters = JSON.stringify(controlparameters);
            if(typeof(parent) != 'undefined' && parent != null && parent != self){
                parent.postMessage('CC^CONTROL_'+controlparameters,'*');
            } else {
                window.opener.postMessage('CC^CONTROL_'+controlparameters,'*');
            }
        } else {
            var controlparameters = {};
            jqcc.cometchat.loadChatroomPro(uid,owner,username,popoutmode);
        }
    });
});
