var zWVmsLiveHostClient = null;
var isVmsInit = false;

$(function() {
	$(window).unload(function() {
		if (isVmsInit) {
			releaseVms();
		}
	});
});

function initVms(selector) {
	/*
	var object = $('<object/>', {
		id: 'zWVmsLiveHostClient',
		width: '100%',
		height: '100%',
		classid: 'clsid:15FDDB52-459F-4800-95C4-6EC054943A46',
		style: 'width: 100%; height: 100%;'
	});
	
	$(selector).html(object);
	setTimeout(function(){
		zWVmsLiveHostClient = document.getElementById('zWVmsLiveHostClient');
		if (zWVmsLiveHostClient != null) {
			isVmsInit = true;
		}
		else {
			alert('VMS Init 실패');
		}
	}, 1000);
	*/
	isVmsInit = true;
}

function setupGridLayout(nCol, nRow) {
	var result = zWVmsLiveHostClient.setupGridLayout(nCol, nRow);
	console.log('[vms] setupGridLayout');
	return getZwVmsSdkLogs(result);
}

function releaseVms() {
	var result = zWVmsLiveHostClient.release();
	return getZwVmsSdkLogs(result);
}

function createPlayer(nCol, nRow, sId, sPassword, sUid) {
	var result = zWVmsLiveHostClient.createPlayer(nCol, nRow, sId, sPassword, sUid);
	console.log('[vms] createPlayer');
	getZwVmsSdkLogs(result);
}

function selectPlayer() {
	var result = zWVmsLiveHostClient.selectPlayer(nCol, nRow);
	getZwVmsSdkLogs(result);
}

function setBorder(nWidth) {
	var result = zWVmsLiveHostClient.setBorder(nWidth);
	getZwVmsSdkLogs(result);
}

function reload(nCol, nRow, sId, sPassword, sUid) {
	var result = zWVmsLiveHostClient.reload(nWidth);
}

function play(nCol, nRow) {
	var result = zWVmsLiveHostClient.play(nCol, nRow);
	getZwVmsSdkLogs(result);
}

function stop(nCol, nRow) {
	var result = zWVmsLiveHostClient.stop(nCol, nRow);
	getZwVmsSdkLogs(result);
}

function snapShot(nCol, nRow, sPath) {
	var result = zWVmsLiveHostClient.snapShot(nCol, nRow);
	getZwVmsSdkLogs(result);
}

function startListen(nCol, nRow) {
	var result = zWVmsLiveHostClient.startListen(nCol, nRow);
	getZwVmsSdkLogs(result);
}

function stopListen(nCol, nRow) {
	var result = zWVmsLiveHostClient.stopListen(nCol, nRow);
	getZwVmsSdkLogs(result);
}

function startSpeak(nCol, nRow) {
	var result = zWVmsLiveHostClient.startSpeak(nCol, nRow);
	getZwVmsSdkLogs(result);
}

function stopSpeak(nCol, nRow) {
	var result = zWVmsLiveHostClient.stopSpeak(nCol, nRow);
	getZwVmsSdkLogs(result);
}

function continuousPanTilt(nCol, nRow, dir, nSpeed) {
	// 1 ~ 10
	var result = zWVmsLiveHostClient.continuousPanTilt(nCol, nRow, dir, nSpeed);
	getZwVmsSdkLogs(result);
}

function continusousZoom(nCol, nRow, nSpeed) {
	// -10 ~ 10
	var result = zWVmsLiveHostClient.continusousZoom(nCol, nRow, nSpeed);
	getZwVmsSdkLogs(result);
}

function stopPanTilt(nCol, nRow) {
	var result = zWVmsLiveHostClient.stopPanTilt(nCol, nRow);
	getZwVmsSdkLogs(result);
}

function stopZoom(nCol, nRow) {
	var result = zWVmsLiveHostClient.stopZoom(nCol, nRow);
	getZwVmsSdkLogs(result);
}

function registerPreset(nCol, nRow, nIndex) {
	var result = zWVmsLiveHostClient.registerPreset(nCol, nRow, nIndex);
	getZwVmsSdkLogs(result);
}
function removePreset(nCol, nRow, nIndex) {
	var result = zWVmsLiveHostClient.removePreset(nCol, nRow, nIndex);
	getZwVmsSdkLogs(result);
}

function moveToPreset(nCol, nRow, nIndex) {
	var result = zWVmsLiveHostClient.moveToPreset(nCol, nRow, nIndex);
	getZwVmsSdkLogs(result);
}

function showOnScreenPtz(nCol, nRow, bShow) {
	var result = zWVmsLiveHostClient.showOnScreenPtz(nCol, nRow, bShow);
	getZwVmsSdkLogs(result);
}

function showOnScreenInformation(nCol, nRow, bShow) {
	var result = zWVmsLiveHostClient.showOnScreenInformation(nCol, nRow, bShow);
	getZwVmsSdkLogs(result);
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