var splitWidth = 280;
var currentFcltId = null;
var currenIndex = null;
var designatedFcltUids = [
		'', '', '', ''
];

function openVmsPlayer(fcltId, fcltUid) {
	var url = contextRoot + '/mntr/vms/playVms.do?fcltId=' + fcltId;
	if (typeof evtOcrNo != 'undefined' && evtOcrNo != '') {
		url += '&evtOcrNo=' + evtOcrNo;
	}
	window.open(url, 'VmsPlayer', 'status=no,width=' + configurePopWidth + ',height=' + configurePopHeight);
}

function openRtspPlayer(fcltId) {
	var url = contextRoot + '/mntr/vms/playRtsp.do?fcltId=' + fcltId;
	if (typeof evtOcrNo != 'undefined' && evtOcrNo != '') {
		url += '&evtOcrNo=' + evtOcrNo;
	}
	window.open(url, 'RtspPlayer', 'status=no,width=' + configurePopWidth + ',height=' + configurePopHeight);
}

function startCastNet(cctv) {
	try {
		destroyInnodep();

		var isVisible = $('#bottom').is(':visible');
		if (!isVisible) {
			collapse('bottom', false);
		}

		if (!isInnodepInit) {
			initInnodep();
			$('#innodep').show();
			$('#innodep').css('width', splitWidth * 5);
		}

		setTimeout(function() {
			if (cctv.length == 1) {
				innodep.DeviceID = eval(cctv.fcltUid);
			}
			else {
				innodep.SetVideoSplit(convertViewModeInnodep(cctv.length));
				innodep.SetLiveScaling(1);
				$.each(cctv, function(i, v) {
					if (typeof v.fcltUid == 'undefined') {
						alert('영상재생이 불가능한 시설물[' + i + '] 입니다.');
					}
					else {
						if (i == 0) {
							currentFcltId = v.fcltId;
						}
						innodep.SetLiveDeviceInfo(i + 1, eval(v.fcltUid), 0);
						insertViewLog(v.fcltId);
					}

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
					console.log('==================================================');
				}
				else {
					console.log('innodep startVideoLive : not logon');
					isInnodepLogon = false;
					console.log('==================================================');
				}
			}
		}, 500);
	}
	catch (e) {
		console.log(e);
		alert('영상 재생에 실패했습니다.');
	}
}

function startDesignation(fcltId, fcltUid) {
	try {
		var isVisible = $('#bottom').is(':visible');
		if (!isVisible) {
			collapse('bottom', false);
		}
		destroyInnodep();
		initInnodep();
		$('#innodep').show();
		$('#innodep').css('width', splitWidth * 5);
		setTimeout(function() {
			innodep.SetVideoSplit(convertViewModeInnodep(5));
			innodep.SetLiveScaling(1);
			innodep.SetLiveDeviceInfo(1, eval(fcltUid), 0);
			for (var i = 0; i < designatedFcltUids.length; i++) {
				if (designatedFcltUids[i] != '') {
					console.log(designatedFcltUids[i]);
					innodep.SetLiveDeviceInfo(i + 2, eval(designatedFcltUids[i]), 0);
				}
			}

			var result = innodep.LogOn(vmsIp, eval(vmsPort), vmsId, vmsPassword, 1);
			if (result == 1) {
				innodep.SetLabelFont(25);
				innodep.SetViewInfo(3);
				// insertViewLog(fcltId);
			}
		}, 500);
	}
	catch (e) {
		console.log(e);
		alert('영상 재생에 실패했습니다.');
	}
}

function startRotationMntr(cctv) {
	try {
		destroyInnodep();
		initInnodep();
		$('#innodep').show();
		setTimeout(function() {
			$.each(cctv, function(i, v) {
				if (typeof v.fcltUid == 'undefined') {
					alert('영상재생이 불가능한 시설물[' + i + '] 입니다.');
				}
				else {
					innodep.SetLiveDeviceInfo(i + 1, eval(v.fcltUid), 0);
					insertViewLog(v.cctvId);
				}
			});
			
			innodep.SetVideoSplit(9);
			innodep.SetLiveScaling(1);
			var result = innodep.LogOn(vmsIp, eval(vmsPort), vmsId, vmsPassword, 1);
			if (result == 1) {
				innodep.SetLabelFont(25);
				innodep.SetViewInfo(3);
			}
		},500);
	}
	catch (e) {
		console.log(e);
		alert('영상 재생에 실패했습니다.');
	}
}

function stopRotationMntr() {
	try {
		destroyInnodep();
	}
	catch (e) {
		console.log(e);
	}
}

function addDesignation(fcltId, fcltUid, i) {
	try {
		if (typeof fcltUid == 'undefined') {
			alert('시설물 UID가 없습니다.');
			return false;
		}
		
		var isVisible = $('#bottom').is(':visible');
		if (!isVisible) {
			collapse('bottom', false);
		}

		designatedFcltUids[i - 1] = fcltUid;

		destroyInnodep();
		initInnodep();
		$('#innodep').show();
		$('#innodep').css('width', splitWidth * 5);

		setTimeout(function() {
			innodep.SetVideoSplit(convertViewModeInnodep(5));
			innodep.SetLiveScaling(1);
			innodep.SetLiveDeviceInfo(1, eval(fcltUid), 0);

			for (var i = 0; i < designatedFcltUids.length; i++) {
				if (designatedFcltUids[i] != '') {
					console.log(designatedFcltUids[i]);
					innodep.SetLiveDeviceInfo(i + 2, eval(designatedFcltUids[i]), 0);
				}
			}

			var result = innodep.LogOn(vmsIp, eval(vmsPort), vmsId, vmsPassword, 1);
			if (result == 1) {
				innodep.SetLabelFont(25);
				innodep.SetViewInfo(3);
				// insertViewLog(fcltId);
			}
		}, 500);

	}
	catch (e) {
		console.log(e);
		alert('영상 재생에 실패했습니다.');
	}
}

function startVideo(fcltId, fcltUid) {
	try {
		if (typeof fcltUid == 'undefined') {
			alert('시설물 UID가 없습니다.');
			return false;
		}

		var isVisible = $('#bottom').is(':visible');
		if (!isVisible) {
			collapse('bottom', false);
		}

		destroyInnodep();
		if (!isInnodepInit) {
			initInnodep();
			$('#innodep').show();
			$('#innodep').css('width', splitWidth);
		}

		setTimeout(function() {
			innodep.DeviceID = eval(fcltUid);
			innodep.SetLiveScaling(1);
			innodep.SetLabelFont(25);
			innodep.SetViewInfo(3);
			var result = innodep.LogOn(vmsIp, eval(vmsPort), vmsId, vmsPassword, 1);
			if (result == 1) {
				console.log('startVideo : innodep');
				isInnodepLogon = true;
				currentFcltId = fcltId;
				console.log('==================================================');
			}
			else {
				console.log('innodep startVideoLive : not logon');
				isInnodepLogon = false;
				console.log('==================================================');
			}
		}, 500);
	}
	catch (e) {
		console.log(e);
		alert('영상 재생에 실패했습니다.');
	}
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

function destroyVms() {
	destroyInnodep();
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

function convertViewModeInnodep(n) {
	if (1 == n) {
		return 1;
	}
	else if (2 == n) {
		return 2;
	}
	else if (3 == n) {
		return 3;
	}
	else if (4 == n) {
		return 40;
	}
	else if (5 == n) {
		return 5;
	}
}
