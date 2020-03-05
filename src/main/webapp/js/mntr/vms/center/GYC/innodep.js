var PTZ_UP = 1;
var PTZ_DOWN = 7;
var PTZ_LEFT = 3;
var PTZ_RIGHT = 5;
var PTZ_ZOOM_IN = 11;
var PTZ_ZOOM_OUT = 12;
var PTZ_FOCUS_IN = 9;
var PTZ_FOCUS_OUT = 10;

var PTZ_CONTROL_START = 29;
var PTZ_CONTROL_STOP = 30;
var PTZ_CONTROL_END = 31;

var PTZ_PRESET_MOVE = 32;
var PTZ_PRESET_EDIT = 33;
var PTZ_PRESET_DELETE = 34;

/*
var PTZ_LEFT_UP = 0;
var PTZ_RIGHT_UP = 2;
var PTZ_CENTER = 4;
var PTZ_LEFT_DOWN = 6;
var PTZ_RIGHT_DOWN = 8;
var PTZ_AUTOPAN_ON = 13;
var PTZ_AUTOPAN_OFF = 14;
var PTZ_TOURING_START = 15;
var PTZ_TOURING_STOP = 16;
var PTZ_POWER_ON = 17;
var PTZ_POWER_OFF = 18;
var PTZ_WIPER_ON = 19;
var PTZ_WIPER_OFF = 20;
var PTZ_LAMP_ON = 21;
var PTZ_LAMP_OFF = 22;
var PTZ_AUX_1_ON = 23;
var PTZ_AUX_1_OFF = 24;
var PTZ_AUX_2_ON = 25;
var PTZ_AUX_2_OFF = 26;
var PTZ_IRIS_ON = 27;
var PTZ_IRIS_OFF = 28;
var PTZ_SPEED_CHANGE = 35;
var PTZ_OSD_MENU_ON = 36;
var PTZ_OSD_MENU_OFF = 37;
var PTZ_OSD_MENU_ENTER = 38;
var PTZ_OSD_MENU_ESC = 39;
var PTZ_PRESET_HOME = 40;
*/

var isInnodepInit = false;
var isInnodepLogon = false;
var innodep = null;

$(function() {
	$(window).unload(function() {
		if (isInnodepInit) {
			destroyInnodep();
		}
	});
});

function initInnodep(iWidth, iHeight) {
	var object = $('<object/>', {
		id : 'innodep',
		name : 'innodep',
		style : 'width:100%; height: 100%; display:none;',
		classid : 'CLSID:CD3799FB-DFE1-4FA7-AE98-4734FE267BE9',
		codebase : 'wnetwebsdk.CAB#version=1,0,0,0'
	});
	
	if(!$('#innodep').exists()) {
		$('#view-vms').html(object);
	}
	innodep = document.getElementById('innodep');
	var result = innodep.CreateInstance(); // success : 1, failure : 0
	if(result == 1) { 
		console.log('[VMS] innodep : init'); 
		isInnodepInit = true;
	} 
	else {
		console.log('[VMS] innodep : init failure');
		isInnodepInit = false;
	}
	
	if(iWidth) {
		$('#view-vms').css('width', iWidth);
	}
	if(iHeight) {
		$('#view-vms').css('height', iHeight);
	}
}

function destroyInnodep() {
	if (isInnodepInit) {
		if(innodep != null && typeof innodep != 'undefined') {
			console.log('[VMS] innodep : destroy');
			if(typeof canAudio != 'undefined' && canAudio) { innodep.SoundOnOff(0); }
			if(typeof canMic != 'undefined' && canMic) { innodep.SendAudio(0); }
			
			innodep.SendPTZ(PTZ_CONTROL_END);
			innodep.StopVideoLive();
			innodep.LogOff();
			innodep.Destroy();
			innodep = null;
			mainVms = '';
			isInnodepInit = false;
			isInnodepLogon = false;
		}
		else {
			console.log('[VMS] innodep : is null');
		}
	}
	else {
		console.log('[VMS] innodep : not initialized');
	}
}

function startVideoInnodep(deviceID) {
	var result = innodep.LogOn(vmsInnodepIp, eval(vmsInnodepPort), vmsInnodepId, vmsInnodepPassword, 1);
	if(result == 1) {
		if (deviceID) {
			console.log('[VMS] innodep startVideoLive : deviceID[' + deviceID + ']');
			innodep.DeviceID = deviceID;
		}
		innodep.SetViewInfo(3);
		innodep.StartVideoLive();
				
		isInnodepLogon = true;
		console.log('==================================================');
	}
	else {
		console.log('innodep startVideoLive : not logon');
		isInnodepLogon = false;
		console.log('==================================================');
	}
}

function stopVideoInnodep() {
	innodep.StopVideoLive();
	innodep.LogOff();
	isInnodepLogon = false;
}

function sendPtzInnodep(nCmd) {
	if (nCmd == PTZ_CONTROL_STOP) {
		innodep.SendPTZ(nCmd);
		innodep.SendPTZ(PTZ_CONTROL_END);
	}
	else {
		innodep.SendPTZ(PTZ_CONTROL_START);
		innodep.SendPTZ(nCmd);
	}
}

function sendPtzPresetInnodep(nPresetNo, nPtzPresetMode) {
	var result = '';
	if (nPtzPresetMode == PTZ_PRESET_MOVE) {
		result = innodep.SendPTZPreset(PTZ_PRESET_MOVE, nPresetNo, 0, 0);
	}
	else if (nPtzPresetMode == PTZ_PRESET_EDIT) {
		result = innodep.SendPTZPreset(PTZ_PRESET_EDIT, nPresetNo, 0, 0);
	}
	else if (nPtzPresetMode == PTZ_PRESET_DELETE) {
		result = innodep.SendPTZPreset(PTZ_PRESET_DELETE, nPresetNo, 0, 0);
	}
	console.log('sendPtzPresetInnodep : ' + nPresetNo);
	console.log('sendPtzPresetInnodep : ' + nPtzPresetMode);
	console.log('sendPtzPresetInnodep : ' + result);
}

function setCctvInnodep(nIndex, nDeviceID) {
	innodep.SetLiveDeviceInfo(nIndex, nDeviceID, 0);
}

var PTZ_PRESET = {
	GO : 32,
	SET : 33,
	CLEAR : 34 
};