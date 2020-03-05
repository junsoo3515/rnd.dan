<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/jsp/mntr/cmm/commonTags.jsp"%>
<script type="text/javascript" src="<c:url value='/js/socket/socket.io.js'/>"></script>
<script>
	var currentFcltId = '';
	var evtOcrNo = '${common.evtOcrNo}';
	var evtOcrPoint = '';

	if (typeof (Storage) === 'undefined') {
		alert('Web Storage를 지원하지 않는 브라우져입니다. 이벤트 수신을 할 수 없습니다.');
	}

	var audio = null;
	if (typeof (Audio) === 'undefined') {
		audio = new Audio('<c:url value="/sound/alert.mp3" />');
	}

	// websoket 이벤트 수신
	var websocketPort = '<spring:eval expression="@config['Globals.WebSocketPort']"/>';
	var webSocketUrl = null;
	if(websocketIp != '' && websocketPort != '') {
		webSocketUrl = 'http://' + websocketIp + ':' + websocketPort;
	}

	var sPath = window.location.pathname;
	var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);

	if(webSocketUrl != null) {
		// 권한이 있는 이벤트 종류를 가져온다.
		$.post(contextRoot + '/dan/monitor/eventKindList.json').done(function(data) {
			var authorizedEventList = data.list;
			var socket = io.connect(webSocketUrl);
			socket.on('response', function(evt) {
				var receivedEvtId = evt.evtId;
				var receivedEvtPrgrsCd = evt.evtPrgrsCd;
				var receivedOcrFcltId = evt.ocrFcltId;
				var receivedEvtOcrNo = evt.evtOcrNo;
				var receivedEvtPlace = evt.evtPlace;
				var receivedEvtOcrHms = evt.evtOcrHms;
				var receivedPointX = evt.pointX;
				var receivedPointY = evt.pointY;
				var receivedEvtIdSubCd = evt.evtIdSubCd;

				$.each(authorizedEventList, function(i, v) {
					console.log('[web socket receive] eventId :' + receivedEvtId + ', EvtOcrNo:' + receivedEvtOcrNo + ', PrgrsCd:' + receivedEvtPrgrsCd);
					if(receivedEvtId == v.comCd && receivedEvtIdSubCd == '화재') {
						if(receivedEvtPrgrsCd >= 90) {
							if (evtOcrNo == receivedEvtOcrNo) {
								fireClear();
							}
						} else {
							if (typeof eventLayer != 'undefined') {
								eventLayer.redraw();
							}
							autoDisTimeDelay(receivedEvtOcrNo,receivedEvtPlace,receivedEvtOcrHms,receivedPointX,receivedPointY,0);
						}
						gridReload('popDan', 1, {});
					}
				});
			});
		});
	} else {
		alert('잘못된 소켓 접속 정보입니다. 이벤트 수신을 할 수 없습니다.');
	}
	// websocket end

	$(function() {
		/* 이벤트 목록 */
		$('#grid-popDan').jqGrid(
				{
					url : contextRoot + '/dan/monitor/fireListReq.json',
					datatype : 'json',
					mtype : 'POST',
					height : 222,
					autowidth : true,
					rowNum : 9999,
					multiselect : true,
					loadComplete : function(data) {
						checkGridNodata('popDan', data);
						pagenationReload('popDan', data, getGridParams());
					},
					colNames : [
						'evtOcrNo',  '내용', '세부정보', 'pointX', 'pointY'
					],
					colModel : [
						{
							name : 'evtOcrNo',
							key : false,
							hidden : true
						},  {
							name : 'evtDtl',
							sortable : false,
							align : 'left',
							classes : 'jqgrid_cursor_pointer',
							cellattr : function() {
								return 'style="width: 80%; padding: 2px 2px 2px 2px;"'
							},
							formatter : function(cellvalue, options, rowObject) {
								return "<font color=blue>" + rowObject.evtOcrNo + "</font>" + "[" + "<font color=red>" + rowObject.evtDtl + "</font>" + "]<br>"
										+ rowObject.evtOcrYmdHms + " " + rowObject.evtPlace;
							},
							width : 62
						},
						{
							name : 'mntrReq',
							align : 'center',
							sortable : false,
							cellattr : function() {
								return 'style="width: 16%; padding: 5px 0px 5px 0px;"'
							},
							formatter : function(cellvalue, options, rowObject) {
								var btn = $('<btn/>', {
									class : 'btn btn-primary btn-ucp btn-xs',
									style : 'height: 25px; padding: 2px 10px 2px 10px;',
									onclick : 'javascript:requestDanFclt(\'' + rowObject.evtOcrNo +'\'' +
																	   ',\''+ rowObject.pointX+'\'' +
									                                   ',\'' + rowObject.pointY + '\'' +
								                                       ',\'' + rowObject.evtDtl + '\'' +
								                                       ',\'' + rowObject.evtOcrYmdHms + '\'' +
								                                       ',\'' + rowObject.evtPlace + '\');',
									text : '보기'
								});

								return btn.prop('outerHTML');
							},
							width : 16
						},
						{
							name : 'pointX',
							key : false,
							hidden : true
						}, {
							name : 'pointY',
							key : false,
							hidden : true
						}
					],
					jsonReader : {
						root : "rows",
						total : "totalPages",
						records : function(obj){
							$('#rowCnt').text(obj.totalRows);
							return obj.totalRows;
						}
					},
					onSelectRow : function(rowId) {
						var rowData = $('#grid-popDan').getRowData(rowId);
						if(rowData.pointX && rowData.pointY) {
							var point = WGS84toTM(rowData.pointX, rowData.pointY);
							var lonLat = new OpenLayers.LonLat(point.x, point.y);
							_map.setCenter(lonLat, _map.getZoom());
						}
					}
				});

		/* 이벤트 목록 */
		$('#grid-portal').jqGrid({
			url : contextRoot + '/dan/monitor/portalSearch.json',
			datatype : 'json',
			mtype : 'POST',
			height : 'auto',
			autowidth : true,
			rowNum : 5,
			postData : {
				searchType : $('#searchType option:selected').val(),
				searchKeyword : $('#div-portal #searchKeyword').val()
			},
			beforeRequest : function() {
				if ($('#div-portal #searchKeyword').val() == '') {
					setGridNodata('portal', '키워드를 입력하세요.');
					return false;
				}
			},
			beforeProcessing : function(data, status, xhr) {

			},
			loadComplete : function(data) {
				checkGridNodata('portal', data);
				pagenationReload('portal', data, getGridPortalParam());
			},
			colNames : [
				'구분', 'pointX', 'pointY', '내용'
			],
			colModel : [
				{
					name : 'gubn',
					align : 'center',
					classes : 'jqgrid_cursor_pointer',
					cellattr : function() {
						return 'style="width:20%;"'
					},
					width : 20
				}, {
					name : 'pointX',
					hidden : true
				}, {
					name : 'pointY',
					hidden : true
				}, {
					name : 'contents',
					align : 'left',
					classes : 'jqgrid_cursor_pointer',
					cellattr : function() {
						return 'style="width:80%;"'
					},
					width : 80
				}
			],
			jsonReader : {
				root : "rows",
				total : "totalPages",
				records : "totalRows"
			},
			onSelectRow : function(rowId) {
				var rowData = $('#grid-portal').getRowData(rowId);
				if (typeof rowData.pointX != 'undefined' && typeof rowData.pointY != 'undefined') {
					var point = null;
					if ('위험시설물' === rowData.gubn) {
						point = WGS84toTM(rowData.pointX, rowData.pointY);
						previousFeatureselected = featureselected(point, 'danFclt', '', false, true, true);
					}
					else {
						point = new OpenLayers.Geometry.Point(rowData.pointX, rowData.pointY);
						previousFeatureselected = featureselected(point, 'point', '', false, true, true);
					}
				}
				else {
					alert('위치 정보가 없는 데이터 입니다.');
					$('#grid-portal tr.ui-widget-content.jqgrow.ui-row-ltr.ui-state-highlight').removeClass('ui-state-highlight');
				}
			},
			cmTemplate : {
				sortable : false
			}
		});
	});

	function getGridPortalParam() {
		var param = {
			searchType : $('#searchType option:selected').val(),
			searchKeyword : $('#div-portal #searchKeyword').val()
		};
		return param;
	}

	function gridPortalReload() {
		gridReload('portal', 1, getGridPortalParam());
		var data = {
			page : 1,
			totalPages : 1
		}
		pagenationReload('portal', data, getGridPortalParam());


	}


	function requestDanFclt(evtOcrNoSel, pointX, pointY, evtDtl, evtOcrYmdHms, evtPlace) {
		evtOcrNo = evtOcrNoSel;
		/*위험시설물 목록, 재난정보, 발생지점 위험시설물위치 목록 가져오기*/
		$('#danFcltPlace').empty();
		doDanFcltDetail();
		fireInfo(evtOcrNo, evtDtl, evtOcrYmdHms, evtPlace);
		searchGridNear(pointX, pointY);
	}

	function fireInfo(evtOcrNo, evtDtl, evtOcrYmdHms, evtPlace){
		$('#divFireInfo').empty();
		trInfo = $('<tr>',{});

		trInfo.append($('<td/>',{
			style :  'padding: 0px 5px; vertical-align: middle;">',
			html : '<span style="color: blue;">' + evtOcrNo + '</span>[<span style="color:red">' + evtDtl + '</span>]<br>' + evtOcrYmdHms + '&nbsp;' + evtPlace
		}));

		trInfo.append($('<td/>',{
			style : 'padding: 0px 5px; vertical-align: middle; white-space: nowrap;',
			html : '<button class="btn btn-primary btn-xs btn-ucp" onclick="javascript:doDanFcltDetail();">발생위치</button>' +
			'<button class="btn btn-primary btn-xs btn-ucp" onclick="javascript:fireClear();">해제</button>'
		}));

		$('#divFireInfo').append(trInfo);
	}

	function fireClear() {
		if (evtOcrNo == '') {
			alert('설정된 ' +  '발생번호가 없습니다.');
			return false;
		}
		featureselectedLayer.removeAllFeatures();

		currentFcltId = '';
		evtOcrNo = '';
		evtOcrPoint = '';
		$('#divFireInfo').empty();
		$('#danFcltPlace').empty();
		searchGridNear('','');
		$('#paginate-near').empty();

	}



	function doDanFcltDetail() {
//	console.log('*****************  doCastNetByEvtOcrNo *************');
		var rtn = true;
		if (evtOcrNo == '') {
			alert('설정된 ' +  '발생번호가 없습니다.');
			return false;
		}

		$.ajax({
			type : 'POST',
			url : contextRoot + '/dan/monitor/eventById.json',
			data : {
				evtOcrNo : evtOcrNo
			},
			success : function(data) {
				// 1. 지도로 이동.
				var point = WGS84toTM(data.pointX, data.pointY);
				point = new OpenLayers.Geometry.Point(point.x, point.y);
				evtOcrPoint = new OpenLayers.Geometry.Point(data.pointX, data.pointY);

				var ocrFcltId = data.ocrFcltId;
				// 2. 주변영상보기
				if (ocrFcltId) {
					doCastNetByDanFcltId(ocrFcltId, 'event');
				} else {
					danFcltLocList(point, 'event');
				}
			},
			error : function() {
				alert('이벤트 정보를 가져오지 못했습니다.');
				rtn = false;
			}
		});
		return rtn;
	}

	/* 그리드 파라메터*/
	function getGridParams(){
		var param = {

		};
		return param;
	}


	function danFcltLocList(point, type) {
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
		var size = $('li#TY.item-fclt input:checked').size();
		$('li#TY.item-fclt input:checked ').each(function(index) {
			if (index == (size - 1)) {
				doChecked +=  $(this).val() ;
			}
			else {
				doChecked +=  $(this).val() +  ',';
			}
		});
		var itemFclt = $('li#TY.item-fclt').exists();
		if( itemFclt && doChecked == '') {

				alert('선택된 시설물이 없습니다.');
				eventLayer.setVisibility(true);
			return false;
		}

		$.ajax({
			type : 'POST',
			async : false,
			dataType : 'json',
			url : contextRoot + '/dan/monitor/castNetDanFcltList.json',
			data : {
				pointX : pointWgs84.x,
				pointY : pointWgs84.y,
				radius : configureRadsRoute / 1000,
				searchDanFcltType : doChecked
			},
			success : function(data) {
				// 1. 지도에 표시. main.js
				collapse('right', false);
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
						$('#danFcltPlace').empty();

						$.each(data.danFclt, function(i, v) {
							if (i == 0) {
								currentFcltId = v.facCd;
							}

							var addr = typeof v.addr == 'undefined' ? '' : v.addr;

							trSub = $('<tr/>', {
								id: 'area-' + i,
								onclick : 'javascript:selectDanFclt(' + v.pointX + ',' + v.pointY + ', "' + i + '");'
							});

							trSub.append($('<td/>', {
								id : v.facCd,
								html : '<span>[<strong style="font-size:14px; color: #2980b9">' + (i + 1) + '</strong>] [' + v.typeNm + ']' + v.facNm + '</span><br><span>'
								+ addr
							}));
							castNetFeature[i]= features[i];
							trSub.append($('<td/>', {
								html: '<span><button class="btn btn-primary btn-xs btn-ucp"  style="width: 65px;" onclick="openDanFcltDetail(' + i + ', castNetFeature)">보기</button></span>',
								class: 'text-center'
							}));

							$('#danFcltPlace').append(trSub);
						});
					}, 500);
				}
				else {

					alert('반경 내 위험시설물이 없습니다.');

					fcltLayer.setVisibility(true);
					eventLayer.setVisibility(true);
				}
			},
			error : function() {

				alert("주변 위험시설물 정보를 가져오지 못했습니다.");

				fcltLayer.setVisibility(true);
				eventLayer.setVisibility(true);
			}
		});
	}

	function doCastNetByDanFcltId(facCd, type) {
		$.post(contextRoot + '/dan/monitor/danFcltById.json', {
			facCd : facCd
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
				danFcltLocList(tm, type, facCd);
			}
			else {
				alert('위치 정보가 없는 이벤트입니다.');
			}
		});
	}

	/* autoDisTimeDelay */
	function autoDisTimeDelay(prmEvtOcrNo,prmEvtOcrPlace,prmEvtOcrHms,prmPointX,prmPointY,prmChk) {
		cTime = new Date();
		if (bTime == null) {
			bTime = cTime;
			requestFireAuto(prmEvtOcrNo,prmEvtOcrPlace,prmEvtOcrHms,prmPointX,prmPointY);
		} else {
			var t = (Number(cTime.getTime()) - Number(bTime.getTime())) / 1000;
			if (t > 9) {
				bTime = cTime;
				requestFireAuto(prmEvtOcrNo,prmEvtOcrPlace,prmEvtOcrHms,prmPointX,prmPointY);
			}
		}
	}
	/* 화재목록자동표출 */
	function requestFireAuto(evtOcrNoSel,evtOcrPlaceSel,evtOcrHmsSel,pointXSel,pointYSel) {
		var rtn = true;
		var doChecked = '';
		var size = $('li#TY.item-fclt input:checked').size();
		$('li#TY.item-fclt input:checked ').each(function(index) {
			if (index == (size - 1)) {
				doChecked +=  $(this).val() ;
			}
			else {
				doChecked +=  $(this).val() +  ',';
			}
		});
		if(localStorage['autoEvtCheck'] != 'Y'){
			return rtn;
		}
		window.focus();

		evtOcrNo = evtOcrNoSel;

		$.ajax({
			type : 'POST',
			url : contextRoot + '/dan/monitor/autoDisList.json',
			async : false,
			data : {
				evtOcrNo : evtOcrNo,
				pointX : pointXSel,
				pointY : pointYSel,
				evtPlace : evtOcrPlaceSel,
				evtOcrHms : evtOcrHmsSel,
				radius : configureRadsRoute / 1000,
				searchDanFcltType : doChecked
			},
			success : function(data) {
				// 자동표출관련 옵션 체크
				// 세부항목이 화재인경우만 자동표출
				// 해당건 테이블에 데이터 직접 등록 2017.03.06 추후 UI추가
				if (typeof data.evtIdSubCd != 'undefined' && data.evtIdSubCd != '') {
					rtn = requestDanFclt(data.evtOcrNo, data.pointX, data.pointY, data.evtDtl, data.evtOcrYmdHms, data.evtPlace);
				}
			},
			error : function() {
				console.log('**** requestMntrAuto ==== 이벤트 정보를 가져오지 못했습니다.');
			}
		});
		return rtn;
	}

</script>

<script src="<c:url value='/js/mntr/main/main.js' />"></script>

<article id="article-left">
	<div class="col">
		<div class="panel panel-default panel-ucp">
		<div class="panel-heading panel-heading-1">
			<h3 class="panel-title">화재목록
				(건수:&nbsp;<span id="rowCnt"></span>건)
				<div class="btn" id="evtSwitcher">
					<input type="checkbox" id="checkSwitch" aria-label="자동표출"  >
					<span  id="evtSwitchBtn">자동표출</span>
				</div>
			</h3>
		</div>
		<div class="panel-body">
			<div class="row">
				<div class="col-xs-12">
					<table id="grid-popDan"></table>
				</div>
			</div>
		</div>
		<div class="panel-footer">
			<div id="paginate-popDan" class="paginate text-center"></div>
		</div>
		</div>
	</div>
	<div class="col">
		<div class="panel panel-default panel-ucp" id="div-portal">
			<div class="panel-heading">
				<h3 class="panel-title">통합검색</h3>
			</div>
			<div class="panel-body">
				<div id="searchBar" class="row">
					<div class="searchBox">
						<div class="form-inline">
							<div class="col-xs-7 text-left">
								<div class="form-group" style="width: 100%;">
									<input id="searchKeyword" class="form-control input-sm" style="width: 100%;" placeholder="검색할 키워드를 입력하세요." />
								</div>
							</div>
							<div class="col-xs-3 text-right">
								<div class="form-group">
									<select id="searchType" class="form-control input-sm">
										<option value="addr" selected="selected">주소</option>
										<option value="poi">POI</option>
										<option value="danFclt">시설물</option>
									</select>
								</div>
							</div>
							<div class="col-xs-2 text-right">
								<div class="form-group">
									<button class="btn btn-primary btn-sm btn-ucp" onclick="javascript:gridPortalReload();">검색</button>
								</div>
							</div>
						</div>
					</div>

					<table id="grid-portal"></table>

					<div id="paginate-portal" class="paginate text-center"></div>
				</div>
			</div>
		</div>
	</div>
	<div class="col"></div>
	<div class="col"></div>
</article>
<script>
	localStorage['autoEvtCheck'] == 'Y' ? $('#checkSwitch').attr('checked', true) : $('#checkSwitch').attr('checked', false);

	// 자동표출 start
	var dstrtCd  	= '${dstrtCd}';
	var cTime= null;
	var bTime= null;

	$("#evtSwitchBtn").click(function() {
		$("#checkSwitch").trigger('click');
	});
	$("#checkSwitch").change(function() {
		localStorage['autoEvtCheck'] = (this.checked == true) ? 'Y' : 'N';
	});
	// 자동표출 end
</script>
