<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<c:set var="exeEnv">
	<spring:eval expression="@config['Globals.ExeEnv']" />
</c:set>
<c:set var="dstrtCd">
	<spring:eval expression="@config['Mntr.DstrtCd']" />
</c:set>
<c:set var="ucpId">
	<spring:eval expression="@config['Globals.UcpId']" />
</c:set>
<c:set var="scmpImgIp">
	<spring:eval expression="@config['scmp.img.ip']" />
</c:set>
<c:set var="sysCd" value="${LoginVO.authCd}"/>

<link type="text/css" rel="stylesheet" href="<c:url value='/css/mntr/resetCss.css' />">
<link type="text/css" rel="stylesheet" href="<c:url value='/js/mntr/bootstrap/css/bootstrap.min.css' />">
<link type="text/css" rel="stylesheet" href="<c:url value='/js/mntr/bootstrap/css/non-responsive.css' />">
<link type="text/css" rel="stylesheet" href="<c:url value='/js/mntr/jqGrid/css/ui.jqgrid.css' />" />
<link type="text/css" rel="stylesheet" href="<c:url value='/css/mntr/mntr.css' />" />
<script>
	/* global properties */
	// rtsp mapping ip 배열처리
	var ipMappingRtspIpAry 		= '${ipMapping.rtspIp}'.split(',');
	var ipMappingRtspIpMpAry 	= '${ipMapping.rtspIpMp}'.split(',');

	var contextRoot = '${pageContext.request.contextPath}';
	/* user configure */
	var ipMappingGis = '${ipMapping.gisMp}';
	var ipMappingScmp = '${ipMapping.scmpMp}';

	var websocketIp = '${ipMapping.websocketMp}' == '' ? '<spring:eval expression="@config['Globals.WebSocketIp']"/>' : '${ipMapping.websocketMp}';

	// 이미지서버
	var ipMappingScmpImg 	= '${ipMapping.scmpImg}';
	var ipMappingScmpImgMp 	= '${ipMapping.scmpImgMp}';
	var ipScmpImg 			= '<spring:eval expression="@config['scmp.img.ip']"/>';

	if (ipMappingScmpImg != null && ipMappingScmpImgMp != '') {
		ipScmpImg = ipScmpImg.replace(ipMappingScmpImg, ipMappingScmpImgMp);
	}
	var ipMappingVms 	= '${ipMapping.vmsMp}';
	var ipMappingNvr 	= '${ipMapping.nvrMp}';
	var serverIp 		= '<spring:eval expression="@config['Globals.ServerIp']"/>';
	var serverPort 		= '<spring:eval expression="@config['Globals.ServerPort']"/>';
	var mntrUrl 		= serverIp + ':' + serverPort;
	var gisEngine 	= '<spring:eval expression="@config['Mntr.Gis.Engine']"/>';
	var gisApiKey 		= '<spring:eval expression="@config['Mntr.Gis.ApiKey']"/>';
	var gisProjection 	= '<spring:eval expression="@config['Mntr.Gis.Projection']"/>';
	var gisBoundsLeft 	= '<spring:eval expression="@config['Mntr.Gis.BoundsLeft']"/>';
	var gisBoundsBottom = '<spring:eval expression="@config['Mntr.Gis.BoundsBottom']"/>';
	var gisBoundsRight 	= '<spring:eval expression="@config['Mntr.Gis.BoundsRight']"/>';
	var gisBoundsTop 	= '<spring:eval expression="@config['Mntr.Gis.BoundsTop']"/>';
	var gisUrlBase 		= '<spring:eval expression="@config['Mntr.Gis.Url.Base']"/>';
	var gisUrlAerial 	= '<spring:eval expression="@config['Mntr.Gis.Url.Aerial']"/>';
	var gisUrlUti 		= '<spring:eval expression="@config['Mntr.Gis.Url.Uti']"/>';
	var gisUrlWfs 		= '<spring:eval expression="@config['Mntr.Gis.Url.Wfs']"/>';
	
	// maxBfPlaybacktime maxAfPlaybacktime
	/* nvr properties */
	var vmsPlayer = null;
	var configureExeEnv = '<spring:eval expression="@config['Globals.ExeEnv']" />';
	var configureIconSize = 0;
	var configureUcpId = '<spring:eval expression="@config['Globals.UcpId']"/>';
	var configureSysCd = '${LoginVO.authCd}';
	var configureDstrtCd = '<spring:eval expression="@config['Mntr.DstrtCd']"/>';
	var configurePointX = '<spring:eval expression="@config['Mntr.Configure.PointX']"/>';
	var configurePointY = '<spring:eval expression="@config['Mntr.Configure.PointY']"/>';
	var configureGisTy = '<spring:eval expression="@config['Mntr.Configure.GisTy']"/>';
	var configureGisLevel = '<spring:eval expression="@config['Mntr.Configure.GisLevel']"/>';
	var configureMntrViewBottom = '<spring:eval expression="@config['Mntr.Configure.MntrViewBottom']"/>';
	var configureMntrViewLeft = '<spring:eval expression="@config['Mntr.Configure.MntrViewLeft']"/>';
	var configureMntrViewRight = '<spring:eval expression="@config['Mntr.Configure.MntrViewRight']"/>';
	var configurePopWidth = '<spring:eval expression="@config['Mntr.Configure.PopWidth']"/>';
	var configurePopHeight = '<spring:eval expression="@config['Mntr.Configure.PopHeight']"/>';
	var configureRadsClmt = '<spring:eval expression="@config['Mntr.Configure.RadsClmt']"/>';
	var configureRadsRoute = '<spring:eval expression="@config['Mntr.Configure.RadsRoute']"/>';
	var configureMntrTyId = '<spring:eval expression="@config['Mntr.Configure.MntrTyId']"/>';
	var configureCctvViewRads = '<spring:eval expression="@config['Mntr.Configure.CctvViewRads']"/>';

	var imageEssUrl = '<spring:eval expression="@config['image.ess.url']" />';

	// 9개 분할영산 선언 변수
	var splitUrl = '';
	var fcltUidsArray = [ '', '', '', '', '', '', '', '', ''];
	var urlArray = [];
	var fcltClkCnt = 0;
	var castNetFeature = [];
	var nearestFeature = [];

	if (ipMappingGis != '') {
		gisUrlBase = gisUrlBase.replace('${ipMapping.gis}', ipMappingGis);
		gisUrlAerial = gisUrlAerial.replace('${ipMapping.gis}', ipMappingGis);
		gisUrlUti = gisUrlUti.replace('${ipMapping.gis}', ipMappingGis);
		gisUrlWfs = gisUrlWfs.replace('${ipMapping.gis}', ipMappingGis);
	}

</script>
<script src="<c:url value='/js/mntr/jquery/jquery.js' />"></script>
<script src="<c:url value='/js/mntr/jqGrid/jquery.jqGrid.src.js' />"></script>
<script src="<c:url value='/js/mntr/jqGrid/i18n/grid.locale-kr.js' />"></script>
<script src="<c:url value='/js/mntr/jquery/jquery.twbsPagination.min.js' />"></script>
<script src="<c:url value='/js/mntr/spinner/spin.min.js' />"></script>
<script src="<c:url value='/js/mntr/cmm.js' />"></script>
<script src="<c:url value='/js/mntr/div.js' />"></script>
<script src="<c:url value='/js/mntr/castnet.js' />"></script>
<c:choose>
	<c:when test="${vmsSoftware eq 'TRIUMINCON'}">
        <script type="text/javascript" for="TriumViewer" event="ErrorRaised(category, error, msg)">
            alert('ErrorRaised : ' + msg);
        </script>
        
        <script type="text/javascript" for="TriumViewer" event="SelectedTileChanged(deviceID, index)">
        	TRIUM.OnSelectedTile(deviceID, index);
        </script>
	</c:when>
	<c:when test="${ucpId eq 'YSC'}">
		<script for="ZWVmsLiveHostClient" event="selectionChanged(nCol, nRow)">
		<!--
			console.log('selectionChanged nCol[' + nCol + '] nRow[' + nRow + ']');
			if (window.location.pathname.indexOf('/evtMntr.do') > -1 || window.location.pathname.indexOf('/castNet.do') > -1) {
				var trArea = $('#div-evtCastnet tr[id^=area]');
				trArea.removeClass('active');
				$('#area-' + nCol).addClass('active');

				currentFcltId = $('#area-' + nCol).find('td')[0].id;
				currentIndex = Number(nCol);

				if (typeof currentFcltId != 'undefined' || currentFcltId != '') {
					$.post(contextRoot + '/fcltById.json', {
						fcltId : currentFcltId
					}).done(
							function(data) {
								if (typeof data.pointX != 'undefined' && typeof data.pointY != 'undefined' && data.pointX != '' && data.pointY != '' && data.pointX != '0'
										&& data.pointY != '0') {
									removePreviousFeatureselected();
									var point = WGS84toTM(data.pointX, data.pointY);
									previousFeatureselected = featureselected(point, 'fclt', '', false, true, true);
								}
								else {
									// alert('위치 정보가 없는 이벤트입니다.');
								}
							});
				}
			}
		-->
		</script>
		<script for="ZWVmsLiveHostClient" event="onSnapShot(result, nCol, nRow, sPath)">
		<!--
			console.log('onSnapShot nCol[' + nCol + '] nRow[' + nRow + '] sPath[' + sPath + '] result[' + result + ']');
		-->
		</script>
		<script for="ZWVmsLiveHostClient" event="doubleClicked(nCol, nRow)">
		<!--
			console.log('doubleClicked nCol[' + nCol + '] nRow[' + nRow + ']');
			if (window.location.pathname.indexOf('/evtMntr.do') > -1 || window.location.pathname.indexOf('/castNet.do') > -1) {
				var trArea = $('#div-evtCastnet tr[id^=area]');
				trArea.removeClass('active');
				$('#area-' + nCol).addClass('active');

				currentFcltId = $('#area-' + nCol).find('td')[0].id;

				if (typeof currentFcltId != 'undefined' || currentFcltId != '') {
					$.post(contextRoot + '/fcltById.json', {
						fcltId : currentFcltId
					}).done(function(data) {
						openVmsPlayer(data.fcltId, data.fcltUid);
					});
				}
			}
		-->
		</script>
	</c:when>
</c:choose>



