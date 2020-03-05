var currentFcltId = '';
function doCastNet(point, type, fcltId) {
	fcltLayer.setVisibility(false);
	fcltAngleLayer.setVisibility(false);
	eventLayer.setVisibility(false);

	var pointWgs84 = ''; // 위경도

	if (typeof point == 'undefined' || point == null) {
		var lon = _map.getCenter().lon;
		var lat = _map.getCenter().lat;
		pointWgs84 = TMtoWGS84(lon, lat);
		point = new OpenLayers.Geometry.Point(lon, lat);
	}
	else {
		pointWgs84 = TMtoWGS84(point.x, point.y);
	}

	if (typeof type == 'undefined' || type == null) {
		type = 'point';
	}
	
	var doChecked = '';
	var size = $('li#CTV.item-fclt input:checked').size();
	$('li#CTV.item-fclt input:checked ').each(function(index) {
		if (index == (size - 1)) {
			doChecked +=  $(this).val() ;
		}
		else {
			doChecked +=  $(this).val() +  ',';
		}
	});
	var itemFclt = $('li#CTV.item-fclt').exists();
	if( itemFclt && doChecked == '') {
			alert('선택된 CCTV가 없습니다.');
			return false;
	}
	
	$.ajax({
		type : 'POST',
		async : false,
		dataType : 'json',
		url : contextRoot + '/mntr/castNetCctvList.json',
		data : {
			pointX : pointWgs84.x,
			pointY : pointWgs84.y,
			radius : configureRadsRoute / 1000,
			searchFcltUsedType : doChecked,
			sysCd : configureSysCd,
			fcltId : typeof fcltId == 'undefined' ? '' : fcltId
		},
		success : function(data) {
			// 1. 지도에 표시. main.js
			collapse('right', false);
			collapse('bottom', false);

			featureselected(point, type, '', true, false, false);

			// 2. 카메라 요청.
			if (data.geoJson.features.length != 0) {
				drawCrossHair(point, configureRadsRoute);
				redraw();

				var geoJSON = new OpenLayers.Format.GeoJSON();
				var features = geoJSON.read(data.geoJson, "FeatureCollection");

				$.each(features, function(i, v) {
					v.style = {
						externalGraphic : contextRoot + '/images/mntr/gis/selected/point_carrot.gif',
						pointRadius : 10,
						graphicXOffset : -30,
						graphicYOffset : -27,
						graphicWidth : 60,
						graphicHeight : 60,
						zIndex : 20,
						graphicZIndex : 20,
						label : '(' + (i + 1) + ')',
						fontColor : '#fff',
						fontSize : '15px',
						fontFamily : '맑은고딕',
						fontWeight : 'bold',
						labelAlign : 'rm',
						labelXOffset : 26,
						labelYOffset : 17,
						labelOutlineColor : '#000',
						labelOutlineWidth : 6
					};

					if (v.attributes.fcltPriority != 1) {
						v.style.labelXOffset = -30 + (v.attributes.fcltPriority * 10);
					}
				});

				featureselectedLayer.addFeatures(features);

				if (typeof data.preset != 'undefined') {
					var preset = geoJSON.read(data.preset, "FeatureCollection");
					$.each(preset, function(i, v) {
						v.style = {
							externalGraphic : contextRoot + '/images/mntr/gis/selected/preset_non_select.png',
							pointRadius : 10,
							graphicXOffset : -13,
							graphicYOffset : -16,
							graphicWidth : 25,
							graphicHeight : 25,
							zIndex : 20,
							graphicZIndex : 20,
							label : v.attributes.presetNum,
							fontColor : '#ecf0f1',
							fontSize : '13px',
							fontFamily : '맑은고딕, MalgunGothic, NanumGothic',
							fontWeight : 'bold',
							labelAlign : 'cm',
							labelXOffset : 0,
							labelYOffset : 0
						};
						if (v.attributes.rank == 1) {
							v.style.externalGraphic = contextRoot + '/images/mntr/gis/selected/preset_select.png';
						}

						var cctvPoint = WGS84toTM(v.attributes.cctvX, v.attributes.cctvY);
						cctvPoint = new OpenLayers.Geometry.Point(cctvPoint.x, cctvPoint.y);
						var presetPoint = WGS84toTM(v.attributes.pointX, v.attributes.pointY);
						presetPoint = new OpenLayers.Geometry.Point(presetPoint.x, presetPoint.y);
						var presetLinefeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString([
								cctvPoint, presetPoint
						]), null, {
							stroke : true,
							strokeLinecap : 'square',
							strokeColor : '#ecf0f1',
							strokeOpacity : 1,
							strokeWidth : 3,
							zIndex : 20,
							graphicZIndex : 20
						});
						featureselectedLayer.addFeatures([
							presetLinefeature
						]);
					});
					featureselectedLayer.addFeatures(preset);
				}

				fcltLayer.setVisibility(true);
				eventLayer.setVisibility(true);

				var bounds = new OpenLayers.Bounds();
				$.each(features, function(index) {
					bounds.extend(new OpenLayers.LonLat(this.geometry.x, this.geometry.y));
				});
				bounds.top = bounds.top + 500;
				bounds.right = bounds.right + 500;
				bounds.bottom = bounds.bottom - 500;
				bounds.left = bounds.left - 500;

				_map.zoomToExtent(bounds, true);

				setTimeout(function() {
					$('#divCameraList').empty();

					$.each(data.cctv, function(i, v) {
						if (i == 0) {
							currentFcltId = v.fcltId;
						}

						var roadAdresNm = typeof v.roadAdresNm == 'undefined' ? '' : v.roadAdresNm;
						var lotnoAdresNm = typeof v.lotnoAdresNm == 'undefined' ? '' : v.lotnoAdresNm;

							trSub = $('<tr/>', {
								id: 'area-' + i,
								onclick: 'javascript:selectCctv(' + v.pointX + ', ' + v.pointY + ', "' + i + '");'
							});
						trSub.append($('<td/>', {
							id : v.fcltId,
							html : '<span>[<strong style="font-size:14px; color: #2980b9">' + (i + 1) + '</strong>] [' + v.fcltUsedTyNm + ']' + v.fcltLblNm + '</span><br><span>'
									+ lotnoAdresNm + '</span><span>(' + roadAdresNm + ')</span>'
						}));
							trSub.append($('<td/>', {
								class: 'text-center',
								text: v.presetNum == 0 ? '자동' : v.presetNum
							}));
							trSub.append($('<td/>', {
								html: '<span><button class="btn btn-primary btn-xs btn-ucp" onclick="openVmsPlayer(\'' + v.fcltId + '\')">보기</button></span>',
								class: 'text-center'
							}));
						$('#divCameraList').append(trSub);
					});
						startCastNet(data.cctv);

				}, 2000);
			}
			else {

				alert('반경 내 CCTV가 없습니다.');

				fcltLayer.setVisibility(true);
				eventLayer.setVisibility(true);
			}
		},
		error : function() {

			alert("주변영상 정보를 가져오지 못했습니다.");

			fcltLayer.setVisibility(true);
			eventLayer.setVisibility(true);
		}
	});
}


function doCastNetByFcltId(fcltId, type) {
	$.post(contextRoot + '/mntr/fcltById.json', {
		fcltId : fcltId
	}).done(function(data) {
		if(typeof data.pointX != 'undefined' 
			&& typeof data.pointY != 'undefined'
			&& data.pointX != ''
			&& data.pointY != ''
			&& data.pointX != '0'
			&& data.pointY != '0'
		) {
			var point = WGS84toTM(data.pointX, data.pointY);
			var tm = new OpenLayers.Geometry.Point(point.x, point.y);
			doCastNet(tm, type, fcltId);
		}
		else {
			//alert('위치 정보가 없는 이벤트입니다.');
		}
	});
}

function doCastNetByWgs84(pointX, pointY, type) {
	var point = WGS84toTM(pointX, pointY);
	var tm = new OpenLayers.Geometry.Point(point.x, point.y);
	doCastNet(tm, type,'');
}

function doCastNetByTM(pointX, pointY, type) {
	var point = new OpenLayers.Geometry.Point(pointX, pointY);
	doCastNet(point, type,'');
}

function doCastNetByEvtOcrNo() {
//	console.log('*****************  doCastNetByEvtOcrNo *************');
	var rtn = true;
	if (evtOcrNo == '') {
		alert('설정된 ' +  '발생번호가 없습니다.');
		return false;
	}

	$.ajax({
		type : 'POST',
		url : contextRoot + '/mntr/eventById.json',
		data : {
			evtOcrNo : evtOcrNo
		},
		success : function(data) {
			// 1. 지도로 이동.
			var point = WGS84toTM(data.pointX, data.pointY);
			point = new OpenLayers.Geometry.Point(point.x, point.y);
			evtOcrPoint = new OpenLayers.Geometry.Point(data.pointX, data.pointY);

			//2. DIV 표출. div.js
			if(configureSysCd != 'DAN') {
				doDivSituation(data.evtId, data.evtOcrNo);
			}

			var ocrFcltId = data.ocrFcltId;

			// 3. 주변영상보기
				if (ocrFcltId) {
					doCastNetByFcltId(ocrFcltId, 'event');
				} else {
					doCastNet(point, 'event');
				}
		},
		error : function() {
			alert('이벤트 정보를 가져오지 못했습니다.');
			rtn = false;
		}
	});
	return rtn;
}

function doCastNetBySelectEventFeature(evtOcrNoSel) {
	evtOcrNo = evtOcrNoSel;
	doCastNetByEvtOcrNo();

//	location.replace(contextRoot + '/mntr/main/main.do?evtOcrNo=' + evtOcrNo);
}

function stopCastNet() {
	if (evtOcrNo == '') {
		alert('설정된 ' +  '발생번호가 없습니다.');
		return false;
	}
	featureselectedLayer.removeAllFeatures();
	doDivNormal('NORMAL-000', null, null);

	currentFcltId = '';
	evtOcrNo = '';
	evtOcrPoint = '';

	destroyVms();
	collapse('right', false);
	collapse('bottom', true);
}

/* 표적그리기 */
function drawCrossHair(point, radius) {
	var circlePolygon = OpenLayers.Geometry.Polygon.createRegularPolygon(point, radius, 80, 0);
	var circleX2Polygon = OpenLayers.Geometry.Polygon.createRegularPolygon(point, radius * 2, 80, 0);
	var circleFeature = new OpenLayers.Feature.Vector(circlePolygon);
	var circleX2Feature = new OpenLayers.Feature.Vector(circleX2Polygon);
	point.y = point.y + 450;
	var circleLabelFeature = new OpenLayers.Feature.Vector(point);

	var circleStyle = {
		fill : true,
		fillColor : '#f1c40f',
		fillOpacity : 0.08,
		stroke : true,
		strokeColor : '#f00',
		strokeOpacity : 1,
		strokeWidth : 2,
		strokeDashstyle : 'dash',
		zIndex : 5,
		graphicZIndex : 5
	};

	var circleX2Style = {
		fill : true,
		fillColor : '#f1c40f',
		fillOpacity : 0.08,
		stroke : true,
		strokeColor : '#f00',
		strokeOpacity : 1,
		strokeWidth : 2,
		strokeDashstyle : 'dash',
		zIndex : 5,
		graphicZIndex : 5
	};

	var circleLabelStyle = {
		fontColor : '#00f',
		fontSize : '13px',
		fontFamily : '맑은고딕',
		fontWeight : 'bold',
		label : '반경 ' + radius + ' 미터',
		labelAlign : 'cm',
		labelXOffset : 0,
		labelYOffset : 0,
		labelOutlineColor : '#fff',
		labelOutlineWidth : 3
	}

	circleFeature.style = circleStyle;
	circleX2Feature.style = circleX2Style;
	circleLabelFeature.style = circleLabelStyle;

	featureselectedLayer.addFeatures([
			circleFeature, circleX2Feature, circleLabelFeature
	]);
}

/**
 * after functions not used.
 */

var castNetCnt = 0;

function oldDoCastNet(fcltId, presetNum) {

	if (typeof isInnodepInit != 'undefined' && isInnodepInit) {
		destroyInnodep();
	}
	if (typeof isMapsiInit != 'undefined' && isMapsiInit) {
		destroyMapsi();
	}

	var url = '';
	// var radius = 1;

	if (presetNum == '0') {
		url = contextRoot + '/mntr/autoCastNetCctvGeoList.json';
	}
	else {
		url = contextRoot + '/mntr/manualCastNetCctvGeoList.json';
	}

	$.post(contextRoot + '/mntr/fcltById.json', {
		fcltId : fcltId
	}).done(
			function(mainCctv) {
				if ($(mainCctv).exists()) {
					var pointX = mainCctv.pointX;
					var pointY = mainCctv.pointY;
					var point = WGS84toTM(pointX, pointY);
					var lonLat = new OpenLayers.LonLat(point.x, point.y);

					$.ajax({
						type : 'POST',
						async : false,
						dataType : 'json',
						url : url,
						data : {
							fcltId : fcltId,
							radius : configureRadsRoute / 1000,
							presetNum : presetNum
						},
						success : function(subCctv) {
							// SORT AREA [A1, A2, A3, A4]
							subCctv.features.sort(function(a, b) {
								return a.properties.area - b.properties.area;
							});
							// subCctv.features.reverse();

							if (subCctv.features.length == 0) {
								if (castNetCnt > 3) {
									alert('주변영상보기를 할 수 없는 지역입니다.');
									castNetCnt = 0;
									return false;
								}
								else {
									doCastNet(fcltId, '0');
									castNetCnt++;
									return false;
								}
							}

							drawHighlight(lonLat, subCctv);
							featureselectedLayer.redraw();

							setTimeout(function() {
								$('#divCameraList').empty();

								var trMain = $('<tr/>', {
									id : 'area-A0',
									onclick : 'javascript:selectCctv(' + mainCctv.pointX + ', ' + mainCctv.pointY + ', "' + 'A0' + '");'
								});
								trMain.append($('<td/>', {
									html : '<span>[<strong style="color: #2980b9">A0</strong>] ' + mainCctv.fcltLblNm + '(' + mainCctv.fcltUsedTyNm + ')</span><br><span>'
											+ mainCctv.roadAdresNm + '</span>'
								}));
								trMain.append($('<td/>', {
									class : 'text-center',
									text : '메인'
								}));
								trMain.append($('<td/>', {
									html : '<span><button class="btn btn-primary btn-xs btn-ucp" onclick="openVmsPlayer(\'' + mainCctv.fcltId + '\')">보기</button></span>',
									class : 'text-center'
								}));
								$('#divCameraList').append(trMain);

								$.each(subCctv.features, function(i, v) {
									trSub = $('<tr/>', {
										id : 'area-' + v.properties.area,
										onclick : 'javascript:selectCctv(' + v.properties.pointX + ', ' + v.properties.pointY + ', "' + v.properties.area + '");'
									});
									trSub.append($('<td/>', {
										html : '<span>[<strong style="color: #2980b9">' + v.properties.area + '</strong>] ' + v.properties.fcltLblNm + '('
												+ v.properties.fcltUsedTyNm + ')</span><br><span>' + v.properties.roadAdresNm + '</span>'
									}));
									trSub.append($('<td/>', {
										class : 'text-center',
										text : '서브'
									}));
									trSub.append($('<td/>', {
										html : '<span><button class="btn btn-primary btn-xs btn-ucp" onclick="openVmsPlayer(\'' + v.properties.fcltId + '\')">보기</button></span>',
										class : 'text-center'
									}));
									$('#divCameraList').append(trSub);
								});
							}, 1000);

							var bounds = new OpenLayers.Bounds();
							$.each(subCctv.features, function(index) {
								var location = this.geometry.coordinates;
								bounds.extend(new OpenLayers.LonLat(location));
							});
							_map.zoomToExtent(bounds, false);
							redraw();

							// CCTV 영상 TODO 실사용시 해제
							startCastNet(mainCctv, subCctv);
							castNetCnt = 0;
						},
						error : function() {
							alert("주변영상 정보를 가져오지 못했습니다.");
						}
					});
				}
				else {
					alert('해당 ID의 CCTV가 없습니다. [' + fcltId + ']');
					return false;
				}
			});
}

function oldDoCastNetBySelectRow(rowData) {
	var evtOcrNo = rowData.evtOcrNo;
	var evtId = rowData.evtId;

	var fcltId = rowData.ocrFcltId;
	var pointX = rowData.pointX;
	var pointY = rowData.pointY;
	var presetNum = '0';

	if (fcltId != null && fcltId != '') {
		console.log('[WEB] 관련시설물 있음.');
		doCastNet(fcltId, presetNum);
	}
	else {
		if (pointX != '0' && pointY != '0' && pointX != '' && pointY != '') {
			console.log('[WEB] 관련시설물 없음. 인근 카메라 검색.');
			$.post(contextRoot + '/mntr/nearestCctv.json', {
				pointX : pointX,
				pointY : pointY
			}).done(function(data) {
				doCastNet(data.fcltId, presetNum);
			}).error(function(error) {
				console.log('[WEB] 인근 카메라 없음 주변영상보기 불가.');
				alert('인근 CCTV를 찾을 수 없어 주변영상보기가 불가능합니다.');
			});
		}
		else {
			console.log('[WEB] 주변영상보기를 위한 조건을 충족하지 못함. 관련시설물 아이디, 이벤트 발생 좌표 없음.');
			alert('주변영상보기를 위한 조건이 부족합니다.');
		}
	}

	console.log('[WEB] do castnet.');
}

function oldDoCastNetBySelectEventFeature(evtOcrNo) {
	var feature = null;
	for (var f = 0; f < eventLayer.features.length; f++) {
		if (eventLayer.features[f].attributes.evtOcrNo == evtOcrNo) {
			feature = eventLayer.features[f];
			break;
		}
	}

	if (feature == null) {
		alert('검색된 제난상황이 없습니다.');
		return false;
	}

	var attr = feature.attributes;
	var evtId = attr.evtId;
	var evtOcrNo = attr.evtOcrNo;

	var fcltId = attr.ocrFcltId;
	var pointX = attr.pointX;
	var pointY = attr.pointY;

	var point = WGS84toTM(pointX, pointY);
	drawCrossHair(point, configureRadsRoute);

	doDivSituation(evtId, evtOcrNo);

	var presetNum = '0';

	if (fcltId != null && fcltId != '') {
		console.log('[WEB] 관련시설물 있음.');
		doCastNet(fcltId, presetNum);
	}
	else {
		if (pointX != '0' && pointY != '0' && pointX != '' && pointY != '') {
			console.log('[WEB] 관련시설물 없음. 인근 카메라 검색.');
			$.post(contextRoot + '/mntr/nearestCctv.json', {
				pointX : pointX,
				pointY : pointY
			}).done(function(data) {
				doCastNet(data.fcltId, presetNum);
			}).error(function(error) {
				console.log('[WEB] 인근 카메라 없음 주변영상보기 불가.');
				alert('인근 CCTV를 찾을 수 없어 주변영상보기가 불가능합니다.');
			});
		}
		else {
			console.log('[WEB] 주변영상보기를 위한 조건을 충족하지 못함. 관련시설물 아이디, 이벤트 발생 좌표 없음.');
			alert('주변영상보기를 위한 조건이 부족합니다.');
		}
	}

	console.log('[WEB] do castnet.');
}

function oldDoCastNetByEvtOcrNo() {
	if (evtOcrNo == '') {
		alert('설정된 ' +  '발생번호가 없습니다.');
		return false;
	}

	$.ajax({
		type : 'POST',
		url : contextRoot + '/mntr/eventById.json',
		data : {
			evtOcrNo : evtOcrNo,
		},
		success : function(data) {
			featureselectedLayer.removeAllFeatures();

			// 1. 지도로 이동.
			var point = WGS84toTM(data.pointX, data.pointY);

			// 2. 지도에 표시. main.js
			featureselected(point, 'event', '', false, false);
			drawCrossHair(point, configureRadsRoute);

			// 3. DIV 표출. div.js
			doDivSituation(data.evtId, data.evtOcrNo);

			// 4. 주변영상보기
			doCastNetBySelectRow(data);
		},
		error : function() {
			alert('이벤트 정보를 가져오지 못했습니다.');
		}
	});
}

function oldDoCastNetByFcltId(fcltId) {
	featureselectedLayer.removeAllFeatures();
	$.ajax({
		type : 'POST',
		url : contextRoot + '/mntr/fcltById.json',
		data : {
			fcltId : fcltId,
		},
		success : function(data) {
			// 1. 지도로 이동.
			var point = WGS84toTM(data.pointX, data.pointY);

			// 2. 지도에 표시. main.js
			drawCrossHair(point, configureRadsRoute);

			// 3. DIV 표출. div.js
			doCastNet(fcltId, '0');
		},
		error : function() {
			alert('시설물 정보를 가져오지 못했습니다.');
		}
	});
}

function oldDoCastNetByPoint() {
	var lon = _map.getCenter().lon;
	var lat = _map.getCenter().lat;
	var point = new OpenLayers.Geometry.Point(lon, lat);
	var pointWGS84 = TMtoWGS84(lon, lat);

	featureselected(point, 'point', '', true, true);

	drawCrossHair(point, configureRadsRoute);

	$.post(contextRoot + '/mntr/nearestCctv.json', {
		pointX : pointWGS84.x,
		pointY : pointWGS84.y
	}).done(function(data) {
		doCastNet(data.fcltId, '0');
	}).error(function(error) {
		console.log('[WEB] 인근 카메라 없음 주변영상보기 불가.');
		alert('인근 CCTV를 찾을 수 없어 주변영상보기가 불가능합니다.');
	});
}

/* 선택된 CCTV 하일라이트 */
function drawHighlight(lonLat, data) {
	var features = [];
	var presets = [];

	if (lonLat) {
		featureselected(new OpenLayers.Geometry.Point(lonLat.lon, lonLat.lat), 'castnetMain', 'A0', false, false);
	}

	if (data) {
		$.each(data.features, function(index) {
			var highlightPx = this.geometry.coordinates[0];
			var highlightPy = this.geometry.coordinates[1];

			featureselected(new OpenLayers.Geometry.Point(highlightPx, highlightPy), 'castnetSub', this.properties.area, false, false);

			var properties = this.properties;
			if (properties.presetX && properties.presetY) {
				var preset = WGS84toTM(properties.presetX, properties.presetY);
				var presetLonlat = new OpenLayers.LonLat(preset.x, preset.y);

				var presetPoint = new OpenLayers.Geometry.Point(presetLonlat.lon, presetLonlat.lat);
				var presetFeature = new OpenLayers.Feature.Vector(presetPoint, null, {
					externalGraphic : contextRoot + "/images/gis/" + properties.presetNum + ".gif",
					pointRadius : 4,
					graphicXOffset : -5,
					graphicYOffset : -5,
					graphicWidth : 12,
					graphicHeight : 12,
					zIndex : 20,
					graphicZIndex : 20
				});

				var presetLine = [
						highlightPoint, presetPoint
				];
				var presetLinefeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(presetLine), null, {
					stroke : true,
					strokeLinecap : 'square',
					strokeColor : '#ee9900',
					strokeOpacity : 1,
					strokeWidth : 3,
					zIndex : 20,
					graphicZIndex : 20
				});
				presets.push(presetLinefeature);
				presets.push(presetFeature);

				featureselectedLayer.addFeatures([
					presets
				]);
			}

		});
	}
}

function setCenter(pointX, pointY, fcltId) {
	var point = WGS84toTM(pointX, pointY);
	var lonLat = new OpenLayers.LonLat(point.x, point.y);
	_map.setCenter(lonLat, _map.getZoom());

	removePreviousFeatureselected();
	previousFeatureselected = featureselected(point, '', '', false, true);

	if (fcltId) {
		// openCctv(fcltId);
	}
}
