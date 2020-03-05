$(function() {
	$(window).unload(function() {
		if (TRIUM.isInitialized) {
			TRIUM.allStop();
			TRIUM.disconnectServer();
			TRIUM.release();
		}
	});
});

var TRIUM = {
	ocx : null,
	cameraList : null,
	nIndex : null,
	nDeviceId : null,
	playTy : null,
	isInitialized : false,
	isConnected : false,
	initialize : function(selector, splitWidth, screenLayout, playTy) {
		var rtn = 1;
		// playTy : search-과거영상, play-현재영상
		// 현재 : 7FFA58B1-4D7A-4ed1-863E-C48417E82B2D
		// 과거 : 7FFA58B1-4D7A-4ed1-863E-C48417E82B2D
		// codebase : 'ActiveX/TriumIWebViewer.cab#version=1,0,1,36960',
		var object = $('<object/>', { 
			id : 'TriumViewer', 
			classid : 'CLSID:50446E1F-49CF-4468-A385-268D811ED59B',
			style : 'width:100%; height: 100%; display:none;'
			});
		if (playTy == 'search') {
			object = $('<object/>', { 
				id : 'TriumViewer', 
				classid : 'CLSID:7FFA58B1-4D7A-4ed1-863E-C48417E82B2D',
				style : 'width:100%; height: 100%; display:none;'
				});
		}

		if (this.isInitialized) {
			console.log('[VMS] already initialized');
		}
		else {
			object.hide();

			$(selector).html(object);
			var element = document.getElementById('TriumViewer');
			this.setOcx(element);
			if (this.ocx != null) {
				try {
	//				var result = this.ocx.InitializeOCX();
					var result = true;
	//				this.InitSelectedTileCallback();
					console.log('[VMS] initialize ' + result);
					this.isInitialized = result;
					this.playTy = playTy;
					if (result && typeof splitWidth != 'undefined') {
	//					element.setAttribute('width',splitWidth); 
	//					element.setAttribute('height',Math.floor(3 * splitWidth / 4)); 
	//					this.setDisplaySize(splitWidth, Math.floor(3 * splitWidth / 4));
						if (typeof screenLayout != 'undefined') {
							if(screenLayout == SCREEN_LAYOUT.MATRIX_09_CHNNEL) {
	//							this.setLayout(screenLayout);
								this.ocx.Disconnect();
							}
							else {
								this.ocx.Disconnect();
	//							this.setLayout(screenLayout);
							}
						}
						$('#TriumViewer').css({
							'width' : '100%',
							'height' : '100%',
							'display' : 'block'
						});
					}
				} catch(e) {
					console.log(e.name + ':' + e.message);
					this.isInitialized = false;
					rtn = 0;
				}
			}
			else {
				rtn = 0;
			}
		}
		if (rtn == 0) {
			alert('에러 : OCX 초기화에 실패했습니다.설치확인 바랍니다.');
		}
		return rtn;
	},
	release : function() {
		if (this.isInitialized) {
			this.isInitialized = false;
			this.ocx = null;
			this.cameraList = null;
			this.nDeviceId = null;
			this.nIndex = null;
			this.playTy = null;
//			var result = this.ocx.ReleaseOCX();
//			console.log('[VMS] release ' + result);
//			if (result) {
//				this.isInitialized = false;
//				this.ocx = null;
//				this.cameraList = null;
//			}
//			else {
//				alert('에러 : OCX 해제에 실패했습니다.');
//			}
		}
		else {
			console.log('[VMS] not initialized');
		}
	},
	connectServer : function(sIpAddress, sAccessId, sAccessPw, sPort) {
		if (this.isConnected) {
			console.log('[VMS] already connected');
		}
		else {
			var result = this.ocx.Connect(sIpAddress, sPort, sAccessId, sAccessPw);
			console.log('[VMS] connectServer ' + result);
			this.isConnected = result;
			if (!result) {
				alert('에러 : OCX 서버 접속에 실패했습니다.');
			}
		}
	},
	disconnectServer : function() {
		if (this.isConnected) {
			this.ocx.Disconnect();
			this.isConnected = false;
//			var result = this.ocx.Disconnect();
//			console.log('[VMS] disconnectServer ' + result);
//			if (result) {
//				this.isConnected = false;
//			}
//			else {
//				alert('에러 : OCX 서버 접속끊기에 실패했습니다.');
//			}
		}
		else {
			console.log('[VMS] not connected');
		}
	},
	getCameraList : function() {
		if (this.isConnected) {
			if (this.cameraList == null) {
				var cameraList = this.ocx.GetCameras();
				console.log('[VMS] getCameraList');
				this.setCameraList(cameraList)
				return cameraList;
			}
			else {
				return this.cameraList;
			}
		}
		else {
			alert('에러 : OCX 서버 접속중이 아닙니다.');
		}
	},
	select : function(nIndex) {
//		var result = this.ocx.SelectView(nIndex);
		console.log('[VMS] select [' + nIndex + '] ' + result);
	},
	play : function(nDevId, nIndex) {
//		alert(nDevId + ':' +  nIndex);
		if (!isNaN(nDevId)){
			var result = this.ocx.StartLiveVideo(parseInt(nDevId,10),parseInt(nIndex,10));
	//		var result = this.ocx.StartLiveVideo(1,0);
			console.log('[VMS] play ' + result);
		}
		console.log('[VMS] play id/index=' + nDevId + ':' +  nIndex);
	},
	pause : function() {
		var result = this.ocx.PauseVideo();
		console.log('[VMS] pause ' + result);
	},
	resume : function() {
		var result = this.ocx.ResumeVideo();
		console.log('[VMS] pause ' + result);
	},
	stop : function(nIndex) {
		var result = this.ocx.StopLiveVideo(nIndex-1);
		console.log('[VMS] stop ' + result);
	},
	StopLiveVideo : function(nIndex) {
		var result = this.ocx.StopLiveVideo(nIndex);
		console.log('[VMS] StopLiveVideo ' + result);
	},
	allPlay : function(sDevIds) {
		// split ':' 
      var sDevIdArr = sDevIds.split( ':' );
      for (var i=sDevIdArr.length; i--;){
    	  this.play(sDevIdArr[i],i);  
      }
//      for ( var i in sDevIdArr ) {
//			this.play(sDevIdArr[i],i);
//	 }	
//		var result = this.ocx.AllPlay(sDevIds);
		console.log('[VMS] allPlay ');
	},
	allPause : function() {
		var result = this.ocx.AllPause();
		console.log('[VMS] allPause ' + result);
	},
	allStop : function() {
		var result = null;
		if (this.playTy == 'search') {
			result = this.ocx.StopSearchVideoAll();
		} else {
			this.ocx.StopLiveVideoAll();
		}
//		alert('allStop:' + result);
		console.log('[VMS] allStop ' + result);
	},
	setDisplaySize : function(nWidth, nHeight) {
		var result = this.ocx.SetDisplaySize(nWidth, nHeight);
		console.log('[VMS] setDisplaySize ' + result);
	},
	setLayout : function(nSize) {
		var result = '';
		if (nSize == 1){
			result = this.ocx.SetLayout('1x1')
		} else if (nSize == 5){
			result = this.ocx.SetLayout('5x1')
		} else {
			result = this.ocx.SetLayout('3x3')
		}   
//		var result = this.ocx.SetLayout(nSize);
		console.log('[VMS] setLayout ' + result);
	},
	setSplit : function(nSize) {
		var result = this.ocx.SetSplit(nSize);
		console.log('[VMS] setSplit ' + result);
	},
	labelOn : function() {
		var result = this.ocx.LabelOn();
		console.log('[VMS] labelOn ' + result);
	},
	labelOff : function() {
		var result = this.ocx.LabelOff();
		console.log('[VMS] labelOff ' + result);
	},
	setFontSize : function(nSize) {
		var result = this.ocx.SetFontSize(nSize);
		console.log('[VMS] setFontSize ' + result);
	},
	setFontColor : function(nRed, nBlue, nGreen) {
		var result = this.ocx.SetFontColor(nRed, nBlue, nGreen);
		console.log('[VMS] setFontColor ' + result);
	},
	setFontPosition : function(nPosition) {
		var result = this.ocx.SetFontPosition(nPosition);
		console.log('[VMS] setFontPosition ' + result);
	},
	snapshot : function(sFilename) {
		var result = this.ocx.CaptureVideoEx(sFilename, true, true);
		console.log('[VMS] snapshot ' + result);
	},
	focusIn : function() {
		var result = this.ocx.PTZZoomIn();
		console.log('[VMS] zoonIn ' + result);
	},
	focusOut : function() {
		var result = this.ocx.PTZZoomOut();
		console.log('[VMS] zoomOut ' + result);
	},
	zoomIn : function() {
		var result = this.ocx.PTZZoomIn();
		console.log('[VMS] zoonIn ' + result);
	},
	zoomOut : function() {
		var result = this.ocx.PTZZoomOut();
		console.log('[VMS] zoomOut ' + result);
	},
	ptzMove : function(Degree) {
		var result = this.ocx.PTZMove(Degree);
		console.log('[VMS] ptzMove ' + result);
	},
	ptzStop : function() {
		var result = this.ocx.PTZStop();
		console.log('[VMS] ptzStop ' + result);
	},
	controlPTZ : function(nDevId, nPtzCmd, nSpeed) {
		var result = '';
		try {
			console.log(typeof nDevId + ' : ' + nDevId);
			console.log(typeof nPtzCmd + ' : ' + nPtzCmd);
			console.log(typeof nSpeed + ' : ' + nSpeed);
//			var result = this.ocx.ControlPTZ(nDevId, sDirection, nSpeed);''
			if (nPtzCmd == PTZ_ZOOM_IN){
				result = this.zoomIn()
			} else if (nPtzCmd == PTZ_ZOOM_OUT){
				result = this.zoomOut()
			} else if (nPtzCmd == PTZ_CONTROL_STOP){
				result = this.ptzStop()
			} else if (nPtzCmd == PTZ_FOCUS_OUT){
				result = this.focusOut()
			} else if (nPtzCmd == PTZ_FOCUS_IN){
				result = this.focusIn()
			} else {
				if (this.ocx.IsAvailablePTZ(nDevId)) {
					result = this.ptzMove(nPtzCmd);
				}
			}
			console.log('[VMS] controlPTZ = ' + result);
		}
		catch(e) {
			console.log(e);
		}
	},
	presetSave : function(nPresetNo) {
		var result = this.ocx.PTZSetPreset(nPresetNo);
		console.log('[VMS] presetSave ' + result);
	},
	presetGo : function(nPresetNo) {
		try {
			var result = this.ocx.PTZMovePreset(eval(nPresetNo));
			console.log('[VMS] presetGo ' + result);
		}
		catch(e) {
			console.log(e);
		}
	},
	presetRemove : function(nPresetNo) {
		var result = this.ocx.PTZRemovePreset(nPresetNo);
		console.log('[VMS] presetRemove ' + result);
	},
	setQuality : function(nValue) {
		var result = this.ocx.SetQuality(nValue);
		console.log('[VMS] setQuality[' + nValue + ']' + result);
	},
	isFixed : function(nDevId) {
		var result = !this.ocx.IsAvailablePTZ(nDevId);
		console.log('[VMS] isFixed[' + nDevId + ']' + result);
		return result;
	},
	speedCtrlint : function(nIndex, nSpeed) {
		var result = this.ocx.SpeedCtrlint(nIndex, nSpeed);
		console.log('[VMS] speedCtrlint[' + nIndex + ']' + result);
	},
	callUrl : function(sUrl) {
		var result = this.ocx.CallUrl(sUrl);
		console.log('[VMS] callUrl[' + sUrl + ']' + result);
	},
	ftpTrans : function(sFilename) {
		var result = this.ocx.FtpTrans(sFilename);
		console.log('[VMS] ftpTrans' + result);
	},
	ftpTransUrlOpen : function(imgFtpIp, imgFtpPort, imgFtpId, imgFtpPw, imgFtpDir, localFileFullName, deleteBool, openUrl) {
		var result = this.ocx.UploadFileNOpenWebsite(imgFtpIp, imgFtpPort, imgFtpId, imgFtpPw, imgFtpDir, localFileFullName, deleteBool, openUrl);;
		console.log('[VMS] ftpTransUrlOpen : ' + result);
	},
	deleteFile : function(nPath) {
		var result = this.ocx.DeleteFile(nPath);
		console.log('[VMS] deleteFile[' + nPath + ']' + result);
	},
	OsdSetting : function() {
        var osdTypeDeviceName = 1;  //0x01
        var osdTypeTime = 4;        //0x04
        var osdTypeFrameRate = 8;   //0x08
        var osdTypeResolution = 64; //0x40
        var osd = this.ocx.GetOSDSetting();

        osd |= osdTypeDeviceName;
        osd |= osdTypeTime;
        osd &= ~osdTypeFrameRate;
        osd &= ~osdTypeResolution;
//        osd |= osdTypeFrameRate;
//        osd |= osdTypeResolution;
//      osd &= ~osdTypeDeviceName;
//      osd &= ~osdTypeTime;

//        if (deviceName.checked)
//            osd |= osdTypeDeviceName;
//        else
//            osd &= ~osdTypeDeviceName;

        this.ocx.SetOSDSetting(osd);

	},
	playRecord : function(nIndex,  nDevId,  year,  month,  day,  hour,  min) {
		console.log(nIndex);
		console.log(nDevId);
		console.log(year);
		console.log(month);
		console.log(day);
		console.log(hour);
		console.log(min);
		try {
			var result = this.ocx.PlayRecord(nIndex,  nDevId,  year,  month,  day,  hour,  min);
			console.log('[VMS] playRecord' + result);
		}
		catch(e) {
			console.log(e);
		}
	},
	StartSearchVideo : function(nDevId, mIndex) {
		this.StopSearchVideo(mIndex);
		this.ocx.StartSearchVideo(nDevId, mIndex);
		
		console.log('[VMS] StartSearchVideo[' + nDevId + ']');
	},
	StopSearchVideo : function(mIndex) {
		this.ocx.StopSearchVideo(mIndex);
		
		console.log('[VMS] StopSearchVideo[' + mIndex + ']');
	},
	viewTime : function(dateTime) {
//		var result = this.ocx.ViewTime(nDevId, nSecondTime);
//		dateTime = '12-01-2016 17:50:20';
//       var date = dateTime[0].split('-');
//        var time = dateTime[1].split(':');
//        this.ocx.SeekTime(new Date(date[2], (date[0] - 1), date[1], time[0], time[1], time[2]).getTime());
      this.ocx.SeekTime(dateTime.getTime());
		console.log('[VMS] viewTime ');
	},
	viewStop : function(nDevId) {
		var result = this.ocx.ViewStop(nDevId);
		console.log('[VMS] viewStop[' + nDevId + ']' + result);
	},
	SetPlaySpeed : function(speed) {
		this.ocx.SetPlaybackSpeed(speed);
	},
	PlayForward : function() {
		this.ocx.PlayForward();
	},
	PlayBackward : function() {
		this.ocx.PlayBackward();
	},
	StopPlay : function() {
		this.ocx.StopPlay();
	},
	viewTimeStop : function(nDevId) {
		var result = this.ocx.ViewTimeStop(nDevId);
		console.log('[VMS] setQuality[' + nDevId + ']' + result);
	},
	StopSearchVideoAll : function() {
		var result = this.ocx.StopSearchVideoAll();
	},
	setOcx : function(element) {
		this.ocx = element;
	},
	setCameraList : function(list) {
		this.cameraList = list;
	},
//	InitSelectedTileCallback : function() {
//		var deviceID;
//		this.ocx.SetSelectedTileCallback(deviceID, OnSelectedTile);
//	},
	OnSelectedTile : function(deviceID, index) {
//		var result = this.ocx.SelectView(nIndex);
		this.nDeviceId = deviceID;
		this.nIndex = index;
		console.log('[VMS] select deviceID : ' + deviceID + ':' + index);
	},
	destroy : function() {
		if (this.isInitialized) {
			this.allStop();
			this.disconnectServer();
			this.release();
		}
	}
}

var SCREEN_LAYOUT = {
	MATRIX_01_CHNNEL : 1,
	MATRIX_04_CHNNEL : 4,
	MATRIX_09_CHNNEL : 9,
	MATRIX_16_CHNNEL : 16,
	SPLIT_1_2_CHANNEL : 2,
	SPLIT_1_3_CHANNEL : 3,
	SPLIT_1_4_CHANNEL : 4,
	SPLIT_1_5_CHANNEL : 5
}

var FONT_POSITION = {
	TOP_LEFT : 0,
	TOP_CENTER : 1,
	TOP_RIGHT : 2,
	CENTER_LEFT : 3,
	CENTER_CENTER : 4,
	CENTER_RIGHT : 5,
	BOTTOM_LEFT : 6,
	BOTTOM_CENTER : 7,
	BOTTOM_RIGHT : 8
}

var PTZ_UP = 0;
var PTZ_DOWN = 180;
var PTZ_LEFT = 270;
var PTZ_RIGHT = 90;
var PTZ_ZOOM_IN = 'ZOOMIN';
var PTZ_ZOOM_OUT = 'ZOOMOUT';
var PTZ_CONTROL_STOP = 'STOP';
var PTZ_FOCUS_OUT = 'FOCUSOUT';
var PTZ_FOCUS_IN = 'FOCUSIN';

var PTZ_PRESET_MOVE = 32;
var PTZ_PRESET_EDIT = 33;
var PTZ_PRESET_DELETE = 34;

var VMS_QUALITY = {
	HIGH : 1,
	LOW : 2
}

var PLAYBACK = {
	PLAY05 :1,
	PLAY1 : 50,
	PLAY2 : 100,
	PLAY4 : 4,
	PLAY8 : 8
}
