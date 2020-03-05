function openVmsPlayer(fcltId) {
    var url = contextRoot + '/mntr/vms/playVms.do?fcltId=' + fcltId;
    if (typeof evtOcrNo != 'undefined' && evtOcrNo != '') {
        url += '&evtOcrNo=' + evtOcrNo;
    }

    vmsPlayer = window.open(url, 'VmsPlayer', 'status=no,width=' + configurePopWidth + ',height=' + configurePopHeight);
}

// 팝업 CCTV 분할 영상
function openSplitVmsPlayer(fcltId) {
    var url = contextRoot + '/mntr/vms/playSplitVms.do?fcltId=';
    fcltClkCnt++;

    // 클릭한 CCTV의 시설물 ID만 URL에 표시하는 경우
    //	urlArray.push(fcltId);
      url += fcltId;
    //	if(urlArray.length > 9){
    //		for(var i = 1; i<urlArray.length; i++){
    //			urlArray[i-1] = urlArray[i];
    //		}
    //		urlArray.pop();
    //	}
    //url += '&cctvCnt=' + urlArray.length;

    // 누적해서 클릭한 CCTV의 시설물 ID를 URL에 표시하는 경우
    //splitUrl = url;
    //
    //if (fcltClkCnt > 9) {
    //    for (var i = 0; i < urlArray.length; i++) {
    //        urlArray[i] = urlArray[i+1];
    //    }
    //    urlArray.pop();
    //}
    //urlArray.push(fcltId);

    //splitUrl += fcltId;

    //if(fcltClkCnt > 1) {
    //    splitUrl += '&';
    //    for (var i = 0; i < urlArray.length; i++) {
    //        splitUrl += urlArray[i] + '-';
    //    }
    //    splitUrl = splitUrl.slice(0,-1);
    //}

    //url = splitUrl;

    //url += '&cctvCnt=' + urlArray.length;

    vmsPlayer = window.open(url, 'SplitVmsPlayer', 'status=no,width=' + 1400 + ',height=' + 800);
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

        destroyVms();
        $('#view-vms').empty();
        var chkInit = initInnodepCastnet();
        if (chkInit == 0) {
            alert("VMS 초기화 실패! VMS OCX 정상설치여부 확인바랍니다.")
        } else {
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
                $.each(cctv, function (i, v) {
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
                    $.each(cctv, function (i, v) {
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
    } catch (e) {
        console.log(e.name + ':' + e.message);
        alert('영상 재생에 실패했습니다.');
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
        type: 'POST',
        dataType: 'json',
        url: contextRoot + '/mntr/vms/insertViewLog.json',
        data: {
            fcltId: fcltId,
            evtOcrNo: evt
        },
        success: function (data) {
            console.log('[VMS] log saved. seqNo[' + data.seqNo + '] fcltId[' + fcltId + '] evtOcrNo[' + evt + ']');
        },
        error: function () {
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
        type: 'POST',
        dataType: 'json',
        url: contextRoot + '/mntr/vms/insertPtzLog.json',
        data: {
            fcltId: fcltId,
            ptzCmd: ptzCmd,
            evtOcrNo: evt
        },
        success: function (data) {
            console.log('[VMS] log saved. seqNo[' + data.seqNo + '] fcltId[' + fcltId + '] evtOcrNo[' + evt + ']');
        },
        error: function () {
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