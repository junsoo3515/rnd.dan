var splitWidth = 280;
var currentFcltId = null;
var currenIndex = null;

/* 단일체널(대화면)  팝업*/
function openVmsPlayer(fcltId) {
	var url = contextRoot + '/mntr/vms/playVms.do?fcltId=' + fcltId;
	if (typeof evtOcrNo != 'undefined' && evtOcrNo != '') {
		url += '&evtOcrNo=' + evtOcrNo;
	}

	vmsPlayer = window.open(url, 'VmsPlayer', 'status=no,width=' + configurePopWidth + ',height=' + configurePopHeight);
	
	
}
/* 대화면(rtsp) 팝업  대전/나주 */
function openRtspPlayer(fcltId) {
	var url = contextRoot + '/mntr/vms/playRtsp.do?fcltId=' + fcltId;
	if (typeof receivedEvtOcrNo != 'undefined' && receivedEvtOcrNo != '') {
		url += '&evtOcrNo=' + receivedEvtOcrNo;
	}
	window.open(url, 'RtspPlayer', 'status=no,width=' + configurePopWidth + ',height=' + configurePopHeight);
}

/* 5개채널  투망감시 1개싹 LOOPING */ 
function startCastNet(cctv) {
	try {
		var isVisible = $('#bottom').is(':visible');
		if(!isVisible) {
			collapse('bottom', false);
		}
		
		var evt = 'NO_EVT_OCR_NO';
		if (typeof receivedEvtOcrNo != 'undefined' && receivedEvtOcrNo != null) {
			evt = receivedEvtOcrNo;
		}
		
		TRIUM.destroy();
		var rtn = TRIUM.initialize('#view-vms', splitWidth, SCREEN_LAYOUT.SPLIT_1_5_CHANNEL,'play');
		if (rtn == 1) {
			setTimeout(function() {
				if(TRIUM.isInitialized) {
					TRIUM.connectServer(vmsIp, vmsId, vmsPassword, vmsPort);
					if(TRIUM.isConnected) {
						TRIUM.setLayout(5);
						TRIUM.OsdSetting();
						$('#TriumViewer').css('width', splitWidth * 5);
						var playList = '';
						$.each(cctv, function(i, v){
							if(i == 0) {
								playList = playList + v.fcltUid;
							}
							else {
								playList = playList + ':' + v.fcltUid;
							}
							insertViewLog(v.fcltId);
						});
	//					var playList = '1:1:1:1:1'; //임시
						TRIUM.allPlay(playList);
					}
				}
			}, 1000);
		}
	} catch (e) {
		console.log(e);
		alert('영상 재생에 실패했습니다.');
	}
}

function destroyVms() {
	if(TRIUM.isInitialized) {
		TRIUM.destroy();
	}
}

/* 최초 1개 cctv 선택감시  */
function startDesignation(fcltId, fcltUid) {
	try {
		if(typeof fcltUid == 'undefined') {
			alert('시설물 UID가 없습니다.');
			return false;
		}
		
		var isVisible = $('#bottom').is(':visible');
		if(!isVisible) {
			collapse('bottom', false);
		}
		
		TRIUM.initialize('#view-vms', splitWidth, SCREEN_LAYOUT.SPLIT_1_5_CHANNEL,'play');
		setTimeout(function() {
			if(TRIUM.isInitialized) {
				TRIUM.connectServer(vmsIp, vmsId, vmsPassword, vmsPort);
				if(TRIUM.isConnected) {
					TRIUM.setLayout(5);
					TRIUM.OsdSetting();
					$('#TriumViewer').css('width', splitWidth * 5);
//					TRIUM.setQuality(VMS_QUALITY.LOW);
//					TRIUM.play(deviceid, indexNo);
//					TRIUM.play(1, 0);
					TRIUM.play(fcltUid, 0);
//					TRIUM.setFontSize(8);
//					var list = TRIUM.getCameraList();
//					if(list != '') {
//						TRIUM.setQuality(VMS_QUALITY.LOW);
//						TRIUM.play(1, fcltUid);
//						TRIUM.setFontSize(8);
//					}
				}
			}
		}, 1000);
	}
	catch (e) {
		console.log(e);
		alert('영상 재생에 실패했습니다.');
	}
}
/* 선택감시 선택된 칸(2~5)에 영상 넣기 */
function addDesignation(fcltId, fcltUid, i) {
	try {
		if(typeof fcltUid == 'undefined') {
			alert('시설물 UID가 없습니다.');
			return false;
		}
		
		if (TRIUM.isInitialized) {
			setTimeout(function() {
				if(!TRIUM.isConnected) {
					TRIUM.connectServer(vmsIp, vmsId, vmsPassword, vmsPort);
				}
				if(TRIUM.isConnected) {
//					TRIUM.setQuality(VMS_QUALITY.LOW);
					TRIUM.OsdSetting();
					TRIUM.play(fcltUid, i);
//					TRIUM.setFontSize(8);
				}
			}, 500);
		}
		else {
			
			startDesignation(fcltId, fcltUid);
		}
	}
	catch (e) {
		console.log(e);
		alert('영상 재생에 실패했습니다.');
	}
}

/* 순환감시 */
function startRotationMntr(cctv) {
	try {
		$.each(cctv, function(i, v) {
			if(typeof v.fcltUid == 'undefined') {
				alert('영상재생이 불가능한 시설물[' + i + '] 입니다.');
			}
			else {
				TRIUM.destroy();
				var splitWidth = 320;
				TRIUM.initialize('#view-vms', splitWidth, SCREEN_LAYOUT.MATRIX_09_CHNNEL,'play');
				setTimeout(function() {
					if(TRIUM.isInitialized) {
						TRIUM.connectServer(vmsIp, vmsId, vmsPassword, vmsPort);
						if(TRIUM.isConnected) {
//							var playList = '1:1:1:1:1:1:1:1:1';
							var playList = '';
							TRIUM.setLayout(SCREEN_LAYOUT.MATRIX_09_CHNNEL);
							TRIUM.OsdSetting();
							$.each(cctv, function(i, v){
								if(i == 0) {
									playList = playList + v.fcltUid;
								}
								else {
									playList = playList + ':' + v.fcltUid;
								}
							});
							TRIUM.allPlay(playList);
//							var list = TRIUM.getCameraList();
//							if(list != '') {
//								var playList = '';
//								$.each(cctv, function(i, v){
//									if(i == 0) {
//										playList = playList + v.fcltUid;
//									}
//									else {
//										playList = playList + ':' + v.fcltUid;
//									}
//								});
//								TRIUM.setQuality(VMS_QUALITY.LOW);
//								TRIUM.allPlay(playList);
//								TRIUM.setFontSize(8);
//							}
						}
					}
				}, 500);
				
				
				// insertViewLog(v.cctvId);
			}
		});
		
	}
	catch (e) {
		console.log(e);
		alert('영상 재생에 실패했습니다.');
	}
}

function stopRotationMntr() {
	try {
		TRIUM.destroy();
	}
	catch (e) {
		console.log(e);
		alert('영상 재생에 실패했습니다.');
	}
}


/* 시설물 단일체널 재생 */
function startVideo(fcltId, fcltUid) {
	try {
		if(typeof fcltUid == 'undefined') {
			alert('시설물 UID가 없습니다.');
			return false;
		}
		
		var isVisible = $('#bottom').is(':visible');
		if(!isVisible) {
			collapse('bottom', false);
		}
		
		var splitWidth = 320;
		TRIUM.initialize('#view-vms', splitWidth, SCREEN_LAYOUT.MATRIX_01_CHNNEL,'play');
		
		setTimeout(function() {
			if (TRIUM.isInitialized) {
				TRIUM.connectServer(vmsIp, vmsId, vmsPassword, vmsPort);
				if (TRIUM.isConnected) {
					TRIUM.setLayout(SCREEN_LAYOUT.MATRIX_01_CHNNEL);
					TRIUM.OsdSetting();
//					TRIUM.play(diviceId, index);
//					TRIUM.play(1, 0);
					TRIUM.play(fcltUid, 0);
					insertViewLog(fcltId);
					currentFcltId = fcltId;
//					var list = TRIUM.getCameraList();
//					if (list != '') {
//						TRIUM.setQuality(VMS_QUALITY.LOW);
//						TRIUM.play(1, fcltUid);
//						TRIUM.setFontSize(8);
//						TRIUM.select(1);
//						insertViewLog(fcltId);
//						currentFcltId = fcltId;
//					}
				}
			}
		}, 500);
	}
	catch (e) {
		console.log(e);
		alert('영상 재생에 실패했습니다.');
	}
}

var currentIndex = 0;
var fclt = {};
function sendPtz(sFcltId, nPtzCmd) {
	if(typeof sFcltId != 'undefined') {
		if(typeof fclt[sFcltId] != 'undefined') {
			var nDevId = fclt[sFcltId];
			if(!TRIUM.isFixed(Number(nDevId))) {
			}
			else {
				console.log('고정형 카메라');
			}
			TRIUM.controlPTZ(Number(nDevId), nPtzCmd, 50);
		}
		else {
			$.post(contextRoot + '/mntr/fcltById.json', {
				fcltId : sFcltId
			}).done(function(data) {
				var nDevId = data.fcltUid;
				fclt[sFcltId] = data.fcltUid;
				console.log(fclt);
				if(!TRIUM.isFixed(Number(nDevId))) {
					
				}
				else {
					console.log('고정형 카메라');
				}
				TRIUM.controlPTZ(Number(nDevId), nPtzCmd, 50);
			});
		}
		
		insertPtzLog(sFcltId, nPtzCmd);
	}
	else {
		
	}
}

function sendPtzPreset(sFcltId, nPresetNo, nPtzCmd) {
	if(typeof sFcltId != 'undefined') {
		var result = '';
		if(nPtzCmd == PTZ_PRESET_MOVE) {
			console.log('PTZ_PRESET_MOVE');
			result = TRIUM.presetGo(nPresetNo);
		}
		else if(nPtzCmd == PTZ_PRESET_EDIT) {
			console.log('PTZ_PRESET_EDIT');
			result = TRIUM.presetSave(nPresetNo);
		}
		else if(nPtzCmd == PTZ_PRESET_DELETE) {
			result = TRIUM.presetRemove(nPresetNo);
		} 
		insertPtzLog(sFcltId, nPtzCmd + '[' + nPresetNo + ']');
	}
	else {
		
	}
}

// ViewLog
function insertViewLog(fcltId) {
	var evt = 'NO_EVT_OCR_NO';
	if (typeof receivedEvtOcrNo != 'undefined' && receivedEvtOcrNo != '') {
		evt = receivedEvtOcrNo;
	}

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

// PtzLog
function insertPtzLog(fcltId, ptzCmd) {
	var evt = 'NO_EVT_OCR_NO';
	if (typeof receivedEvtOcrNo != 'undefined' && receivedEvtOcrNo != '') {
		evt = receivedEvtOcrNo;
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