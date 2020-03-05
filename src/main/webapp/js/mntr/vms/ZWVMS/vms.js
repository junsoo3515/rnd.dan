var ptControlDir = {
	Up : 1,
	UpRight : 2,
	Right : 3,
	DownRight : 4,
	Down : 5,
	DownLeft : 6,
	Left : 7,
	UpLeft : 8
};

var PTZ_UP = 1;
var PTZ_DOWN = 5;
var PTZ_LEFT = 7;
var PTZ_RIGHT = 3;

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

var PTZ_PRESET = {
	GO : PTZ_PRESET_MOVE,
	SET : PTZ_PRESET_EDIT,
	CLEAR : PTZ_PRESET_DELETE
}

var currentFcltId = null;
var currentIndex = null;
var isVmsInit = false;

function openVmsPlayer(fcltId, fcltUid) {
	var url = contextRoot + '/mntr/vms/playVms.do?fcltId=' + fcltId;
	if (typeof evtOcrNo != 'undefined' && evtOcrNo != '') {
		url += '&evtOcrNo=' + evtOcrNo;
	}
	vmsPlayer = window.open(url, 'VmsPlayer', 'status=no,width=' + configurePopWidth + ',height=' + configurePopHeight);
}

function openRtspPlayer(fcltId) {
	var url = contextRoot + '/mntr/vms/playRtsp.do?fcltId=' + fcltId;
	if (typeof evtOcrNo != 'undefined' && evtOcrNo != '') {
		url += '&evtOcrNo=' + evtOcrNo;
	}
	vmsPlayer = window.open(url, 'VmsPlayer', 'status=no,width=' + configurePopWidth + ',height=' + configurePopHeight);
}

function startCastNet(cctv) {
	try {
		var evt = 'NO_EVT_OCR_NO';
		if (typeof evtOcrNo != 'undefined' && evtOcrNo != '') {
			evt = evtOcrNo;
		}
		
		var isVisible = $('#bottom').is(':visible');
		if (!isVisible) {
			collapse('bottom', false);
		}

		var widthI = $('#toggleBottom').css('width');
		var widthII = $('#handle-vms').css('width');

		widthI = widthI.replace('px', '');
		widthII = widthII.replace('px', '');

		var width = Number(widthI) - Number(widthII) - 20;
		$('#ZWVmsLiveHostClient').css('width', width + 'px');

		setTimeout(function() {
			var ZWVmsLiveHostClient = document.getElementById('ZWVmsLiveHostClient');
			if(ipMappingVms != '') {
				ZWVmsLiveHostClient.setTunneling(1);
				ZWVmsLiveHostClient.setupAccessTokenServer(vmsIp);
			}
			ZWVmsLiveHostClient.setBorder(3);
			ZWVmsLiveHostClient.setupGridLayout(5, 1);
			$.each(cctv, function(i, v) {
				if (typeof v.fcltUid == 'undefined') {
					alert('영상재생이 불가능한 시설물[' + i + '] 입니다.');
				}
				else {
					if (i == 0) {
						currentFcltId = v.fcltId;
						currentIndex = 0;
					}
					insertViewLog(v.fcltId, evt);
					var result = ZWVmsLiveHostClient.createPlayer(i, 0, vmsId, vmsPassword, v.fcltUid);
				}
			});
			ZWVmsLiveHostClient.selectPlayer(0, 0);
		}, 1000);

	}
	catch (e) {
		console.log(e);
		alert('영상 재생에 실패했습니다.');
	}
}

function sendPtz(sFcltId, nPtzCmd, nIndex) {
	var nCode = '';
	if (typeof sFcltId != 'undefined') {
		var ZWVmsLiveHostClient = document.getElementById("ZWVmsLiveHostClient");

		if (nPtzCmd == PTZ_CONTROL_STOP) {
			nCode = ZWVmsLiveHostClient.stopPanTilt(nIndex, 0);
			nCode = ZWVmsLiveHostClient.stopZoom(nIndex, 0);
		}
		else if (nPtzCmd == PTZ_ZOOM_IN) {
			nCode = ZWVmsLiveHostClient.continusousZoom(nIndex, 0, 2);
		}
		else if (nPtzCmd == PTZ_ZOOM_OUT) {
			nCode = ZWVmsLiveHostClient.continusousZoom(nIndex, 0, -2);
		}
		else {
			nCode = ZWVmsLiveHostClient.continuousPanTilt(nIndex, 0, nPtzCmd, 2);
		}

		getZwVmsSdkLogs(nCode);
		insertPtzLog(sFcltId, nPtzCmd);
	}
	else {

	}
}

function sendPtzPreset(sFcltId, nPresetNo, nPtzCmd, nIndex) {
	var nCode = '';
	if (typeof sFcltId != 'undefined') {
		var ZWVmsLiveHostClient = document.getElementById("ZWVmsLiveHostClient");

		if (nPtzCmd == PTZ_PRESET_MOVE) {
			nCode = ZWVmsLiveHostClient.moveToPreset(nIndex, 0, nPresetNo);
		}
		else if (nPtzCmd == PTZ_PRESET_EDIT) {
			nCode = ZWVmsLiveHostClient.registerPreset(nIndex, 0, nPresetNo);
		}
		else if (nPtzCmd == PTZ_PRESET_DELETE) {
			nCode = ZWVmsLiveHostClient.removePreset(nIndex, 0, nPresetNo);
		}

		getZwVmsSdkLogs(nCode);
		insertPtzLog(sFcltId, nPtzCmd + '[' + nPresetNo + ']');
	}
	else {

	}
}

function insertViewLog(fcltId) {
	var evt = 'NO_EVT_OCR_NO';
	if (typeof evtOcrNo != 'undefined' && evtOcrNo != '') {
		evt = evtOcrNo;
	}

	$.ajax({
		type : 'POST',
		dataType : 'json',
		url : contextRoot + '/mntr/vms/insertViewLog.json',
		data : {
			fcltId : fcltId,
			evtOcrNo : evt
		},
		success : function(data) {
			console.log('[VMS] log saved. seqNo[' + data.seqNo + '] fcltId[' + fcltId + '] evtOcrNo[' + evt + ']');
		},
		error : function() {
			alert('로그 저장에 실패했습니다.');
		}
	});
}

function insertPtzLog(fcltId, ptzCmd) {
	var evt = 'NO_EVT_OCR_NO';
	if (typeof evtOcrNo != 'undefined' && evtOcrNo != '') {
		evt = evtOcrNo;
	}

	$.ajax({
		type : 'POST',
		dataType : 'json',
		url : contextRoot + '/mntr/vms/insertPtzLog.json',
		data : {
			fcltId : fcltId,
			ptzCmd : ptzCmd,
			evtOcrNo : evt
		},
		success : function(data) {
			console.log('[VMS] log saved. seqNo[' + data.seqNo + '] fcltId[' + fcltId + '] evtOcrNo[' + evt + ']');
		},
		error : function() {
			alert('로그 저장에 실패했습니다.');
		}
	});
}

function getZwVmsSdkLogs(nCode) {
	switch (nCode) {
		case 0x00000000:
			console.log('ZWVMSSDK_NO_ERROR                              ');
			return true;
			break;
		case 0x00000001:
			console.log('ZWVMSSDK_ERROR_CANNOT_CONNECT_DATABASE         ');
			break;
		case 0x00000002:
			console.log('ZWVMSSDK_ERROR_CANNOT_CREATE_OBJECT            ');
			break;
		case 0x00000003:
			console.log('ZWVMSSDK_ERROR_CANNOT_CREATE_WORKER            ');
			break;
		case 0x00000004:
			console.log('ZWVMSSDK_ERROR_INVALID_SESSION_ID              ');
			break;
		case 0x00000005:
			console.log('ZWVMSSDK_ERROR_INVALID_TIME_FORMAT             ');
			break;
		case 0x00000006:
			console.log('ZWVMSSDK_ERROR_INVALID_TIME_RANGE              ');
			break;
		case 0x00000007:
			console.log('ZWVMSSDK_ERROR_CANNOT_FOUND_VALID_SEGMENTS     ');
			break;
		case 0x00000008:
			console.log('ZWVMSSDK_ERROR_CANNOT_CREATE_DESTINATION_FILE  ');
			break;
		case 0x00000009:
			console.log('ZWVMSSDK_ERROR_INVALID_CONNECTION_STRING       ');
			break;
		case 0x0000000A:
			console.log('ZWVMSSDK_ERROR_CANNOT_CREATE_TEMPORAL_FILE     ');
			break;
		case 0x0000000B:
			console.log('ZWVMSSDK_ERROR_CANNOT_CAN_NOT_ACCESS_VIDEO_FILE');
			break;
		case 0x0000000C:
			console.log('ZWVMSSDK_ERROR_CANNOT_CAN_NOT_ACCESS_INDEX_FILE');
			break;
		case 0x0000000D:
			console.log('ZWVMSSDK_ERROR_CANNOT_CAN_NOT_ACCESS_SERVER    ');
			break;
		case 0x0000000E:
			console.log('ZWVMSSDK_ERROR_CANNOT_CAN_NOT_WRITE_FILE       ');
			break;
		case 0x0000000F:
			console.log('ZWVMSSDK_ERROR_UNKNOWN_USER                    ');
			break;
		case 0x00000010:
			console.log('ZWVMSSDK_ERROR_INVALID_PASSWORD                ');
			break;
		case 0x80000000:
			console.log('ZWVMSSDK_ERROR_UNKNOWN                         ');
			break;
		default:
			break;
	}
}