function openVmsPlayer(fcltId) {
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
	var evt = 'NO_EVT_OCR_NO';
	if (typeof evtOcrNo != 'undefined' && evtOcrNo != '') {
		evt = evtOcrNo;
	}

	destroyInnodep();
	$('#view-vms').empty();
	initInnodepCastnet();
	
	var widthI = $('#toggleBottom').css('width');
	var widthII = $('#handle-vms').css('width');
	widthI = widthI.replace('px', '');
	widthII = widthII.replace('px', '');

	var width = Number(widthI) - Number(widthII) - 20;
	$('#innodep').css('width', width + 'px');
	
	if (cctv.length == 1) {
		innodep.DeviceID = cctv.fcltUid;
	}
	else {
		innodep.SetVideoSplit(convertViewModeInnodep(cctv.length));
		innodep.SetLiveScaling(1);
		$.each(cctv, function(i, v) {
			innodep.SetLiveDeviceInfo(i + 1, v.fcltUid, 0);
			console.log(v.fcltUid);
			insertViewLog(v.fcltId, evt);
		});

		var result = innodep.LogOn(vmsIp, eval(vmsPort), vmsId, vmsPassword, 1);
		if (result == 1) {
			innodep.SetLabelFont(25);
			innodep.SetViewInfo(3);
			isInnodepLogon = true;

			// 프리셋 이동
			$.each(cctv, function(i, v) {
				if (v.presetNum != '0') {
					innodep.SetOcxSelect(eval(i));
					sendPtzPresetInnodep(eval(v.presetNum), PTZ_PRESET_MOVE);
				}
			});

			innodep.SetOcxSelect(0);
			console.log('innodep StartVideoLive : ok');
			console.log('==================================================');
		}
		else {
			console.log('innodep StartVideoLive : not logon');
			isInnodepLogon = false;
			console.log('==================================================');
		}
	}
}

function destroyVms() {
	destroyInnodep();
}

function sendPtz(fcltId, nCmd) {
	console.log('[VMS] received ptz cmd (' + nCmd + ').');
	if (isInnodepInit) {
		sendPtzInnodep(nCmd);
		insertPtzLog(fcltId, nCmd);
	}
	else {
		// alert('재생중인 카메라가 없습니다.');
	}
}

function sendPtzPreset(fcltId, nPresetNo, nPtzPresetMode) {
	console.log('[VMS] received ptz [' + fcltId + '] cmd (' + nPtzPresetMode + '[' + nPresetNo + ']).');
	if (isInnodepInit) {
		sendPtzPresetInnodep(nPresetNo, nPtzPresetMode);
		insertPtzLog(fcltId, nPtzPresetMode + '[' + nPresetNo + ']');
	}
	else {
		alert('재생중인 카메라가 없습니다.');
	}
}

function insertViewLog(fcltId, evtOcrNo) {
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


function convertViewModeInnodep(n) {
	if 		(1 == n) { return 1; }
	else if (2 == n) { return 2; }
	else if (3 == n) { return 3; }
	else if (4 == n) { return 40; }
	else if (5 == n) { return 5; }
}