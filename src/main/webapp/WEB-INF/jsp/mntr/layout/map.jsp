<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/jsp/mntr/cmm/commonTags.jsp"%>
<link type="text/css" rel="stylesheet" media="screen" href="<c:url value='/css/mntr/gis/style.css'/>" />
<link type="text/css" rel="stylesheet" href="<c:url value='/css/mntr/gis/style.tidy.css'/>" />
<script type="text/javascript" src="<c:url value='/js/mntr/gis/lib/proj4js-combined.js'/>"></script>
<script type="text/javascript" src="<c:url value='/js/mntr/gis/openlayers.compress.js'/>"></script>
<script type="text/javascript" src="<c:url value='/js/mntr/gis/FeaturePopups.js'/>"></script>
<script type="text/javascript" src="<c:url value='/js/mntr/gis/patches_OL-popup-autosize.js'/>"></script>
<%-- <script type="text/javascript" src="<c:url value='/js/mntr/gis/AnimatedCluster.js'/>"></script> --%>
<script type="text/javascript" src="<c:url value='/js/mntr/gis/geoUtil.js'/>"></script>
<script type="text/javascript" src="<c:url value='/js/mntr/gis/mapTools.js'/>"></script>
<script type="text/javascript" src="<c:url value='/js/mntr/gis/zoomAction.js'/>"></script>
<c:set var="gisEngine">
	<spring:eval expression="@config['Mntr.Gis.Engine']" />
</c:set>
<c:set var="apiKey">
	<spring:eval expression="@config['Mntr.Gis.ApiKey']" />
</c:set>
<c:if test="${not empty ipMapping.gisMp and exeEnv ne 'DEV'}">
	<c:set var="apiKey" value="${ipMapping.gisMp}" />
</c:if>

<c:choose>
	<c:when test="${gisEngine eq 'VWORLD'}">
		<script src="http://map.vworld.kr/js/apis.do?type=Base&apiKey=${apiKey}"></script>
	</c:when>
</c:choose>
<script src="<c:url value='/js/mntr/gis/engine/${gisEngine}/${gisEngine}.js'/>"></script>
<script src="<c:url value='/js/mntr/gis/engine/${gisEngine}/mapInit.js'/>"></script>

<script type="text/javascript">
$(document).ready(function() {
//	$(window).load(function() {
		console.log('[window load map.jsp]');
		mapInit("map");
		if (configureGisTy == '0') {
			_map.setBaseLayer(baseLayer);
			$('#baseMapSwicher input[value="normal"]').prop('checked', true);
		}
		else {
			_map.setBaseLayer(aerialLayer);
			$('#baseMapSwicher input[value="aerial"]').prop('checked', true);
		}

		Gis.MapTools.setTextScale();

		//항공영상 토글
		$(".btnMapView").click(function() {
			$(".btnMapView").each(function() {
				buttonOff(this);
			});
			buttonOn(this);
			Gis.MapTools.switchBaseLayer(this);
		});

		//이동버튼 클릭
		$("#menuBtn1").click(function() {
			uxToolbarStyleReset();
			this.style.backgroundImage = 'url("' + '${pageContext.request.contextPath}' + '/images/mntr/gis/ico_moveOver.png")';
			this.style.color = "yellow";
			Gis.MapToolbar.pan();
		});

		//확대버튼 클릭
		$("#menuBtn2").click(function() {
			uxToolbarStyleReset();
			this.style.backgroundImage = 'url("' + '${pageContext.request.contextPath}' + '/images/mntr/gis/ico_plusOver.png")';
			this.style.color = "yellow";
			Gis.MapToolbar.zoomIn();
		});

		//축소버튼 클릭
		$("#menuBtn3").click(function() {
			uxToolbarStyleReset();
			this.style.backgroundImage = 'url("' + '${pageContext.request.contextPath}' + '/images/mntr/gis/ico_subtractionOver.png")';
			this.style.color = "yellow";
			Gis.MapToolbar.zoomOut();
		});

		//이전버튼 클릭
		$("#menuBtn5").click(function() {
			uxToolbarStyleReset();
			this.style.backgroundImage = 'url("' + '${pageContext.request.contextPath}' + '/images/mntr/gis/ico_prewOver.png")';
			this.style.color = "yellow";
			Gis.MapToolbar.prev();
		});

		//다음버튼 클릭
		$("#menuBtn6").click(function() {
			uxToolbarStyleReset();
			this.style.backgroundImage = 'url("' + '${pageContext.request.contextPath}' + '/images/mntr/gis/ico_nextOver.png")';
			this.style.color = "yellow";
			Gis.MapToolbar.next();
		});

		//초기화버튼 클릭
		$("#menuBtn7").click(function() {
			vectorLayer.destroyFeatures();
			uxToolbarStyleReset();
			measureControls["line"].deactivate();
			measureControls["polygon"].deactivate();
			
			removePreviousFeatureselected();
			Gis.MapTools.clearPopups();
		});

		//거리측정
		$("#menuBtn8").click(function() {
			uxToolbarStyleReset();
			this.style.backgroundImage = 'url("' + '${pageContext.request.contextPath}' + '/images/mntr/gis/ico_distOver.png")';
			this.style.color = "yellow";
			Gis.MapToolbar.measureDistance();
			$('#menuBtn17').css('color', '#ccc');
			$('#menuBtn17').css('background-image', 'url("' + contextRoot + '/images/mntr/gis/ico_search.png' + '")');
			$('#menuBtn17').removeClass('active');
		});

		//면적측정
		$("#menuBtn9").click(function() {
			uxToolbarStyleReset();
			this.style.backgroundImage = 'url("' + '${pageContext.request.contextPath}' + '/images/mntr/gis/ico_areaOver.png")';
			this.style.color = "yellow";
			Gis.MapToolbar.measureArea();
		});

		$("#menuBtn17").click(function() {
			uxToolbarStyleReset();
			this.style.backgroundImage = 'url("' + '${pageContext.request.contextPath}' + '/images/mntr/gis/ico_searchOver.png")';
			this.style.color = "yellow";

			$("#menuBtn17").addClass('active');
			$('#menuBtn17').tooltip('show');

			setTimeout(function() {
				$('#menuBtn17').tooltip('hide');
			}, 5000);
		});

		var target = document.getElementById('map');
		var spinner = null;

		if (typeof fcltLayer != 'undefined' && fcltLayer.visibility) {
			fcltLayer.events.on({
				'loadstart' : function() {
					spinner = new Spinner(opts).spin(target);
				},
				'loadend' : function() {
					spinner.stop();
				}
			});
		}

		$('#baseMapSwicher input').change(function() {
			var layer = $(this).val();
			if (layer == 'normal') {
				_map.setBaseLayer(baseLayer);
				configureGisTy = '0';
			}
			else if (layer == 'aerial') {
				_map.setBaseLayer(aerialLayer);
				configureGisTy = '1';
			}
			$.ajax({
				type : 'POST',
				url : contextRoot + '/mntr/updateConfigureSession.json',
				data : {
					configureGisTy : configureGisTy
				},
				success : function(data, textStatus, jqXHR) {
					if (textStatus == 'success') {
					}
					else {
						alert('에러발생 : ' + jqXHR.status + ' ' + jqXHR.statusText);
					}
				},
				error : function(jqXHR, textStatus, errorThrown) {
					alert('에러발생 : ' + jqXHR.status + ' ' + jqXHR.statusText);
				}
			});
		});

		/* 페이지 변경 직전의 맵의 센터를 저장하고 페이지 전환 간 다시 불러오는 기능 */
		if (typeof (Storage) !== "undefined") {
			$(window).unload(function() {
				var lon = _map.getCenter().lon;
				var lat = _map.getCenter().lat;
				var zoom = _map.getZoom();

				var lastMapCenter = new Object();
				lastMapCenter.lon = lon;
				lastMapCenter.lat = lat;
				lastMapCenter.zoom = zoom;

				localStorage.setItem('LastMapCenter', JSON.stringify(lastMapCenter));
			});

			if (localStorage.getItem('LastMapCenter') != null) {
				var lastMapCenter = JSON.parse(localStorage.getItem('LastMapCenter'));
				_map.setCenter(new OpenLayers.LonLat(lastMapCenter.lon, lastMapCenter.lat), lastMapCenter.zoom);
			}
			else {
				_map.setCenter(new OpenLayers.LonLat(configurePointX, configurePointY), configureGisLevel);
			}
		}
		else {
			alert("Web Storage를 지원하지 않는 브라우져입니다. 이전 맵으로 이동할 수 없습니다.");
		}

		if (configureUcpId == 'GYC') {
			$('#indexMap').css({
				'background' : 'url("' + contextRoot + '/images/mntr/gis/' + configureUcpId + '/indexMap.png") no-repeat',
				'background-size' : '100%',
				'width' : '265px',
				'height' : '390px'
			});

			$('#indexMapDiv').css({
				'width' : '269px',
				'height' : '394px',
				'background-color' : 'rgba(255, 255, 255, 0.8)'
			});
		}
		else if (configureUcpId == 'DJD') {
			$('#indexMap').css({
				'background' : 'url("' + contextRoot + '/images/mntr/gis/' + configureUcpId + '/indexMap.png") no-repeat',
				'background-size' : '100%'
			});
		}
		else if (configureUcpId == 'WOJ') {
			$('#indexMapDiv').css({
				'width' : '319px',
				'height' : '289px',
				'background-color' : 'rgba(255, 255, 255, 0.8)'
			});

			$('#indexMap').css({
				'background' : 'url("' + contextRoot + '/images/mntr/gis/' + configureUcpId + '/indexMap.png") no-repeat',
				'background-size' : '100%',
				'width' : '315px',
				'height' : '285px'
			});
		}
		else if (configureUcpId == 'WAJ') {
			$('#indexMapDiv').css({
				'width' : '264px',
				'height' : '307px',
				'background-color' : 'rgba(255, 255, 255, 0.8)'
			});

			$('#indexMap').css({
				'background' : 'url("' + contextRoot + '/images/mntr/gis/' + configureUcpId + '/indexMap.png") no-repeat',
				'background-size' : '100%',
				'width' : '260px',
				'height' : '303px'
			});
		}
		else if (configureUcpId == 'YSC') {
			$('#indexMap').css({
				'background' : 'url("' + contextRoot + '/images/mntr/gis/' + configureUcpId + '/indexMap.png") no-repeat',
				'background-size' : '100%',
				'width' : '315px',
				'height' : '285px'
			});

			$('#indexMapDiv').css({
				'width' : '319px',
				'height' : '289px',
				'background-color' : 'rgba(255, 255, 255, 0.8)'
			});
		}
		
		$('#indexMap').show();
		$('#indexMap').click(function(evt) {
			if (_bounds) {
				var indexMap = $('#indexMap').get(0);
				var offset = {
					x : evt.offsetX,
					y : evt.offsetY,
					width : indexMap.offsetWidth,
					height : indexMap.offsetHeight
				};
				var x = offset.x / offset.width;
				var y = offset.y / offset.height;
				var lon = _bounds.left + ((_bounds.right - _bounds.left) * x);
				var lat = _bounds.top - ((_bounds.top - _bounds.bottom) * y);
				_map.setCenter(new OpenLayers.LonLat(lon, lat), _map.getZoom());
			}
		});
	});

	function buttonOff(image) {

		var imagePath = image.src;
		var p = imagePath.lastIndexOf("_");
		var p2 = imagePath.lastIndexOf(".");
		if (p > 0) image.src = imagePath.substring(0, p) + "_off." + imagePath.substring(p2 + 1);
	}

	function buttonOn(image) {
		if (image.id == "btnMapView") {
			var allImageObject = document.getElementsByName("btnMapView");
			var pt = null, pe = null;
			var buf = null;

			for (var i = 0; i < allImageObject.length; i++) {
				buf = allImageObject[i].src;
				pt = buf.lastIndexOf("_");
				pe = buf.lastIndexOf(".");
				if (pt > 0) allImageObject[i].src = buf.substring(0, pt) + "_off." + buf.substring(pe + 1);
			}
		}
		var imagePath = image.src;
		var p = imagePath.lastIndexOf("_");
		var p2 = imagePath.lastIndexOf(".");
		var pc = imagePath.lastIndexOf("_on.");
		var blnIsOnView = false;
		if (pc > -1) {
			blnIsOnView = true;
		}
		else {
			blnIsOnView = false;
		}
		if (image.id == "btnMapView") {
			if (p > 0) image.src = imagePath.substring(0, p) + "_on." + imagePath.substring(p2 + 1);
		}
		else {
			image.src = imagePath.substring(0, p) + ((blnIsOnView) ? "_off." : "_on.") + imagePath.substring(p2 + 1);
		}

	}

	function uxToolbarStyleReset() {
		$("#menuBtn1").css("color", "#ccc");
		$("#menuBtn1").css("background-image", "url('" + "${pageContext.request.contextPath}" + "/images/mntr/gis/ico_move.png')");

		$("#menuBtn2").css("color", "#ccc");
		$("#menuBtn2").css("background-image", "url('" + "${pageContext.request.contextPath}" + "/images/mntr/gis/ico_plus.png')");

		$("#menuBtn3").css("color", "#ccc");
		$("#menuBtn3").css("background-image", "url('" + "${pageContext.request.contextPath}" + "/images/mntr/gis/ico_subtraction.png')");

		$("#menuBtn4").css("color", "#ccc");
		$("#menuBtn4").css("background-image", "url('" + "${pageContext.request.contextPath}" + "/images/mntr/gis/ico_layer.png')");

		$("#menuBtn5").css("color", "#ccc");
		$("#menuBtn5").css("background-image", "url('" + "${pageContext.request.contextPath}" + "/images/mntr/gis/ico_prew.png')");

		$("#menuBtn6").css("color", "#ccc");
		$("#menuBtn6").css("background-image", "url('" + "${pageContext.request.contextPath}" + "/images/mntr/gis/ico_next.png')");

		$("#menuBtn7").css("color", "#ccc");
		$("#menuBtn7").css("background-image", "url('" + "${pageContext.request.contextPath}" + "/images/mntr/gis/ico_reset.png')");

		$("#menuBtn8").css("color", "#ccc");
		$("#menuBtn8").css("background-image", "url('" + "${pageContext.request.contextPath}" + "/images/mntr/gis/ico_dist.png')");

		$("#menuBtn9").css("color", "#ccc");
		$("#menuBtn9").css("background-image", "url('" + "${pageContext.request.contextPath}" + "/images/mntr/gis/ico_area.png')");

		$("#menuBtn17").css("color", "#ccc");
		$("#menuBtn17").css("background-image", "url('" + "${pageContext.request.contextPath}" + "/images/mntr/gis/ico_search.png')");
	}

	function keyEnter(e) {
		if (window.event) {
			keynum = e.keyCode;
		}
		else if (e.which) {
			keynum = e.which;
		}
		if (keynum == 13) {
			Gis.MapTools.mapToScale();
		}
	}

	function redraw() {
		_map.updateSize();
	}

	function gotoIndexPosition() {
		var ct = _map.getCenter();
		$("#indexPointer").css("display", "inline");

		/* if (configureUcpId == 'GYC') {
			$('#indexPointer').css('left', function() {
				var x = (ct.lon - 247931.9) * 100 / 24913.820000000036;
				return x + '%';
			});

			$('#indexPointer').css('top', function() {
				var y = (289807.51 - ct.lat) * 100 / 37983.399999999994;
				return y + '%';
			});
		}
		else if (configureUcpId == 'YSC' && gisProjection == 'EPSG:5179') {
			$('#indexPointer').css('left', function() {
				var x = (ct.lon - 1124605.4422416172) * 100 / 31432.9381897;
				return x + '%';
			});

			$('#indexPointer').css('top', function() {
				var y = (1727926.644073575 - ct.lat) * 100 / 29473.7822612;
				return y + '%';
			});
		}
		else if (configureUcpId == 'YSC' && gisProjection == 'EPSG:900913') {
			$('#indexPointer').css('left', function() {
				var x = (ct.lon - 14345748.344503704) * 100 / 39086.8335658;
				return x + '%';
			});

			$('#indexPointer').css('top', function() {
				var y = (4236830.352531242 - ct.lat) * 100 / 35677.9404474;
				return y + '%';
			});
		} */
		if (gisEngine == 'O2MAP') {
			$("#indexPointer").css("left", parseInt((ct.lon - 974500) / 161 - 12) + "px");
			$("#indexPointer").css("top", parseInt(200 - (ct.lat - 1798300) / 178.5 - 12) + "px");
		} else  {
			$('#indexPointer').css('left', function() {
				var x = (ct.lon - _bounds.left) * 100 / (_bounds.right - _bounds.left);
				return x + '%';
			});

			$('#indexPointer').css('top', function() {
				var y = (_bounds.top - ct.lat) * 100 / (_bounds.top - _bounds.bottom);
				return y + '%';
			});
		}
	}
	
	function wfsPostQuery(proxyUrl, wfsUrl, urlParam, tableName, filterText, callback, async) {
		var url = wfsUrl + "?" + urlParam;
		var schemaLocation = url.replace("&", "&amp;");
		var queryTags = "";
		if (tableName.indexOf(",") > 0) {
			spTableName = tableName.split(",");
			for (var i = 0; i < spTableName.length; i++) {
				queryTags += '<Query srsName="EPSG:5179" typeName="' + spTableName[i] + '">\n' + filterText + "\n" + '</Query>\n';
			}
		}
		else {
			queryTags = '<Query srsName="EPSG:5179" typeName="' + tableName + '">\n' + filterText + "\n" + '</Query>\n';
		}
		var dataText = '<?xml version="1.0" encoding="UTF-8"?>\n'
				+ '<GetFeature\n'
			+ 'version="1.1.0"\n'
			+ 'service="WFS"\n'
			+ 'handle="wfsPostQuery"\n'
			+ 'xmlns="http://www.opengis.net/wfs"\n'
			+ 'xmlns:wfs="http://www.opengis.net/wfs"\n'
			+ 'xmlns:ogc="http://www.opengis.net/ogc"\n'
			+ 'xmlns:gml="http://www.opengis.net/gml"\n'
			+ 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n'
			+ 'xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd ' + wfsUrl + ' ' + schemaLocation + 'SERVICE=WFS&amp;VERSION=1.1.0&amp;REQUEST=DescribeFeatureType">\n'
				+ queryTags + '</GetFeature>\n';

		OpenLayers.Request.issue({
			method : "POST",
			url : proxyUrl + escape(url),
			data : dataText,
			headers : {
				"Content-Type" : "text/xml"
			},
			async : (async != undefined) ? async : true,
			success : callback
		});
	}

	function wfsQuery(proxyUrl, wfsUrl, urlParam, tableName, filterText, bbox, callback) {
		var params = "";
		if (filterText != "" && filterText != null) {
			params = OpenLayers.Util.getParameterString({
				SERVICE : "WFS",
				VERSION : "1.1.0",
				REQUEST : "GetFeature",
				SRSNAME : "EPSG:5179",
				TYPENAME : tableName,
				FILTER : filterText
			});
		}

		else if (bbox != "" && bbox != null) {
			params = OpenLayers.Util.getParameterString({
				SERVICE : "WFS",
				VERSION : "1.1.0",
				REQUEST : "GetFeature",
				SRSNAME : "EPSG:5179",
				TYPENAME : tableName,
				BBOX : bbox
			});
		}
		else {
			params = OpenLayers.Util.getParameterString({
				SERVICE : "WFS",
				VERSION : "1.1.0",
				REQUEST : "GetFeature",
				SRSNAME : "LP:8880",
				TYPENAME : tableName
			});
		}

		var url = wfsUrl + "?" + urlParam + params;
		OpenLayers.Request.issue({
			method : "GET",
			url : proxyUrl + escape(url),
			async : true,
			success : callback
		});
	}
</script>
<div id="wrapperMap">
	<!-- <input type="hidden" id="txtScale" name="txtScale" /> -->
	<!--상단 메뉴  -->
	<div id="menu">
		<div id="baseMapSwicher">
			<label class="checkbox-inline">
				<input type="radio" name="rdoBaseMapSwicher" checked="checked" value="normal" /> 일반
			</label>
			<label class="checkbox-inline">
				<input type="radio" name="rdoBaseMapSwicher" value="aerial" /> 항공
			</label>
		</div>
		<div id="menu_text">
			<ul>
				<li>
					<div></div>
					<div>
						<label for="txtScale">축적</label>
						<input class="text" type="text" id="txtScale" name="txtScale" style="width: 60px;" value="" onkeydown="keyEnter(event)" />
					</div>
				</li>
				<li>
					<div id="menuBtn17" class="menu_btn" data-toggle="tooltip" data-placement="bottom" title="선택 후 지도를 클릭해 주세요.">
						<div class="floater"></div>
						<div>좌표</div>
					</div>
				</li>
				<li>
					<div id="menuBtn9" class="menu_btn">
						<div class="floater"></div>
						<div>면적</div>
					</div>
				</li>
				<li>
					<div id="menuBtn8" class="menu_btn">
						<div class="floater"></div>
						<div>거리</div>
					</div>
				</li>
				<li>
					<div id="menuBtn7" class="menu_btn">
						<div class="floater"></div>
						<div>초기화</div>
					</div>
				</li>

				<li>
					<div id="menuBtn6" class="menu_btn">
						<div class="floater"></div>
						<div>다음</div>
					</div>
				</li>
				<li>
					<div id="menuBtn5" class="menu_btn">
						<div class="floater"></div>
						<div>이전</div>
					</div>
				</li>
				<li>
					<div id="menuBtn3" class="menu_btn">
						<div class="floater"></div>
						<div>축소</div>
					</div>
				</li>
				<li>
					<div id="menuBtn2" class="menu_btn">
						<div class="floater"></div>
						<div>확대</div>
					</div>
				</li>
				<li>
					<div id="menuBtn1" class="menu_btn">
						<div class="floater"></div>
						<div>이동</div>
					</div>
				</li>
			</ul>
		</div>

	</div>
	<div id="centerMap">
		<div id="map" style="padding-bottom: 10px"></div>
	</div>

	<div id="indexMapDiv" style="width: 204px; height: 204px; z-index: 29; position: absolute; right: 0px; bottom: 10px; background: white;">
		<div id="indexMap">
			<img id="indexPointer" src="<c:url value='/'/>images/mntr/gis/index_point.png" style="width: 20px; height: 20px; position: relative; left: 300px; top: 200px; display: none;" />
		</div>
	</div>
</div>


