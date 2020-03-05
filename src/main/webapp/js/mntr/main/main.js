var previousFeatureselected = null;

/* 시설물 레이어 정의 */
var fcltLayer = new OpenLayers.Layer.Vector("fcltLayer", {
	strategies : [
		new OpenLayers.Strategy.Cluster({
			distance : 40
		}), new OpenLayers.Strategy.BBOX({
			resFactor : 1.05
		})
	],
	protocol : new OpenLayers.Protocol.HTTP({
		url : contextRoot + "/dan/monitor/danFcltGeoData.json",
		params : {
			searchFacCd : '',
			searchDanFcltType : '',
			searchExcludeDanFcltType : ''
		},
		readWithPOST : true,
		format : new OpenLayers.Format.GeoJSON()
	}),
	styleMap : new OpenLayers.StyleMap(Gis.fcltLayerStyle)
});

/* 시설물 방향각 레이어 정의 */
var fcltAngleLayer = new OpenLayers.Layer.Vector("fcltAngleLayer", {
	strategies : [
		new OpenLayers.Strategy.Cluster({
			distance : 40
		}), new OpenLayers.Strategy.BBOX({
			resFactor : 1.05
		})
	],
	protocol : new OpenLayers.Protocol.HTTP({
		url : contextRoot + "/mntr/fcltAngleGeoData.json",
		params : {
			searchFcltKndCd : '',
			searchFcltUsedType : ''
		},
		readWithPOST : true,
		format : new OpenLayers.Format.GeoJSON()
	}),
	styleMap : new OpenLayers.StyleMap(Gis.fcltAngleLayer)
});
fcltAngleLayer.setVisibility(false);

/* 이벤트 레이어 정의 */
var eventLayer = new OpenLayers.Layer.Vector("eventLayer", {
	strategies : [
		new OpenLayers.Strategy.BBOX({
			resFactor : 1
		})
	],
	protocol : new OpenLayers.Protocol.HTTP({
		url : contextRoot + "/dan/monitor/unfinishedEventGeoData.json",
		params : {
			searchEvtList : ''
		},
		readWithPOST : true,
		format : new OpenLayers.Format.GeoJSON()
	}),
	styleMap : new OpenLayers.StyleMap(Gis.eventLayerStyle)
});
eventLayer.setVisibility(false);

/* 차량 위치 레이어 정의 */
var carLcInfoLayer = new OpenLayers.Layer.Vector('carLcInfoLayer', {
	rendererOptions : {
		zIndexing : true
	}
});

/* 차량 위치 레이어 정의 */
var rtCctvLayer = new OpenLayers.Layer.Vector('rtCctvLayer', {
	rendererOptions : {
		zIndexing : true
	}
});

/* Feature Cluster 정의 */
var fpControl = new OpenLayers.Control.FeaturePopups({
	boxSelectionOptions : {},
	popupOptions : {
		hover : {
			followCursor : false
		},
		hoverList : {
			followCursor : false
		}
	},
	layers : [
		[
			fcltLayer, {
			templates : {
				single : function(feature) {
					var facSeq = feature.attributes.facSeq;
					var	facCd = feature.attributes.facCd;
					var typeCd = feature.attributes.typeCd;
					var typeNm = feature.attributes.typeNm;
					var facNm = feature.attributes.facNm;
					var addr = feature.attributes.addr;
					var nm = feature.attributes.nm;
					var email = feature.attributes.email;
					var hp  = feature.attributes.hp;



					var table = $('<table/>', {
						id : 'tbDanFcltInfo',
						class : 'table table-striped table-condensed'
					});

					table.append($('<caption/>', {
						html : '&nbsp;'
					}));

					var colgroup = $('<colgroup/>', {

					});

					colgroup.append($('<col/>', {
						span : '1',
						style : 'width: 40%;'
					}));
					colgroup.append($('<col/>', {
						span : '1',
						style : 'width: 60%;'
					}));

					var tbody = $('<tbody/>', {
						html : '<tr></tr><tr></tr><tr></tr><tr></tr><tr></tr>'
					});


					var trs = tbody.find('tr');

					$(trs[0]).append($('<th/>', {
						text : '위험시설물명',
						class : 'success'
					}));

					$(trs[0]).append($('<td/>', {
						text : facNm
					}));

					$(trs[1]).append($('<th/>', {
						text :  '종류',
						class : 'success'
					}));

					$(trs[1]).append($('<td/>', {
						text : typeNm
					}));

					$(trs[2]).append($('<th/>', {
						text : '주소',
						class : 'success'
					}));

					$(trs[2]).append($('<td/>', {
						text : addr
					}));

					$(trs[3]).append($('<th/>', {
						text : '담당자명',
						class : 'success'
					}));

					$(trs[3]).append($('<td/>', {
						text : (nm == null ? '' : nm)
					}));

					$(trs[4]).append($('<th/>', {
						text : '전화번호',
						class : 'success'
					}));

					$(trs[4]).append($('<td/>', {
						text : (hp == null ? '' : hp)
					}));
					table.append(colgroup);
					table.append(tbody);

					return table.prop('outerHTML');
				},
				list : function(layer) {
					var table = $('<table/>', {
						id : 'tbDanFcltInfo',
						class : 'table table-striped table-condensed'
					});
					var caption = $('<caption/>', {
						html : '총 <strong style="color: red;">' + layer.count + '</strong>개의 위험시설물이 있습니다.'
					});
					var thead = $('<thead/>');
					var theadTr = $('<tr/>', {
						class : 'warning'
					});
					var th = $.parseHTML('<th>위험시설물명</th><th>종류</th><th>주소</th><th></th><th></th>');
					var tbody = $.parseHTML(layer.html);
					theadTr.append(th);
					thead.append(theadTr);
					table.append(caption);
					table.append(thead);
					table.append(tbody);
					return table.prop('outerHTML');
				},
				item : function(feature) {
					var facSeq = feature.attributes.facSeq;
					var	facCd = feature.attributes.facCd;
					var typeCd = feature.attributes.typeCd;
					var typeNm = feature.attributes.typeNm;
					var facNm = feature.attributes.facNm;
					var addr = feature.attributes.addr;
					var nm = feature.attributes.nm;
					var email = feature.attributes.email;
					var hp  = feature.attributes.hp;

					var tbodyTr = $('<tr/>');
					tbodyTr.append($('<td/>', {
						scope : 'row',
						text : facNm
					}));
					tbodyTr.append($('<td/>', {
						text : typeNm
					}));
					tbodyTr.append($('<td/>', {
						text : addr
					}));
					tbodyTr.append($('<td/>', {
						html:'<button class="btn btn-primary btn-xs btn-ucp" onclick="javascript:managerInfo(\'' + nm + '\',\'' + hp + '\')">담당자</button>',
						id : facSeq
					}));
					return tbodyTr.prop('outerHTML');
				},
				hover : function(feature) {
					var facSeq = feature.attributes.facSeq;
					var	facCd = feature.attributes.facCd;
					var typeCd = feature.attributes.typeCd;
					var typeNm = feature.attributes.typeNm;
					var facNm = feature.attributes.facNm;
					var addr = feature.attributes.addr;
					var nm = feature.attributes.nm;
					var email = feature.attributes.email;
					var hp  = feature.attributes.hp;

					var table = $('<table/>', {
						id : 'tbDanFcltInfo',
						class : 'table table-striped table-condensed'
					});

					table.append($('<caption/>', {
						html : '&nbsp;'
					}));

					var colgroup = $('<colgroup/>', {

					});

					colgroup.append($('<col/>', {
						span : '1',
						style : 'width: 40%;'
					}));
					colgroup.append($('<col/>', {
						span : '1',
						style : 'width: 60%;'
					}));

					var tbody = $('<tbody/>', {
						html : '<tr></tr><tr></tr><tr></tr><tr></tr><tr></tr>'
					});


					var trs = tbody.find('tr');

					$(trs[0]).append($('<th/>', {
						text : '위험시설물명',
						class : 'success'
					}));

					$(trs[0]).append($('<td/>', {
						text : facNm
					}));

					$(trs[1]).append($('<th/>', {
						text :  '종류',
						class : 'success'
					}));

					$(trs[1]).append($('<td/>', {
						text : typeNm
					}));

					$(trs[2]).append($('<th/>', {
						text : '주소',
						class : 'success'
					}));

					$(trs[2]).append($('<td/>', {
						text : addr
					}));

					$(trs[3]).append($('<th/>', {
						text : '담당자명',
						class : 'success'
					}));

					$(trs[3]).append($('<td/>', {
						text : (nm == null ? '' : nm)
					}));

					$(trs[4]).append($('<th/>', {
						text : '전화번호',
						class : 'success'
					}));

					$(trs[4]).append($('<td/>', {
						text : (hp == null ? '' : hp)
					}));
					table.append(colgroup);
					table.append(tbody);

					return table.prop('outerHTML');
				},
				hoverList : function(layer) {
					var table = $('<table/>', {
						id : 'tbDanFcltInfo',
						class : 'table table-striped table-condensed'
					});
					var caption = $('<caption/>', {
						html : '총 <strong style="color: red;">' + layer.count + '</strong>개의 위험시설물이 있습니다.'
					});
					var thead = $('<thead/>');
					var tr = $('<tr/>', {
						class : 'warning'
					});
					var th = $.parseHTML('<th>위험시설물명</th><th>종류</th><th>주소</th>');
					var tbody = $.parseHTML(layer.html);
					tr.append(th);
					thead.append(tr);
					table.append(caption);
					table.append(thead);
					table.append(tbody);
					return table.prop('outerHTML');
				},
				hoverItem : function(feature) {
					var facSeq = feature.attributes.facSeq;
					var	facCd = feature.attributes.facCd;
					var typeCd = feature.attributes.typeCd;
					var typeNm = feature.attributes.typeNm;
					var facNm = feature.attributes.facNm;
					var addr = feature.attributes.addr;
					var nm = feature.attributes.nm;
					var email = feature.attributes.email;
					var hp  = feature.attributes.hp;

					var tbodyTr = $('<tr/>');
					tbodyTr.append($('<td/>', {
						scope : 'row',
						text : facNm
					}));
					tbodyTr.append($('<td/>', {
						text : typeNm
					}));
					tbodyTr.append($('<td/>', {
						text : addr
					}));
					return tbodyTr.prop('outerHTML');
				}
			}
		}

		]
	]
});

// $(window).load(function()  {
$(function() {
	/* openlayers */
	fcltLayer.protocol.params.searchFacCd = '';
	fcltLayer.protocol.params.searchExcludeDanFcltType = lastMapLayer;

	fcltLayer.events.on({
		'loadend' : function() {
			console.log('[MAP] fcltLayer loadend.');
			var zoom = _map.getZoom();
			if (zoom >= 5) {
				fcltAngleLayer.setVisibility(true);
			}
			else {
				fcltAngleLayer.setVisibility(false);
			}
		},
		'featureselected' : function(evt) {
			removePreviousFeatureselected();
			previousFeatureselected = featureselected(evt, 'fclt', '', false, true);
		}
	});

	eventLayer.events.on({
		'featureselected' : function(evt) {
			var offset = [
				(evt.feature.attributes.lblFclt - 1) * 30, 0
			];
			removePreviousFeatureselected();
			previousFeatureselected = featureselected(evt, 'event', '', false, true, false, offset);
			popupEventInfo(evt);
		}
	});

	var selectFeatureCtrl = new OpenLayers.Control.SelectFeature([
		eventLayer, fcltLayer
	]);

	_clicker = new OpenLayers.Control.Clicker({
		callbackfunc : function(evt) {
			// 맨땅에 어택
			if ($("#menuBtn17").prop('class').indexOf('active') != -1) {
				popupPositionInfo(evt);

				$('#menuBtn17').css('color', '#ccc');
				$('#menuBtn17').css('background-image', 'url("' + contextRoot + '/images/mntr/gis/ico_search.png' + '")');
				$('#menuBtn17').removeClass('active');
			}

		}
	});

	_map.addLayers([
		fcltLayer, carLcInfoLayer, eventLayer, rtCctvLayer
	]);

	_map.addControls([
		fpControl, selectFeatureCtrl, _clicker
	]);

	fpControl.activate();
	selectFeatureCtrl.activate();
	_clicker.activate();

	console.log('[WEB] main ready.');

	if (evtOcrNo != '') {
		doDanFcltDetail();
	}
	else {
		eventLayer.setVisibility(true);
		fcltLayer.setVisibility(true);
	}

	$('[data-toggle="tooltip"]').tooltip({
		trigger : 'click',
		delay : {
			'show' : 500,
			'hide' : 500
		}
	});
});

function removePreviousFeatureselected() {
	if (previousFeatureselected != null) {
		featureselectedLayer.removeFeatures(previousFeatureselected);
		previousFeatureselected = null;
	}
}
function popupEventInfo(evt) {
	var feature = evt.feature;
	var geometry = feature.geometry;

	var table = $('<table/>', {
		id : 'tbEventInfo',
		class : 'table table-striped table-condensed'
	});

	table.append($('<caption/>', {
		html : '&nbsp;'
	}));

	var colgroup = $('<colgroup/>', {

	});
	table.append(colgroup);

	colgroup.append($('<col/>', {
		span : '1',
		style : 'width: 40%;'
	}));
	colgroup.append($('<col/>', {
		span : '1',
		style : 'width: 60%;'
	}));

	var tbody = $('<tbody/>', {
		html : '<tr></tr><tr></tr><tr></tr><tr></tr><tr></tr>'
	});
	table.append(tbody);

	var trs = tbody.find('tr');

	$(trs[0]).append($('<th/>', {
		text : '내용',
		class : 'success'
	}));

	$(trs[0]).append($('<td/>', {
		text : feature.attributes.evtDtl
	}));

	$(trs[1]).append($('<th/>', {
		text :  '발생위치',
		class : 'success'
	}));

	$(trs[1]).append($('<td/>', {
		text : feature.attributes.evtPlace
	}));

	$(trs[2]).append($('<th/>', {
		text : '발생시간',
		class : 'success'
	}));

	$(trs[2]).append($('<td/>', {
		text : feature.attributes.evtOcrYmdHms
	}));


	Gis.MapTools.openPopup(geometry.getBounds().getCenterLonLat(), table.prop('outerHTML'), new OpenLayers.Size(320, 240));
	OpenLayers.Event.stop(evt);
}

function popupPositionInfo(evt) {
	console.log(evt);
	var lonlat = _map.getLonLatFromPixel(evt.xy);
	var wgs84 = TMtoWGS84(lonlat.lon, lonlat.lat);

	var table = $('<table/>', {
		id : 'tbPositionInfo',
		class : 'table table-striped table-condensed'
	});

	table.append($('<caption/>', {
		html : '<h5>경위도 좌표 정보</h5>'
	}));

	var colgroup = $('<colgroup/>');
	colgroup.append($('<col/>', {
		span : '1',
		style : 'width: 40%;'
	}));
	colgroup.append($('<col/>', {
		span : '1',
		style : 'width: 60%;'
	}));

	table.append(colgroup);

	var tbody = $('<tbody/>', {
		html : '<tr></tr><tr></tr><tr></tr><tr></tr><tr></tr>'
	});
	table.append(tbody);

	var trs = tbody.find('tr');

	$(trs[0]).append($('<th/>', {
		text : '경도',
		class : 'success'
	}));

	$(trs[0]).append($('<td/>', {
		text : wgs84.x
	}));

	$(trs[1]).append($('<th/>', {
		text : '위도',
		class : 'success'
	}));

	$(trs[1]).append($('<td/>', {
		text : wgs84.y
	}));

	if ((configureUcpId == 'NJC' || configureUcpId == 'KSG' || configureUcpId == 'DJD') && configureExeEnv != 'DEV') {
		$(trs[2]).append($('<th/>', {
			text : '도로명(지번)',
			class : 'success'
		}));

		$(trs[2]).append($('<td/>', {
			html : '<span id="popupRoadAdresNm"></span>(<span id="popupLotnoAdresNm"></span>)'
		}));

		Gis.MapTools.getAddr(new OpenLayers.LonLat(lonlat.lon, lonlat.lat), "popupLotnoAdresNm", "popupRoadAdresNm");
	}
	else if (configureUcpId == 'GYC' && gisEngine == 'ARCGIS') {
		$(trs[2]).append($('<th/>', {
			text : '지번(도로명)',
			class : 'success'
		}));

		$(trs[2]).append($('<td/>', {
			html : '<span id="popupLotnoAdresNm"></span>(<span id="popupRoadAdresNm"></span>)'
		}));

		var urlRoadAddr = 'http://192.168.10.103:6080/arcgis/rest/services/NewAddressDynamic/MapServer/3/query?';
		urlRoadAddr = urlRoadAddr.replace('${ipMapping.gis}', ipMappingGis);
		var urlJibunADdr = 'http://192.168.10.103:6080/arcgis/rest/services/ParcelDynamic/MapServer/0/query?';
		urlJibunADdr = urlJibunADdr.replace('${ipMapping.gis}', ipMappingGis);

		getRoadAddr(lonlat, urlRoadAddr ,'#popupRoadAdresNm');
		getJibunAddr(lonlat, urlJibunADdr ,'#popupLotnoAdresNm');
	}
	else if (gisEngine == 'VWORLD') {
		$(trs[2]).append($('<th/>', {
			text : '도로명(지번)',
			class : 'success'
		}));

		$(trs[2]).append($('<td/>', {
			html : '<span id="popupRoadAdresNm"></span>(<span id="popupLotnoAdresNm"></span>)'
		}));

		$.ajax({
			type : 'GET',
			async : false,
			dataType : 'jsonp',
			url : 'http://apis.vworld.kr/coord2new.do',
			data : {
				x : lonlat.lon,
				y : lonlat.lat,
				apiKey : gisApiKey,
				domain : mntrUrl,
				output : 'json',
				epsg : 'EPSG:900913'
			},
			success : function(result) {
				var popupRoadAdresNm = (typeof result.NEW_JUSO == 'undefined') ? '' : result.NEW_JUSO;
				$('span#popupRoadAdresNm').text('' + popupRoadAdresNm);
			},
			error : function(data, status, err) {
				console.log(data);
			}
		});

		$.ajax({
			type : 'GET',
			async : false,
			dataType : 'jsonp',
			url : 'http://apis.vworld.kr/coord2jibun.do',
			data : {
				x : lonlat.lon,
				y : lonlat.lat,
				apiKey : gisApiKey,
				domain : mntrUrl,
				output : 'json',
				epsg : 'EPSG:900913'
			},
			success : function(result) {
				var popupLotnoAdresNm = (typeof result.ADDR == 'undefined') ? '' : result.ADDR;
				$('span#popupLotnoAdresNm').text('' + popupLotnoAdresNm);
			},
			error : function(data, status, err) {
				console.log(data);
			}
		});
	}

	//var btnReqCastnet = $('<button/>', {
	//	class : 'btn btn-primary btn-xs btn-ucp',
	//	onclick : 'javascript:doCastNetByWgs84(' + wgs84.x + ', ' + wgs84.y + ');',
	//	text : '주변영상',
	//	disabled : true
	//});

	if (evtOcrNo != '' && evtOcrPoint != '') {
		var rads = distance(evtOcrPoint.y, evtOcrPoint.x, wgs84.y, wgs84.x, 'K');
		if (rads <= 3) {
			btnReqCastnet.prop('disabled', false);
		}
	}

	previousFeatureselected = featureselected(new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat), 'point', '', false, true, false);
	Gis.MapTools.openPopup(lonlat, table.prop('outerHTML'), new OpenLayers.Size(320, 200), function(){
		removePreviousFeatureselected();
		Gis.MapTools.clearPopups();
	});
}

function managerInfo(nm, hp){
	if($('#managerInfo').length > 0) {
		$('#managerInfo').remove();
		$('#tbDanFcltInfo tbody tr:last-child').after($('<tr/>', {
			id: 'managerInfo'
		}));
		$('#managerInfo').append($('<td/>',{
			text : '담당자명: ' + (nm == 'null' ? '' : nm)
		}));
		$('#managerInfo').append($('<td/>',{
			colspan : '3',
			text : '전화번호: ' + (hp == 'null' ? '' : hp)
		}));
	}
	else{
		$('#tbDanFcltInfo tbody tr:last-child').after($('<tr/>', {
			id: 'managerInfo'
		}));
		$('#managerInfo').append($('<td/>',{
			text : '담당자명: ' + (nm == 'null' ? '' : nm)
		}));
		$('#managerInfo').append($('<td/>',{
			colspan : '3',
			text : '전화번호: ' + (hp == 'null' ? '' : hp)
		}));


	}


}

function featureselected(obj, featureType, label, isRemoveAll, isRefresh, isCenter, offset) {
	console.log('[MAP] feature selected.');

	if (typeof isRemoveAll == 'undefined' || isRemoveAll) {
		featureselectedLayer.removeAllFeatures();
	}

	var geometry = null;

	if (typeof obj.feature == 'undefined') {
		geometry = obj;
	}
	else {
		var feature = obj.feature;
		geometry = feature.geometry;
	}

	if (typeof label == 'undefined') {
		label = '';
	}

	var styleSelected = {
		externalGraphic : contextRoot + '/images/mntr/gis/selected/point_select.gif',
		pointRadius : 10,
		graphicXOffset : -30,
		graphicYOffset : -27,
		graphicWidth : 60,
		graphicHeight : 60,
		zIndex : 20,
		graphicZIndex : 20,
		label : label,
		fontColor : '#00f',
		fontSize : '13px',
		fontFamily : '맑은고딕',
		fontWeight : 'bold',
		labelAlign : 'rm',
		labelXOffset : 8,
		labelYOffset : 17,
		labelOutlineColor : '#fff',
		labelOutlineWidth : 3
	};

	if (featureType == 'event') {
		styleSelected.externalGraphic = contextRoot + '/images/mntr/gis/selected/alert.gif';
		if (typeof offset != 'undefined') {
			styleSelected.graphicXOffset = styleSelected.graphicXOffset + offset[0];
		}
		else {
			styleSelected.graphicXOffset = styleSelected.graphicXOffset;
		}
		styleSelected.graphicYOffset = -18;
		styleSelected.graphicHeight = 40;
	}
	else if (featureType == 'point') {
		removePreviousFeatureselected();
		styleSelected.externalGraphic = contextRoot + '/images/mntr/gis/selected/point_alizarin.gif';
	}  else if (featureType == 'danFclt') {
		removePreviousFeatureselected();
		styleSelected.externalGraphic = contextRoot + '/images/mntr/gis/selected/point_select.gif';
	}

	var pointSelected = new OpenLayers.Geometry.Point(geometry.x, geometry.y);
	var featureSelected = new OpenLayers.Feature.Vector(pointSelected, null, styleSelected);
	featureselectedLayer.addFeatures([
		featureSelected
	]);

	if (typeof isCenter != 'undefined' && isCenter) {
		var lonLat = new OpenLayers.LonLat(pointSelected.x, pointSelected.y);
		_map.setCenter(lonLat, _map.getZoom());
	}

	if (typeof isRefresh != 'undefined' && isRefresh) {
		featureselectedLayer.redraw();
	}

	return featureSelected;
}

/* 모든 팝업 닫기 */
function cancel() {
	Gis.MapTools.clearPopups();
}

function distance(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1 / 180;
	var radlat2 = Math.PI * lat2 / 180;
	var radlon1 = Math.PI * lon1 / 180;
	var radlon2 = Math.PI * lon2 / 180;
	var theta = lon1 - lon2;
	var radtheta = Math.PI * theta / 180;
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist);
	dist = dist * 180 / Math.PI;
	dist = dist * 60 * 1.1515;
	if (unit == "K") {
		dist = dist * 1.609344
	}
	;
	if (unit == "N") {
		dist = dist * 0.8684
	}
	;
	return dist;
}
