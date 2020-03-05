<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/jsp/mntr/cmm/commonTags.jsp"%>
<style>
	#danFcltPlace td {
		vertical-align: middle;
		padding: 3px;
	}
</style>
<article id="article-right">
	<div class="col">
		<div class="panel panel-default panel-ucp" id="div-evtCastnet">
			<div class="panel-heading">
				<h3 class="panel-title">위험시설물위치목록</h3>
			</div>
			<div class="panel-body">
				<table class="table table-bordered table-ucp">
					<colgroup>
						<col style="width: *;">
							<col style="width: 70px;">
					</colgroup>
					<thead>
					<tr>
							<th class="text-center">위험시설물위치</th>
							<th class="text-center">상세정보</th>
					</tr>
					</thead>
					<tbody id="danFcltPlace"></tbody>
				</table>
			</div>
		</div>
	</div>
	<div class="col">
		<div class="panel panel-default panel-ucp">
			<div class="panel-heading">
				<h3 class="panel-title">화재정보</h3>
			</div>
			<div class="panel-body">
				<table class="table table-bordered divInfo">
					<colgroup>
						<col style="width: 70%;">
						<col style="width: 30%;">
					</colgroup>
					<tbody id="divFireInfo">
					</tbody>
				</table>
			</div>
		</div>
	</div>
	<div class="col">
		<div class="panel panel-default panel-ucp">
			<div class="panel-heading">
				<h3 class="panel-title">발생지점 위험시설물위치 목록</h3>
			</div>
			<div class="panel-body">
				<div id="searchBar" class="row">
					<div class="searchBox">
						<div class="form-inline" style="white-space: nowrap;">
							<div class="form-group">
								<label for="searchRadius">반경(m)</label>
								<input type="number" class="form-control input-sm" id="searchRadius" size="4" min="100" max="9999" maxlength="4" placeholder="반경">
							</div>
							<div class="form-group">
								<button class="btn btn-primary btn-sm btn-ucp" onclick="javascript:searchGridNear();">검색</button>
							</div>
						</div>
					</div>
					<div class="searchBox">
						<div class="form-inline">
							<div class="col-xs-12">
								<div class="form-group" style="width: 100%;">
									<label for="searchFcltLblNm" class="sr-only">시설물명</label>
										<input id="searchFcltLblNm" class="form-control input-sm" style="width: 100%;" placeholder="검색할 위험시설물명을 입력하세요." />
								</div>
							</div>
						</div>
					</div>

					<table id="grid-near"></table>

					<div id="paginate-near" class="paginate text-center"></div>
				</div>
			</div>
		</div>
	</div>
	<div class="col"></div>
</article>
<script>
	var x = '';
	var y = '';
	var doChecked = '';

	$(function() {
		$('#searchRadius').val(configureRadsClmt);


		/* 이벤트 목록 */
		$('#grid-near').jqGrid({
			url : contextRoot + '/dan/monitor/nearestDanFcltList.json',
			datatype : 'json',
			mtype : 'POST',
			height : 'auto',
			width: 345,
			rowNum : 5,
			postData : {
				pointX : x,
				pointY : y,
				searchRadius : $('#searchRadius').val() / 1000,
				searchFcltLblNm : $('#searchFcltLblNm').val(),
				searchDanFcltType : doChecked
			},
			loadComplete : function(data) {
				if(data.rows.length > 0) {
					var geoJSON = new OpenLayers.Format.GeoJSON();
					var features = geoJSON.read(data.geoJson, "FeatureCollection");
					$.each(data.rows, function(i, v) {

						nearestFeature[i] = features[i];

					});
				}
				pagenationReload('near', data, getGridNearParam());
			},
			colNames :
					[
						'rnum',
						'facCd',
						'pointX',
						'pointY',
						'typeCd',
						'typeNm',
						'위험시설물명',
						'거리',
						'상세정보'
					],
			colModel : [

				{
					name : 'rnum',
					hidden : true
				},{
					name : 'facCd',
					key : true,
					hidden : true
				}, {
					name : 'pointX',
					hidden : true
				}, {
					name : 'pointY',
					hidden : true
				}, {
					name : 'typeCd',
					hidden : true
				}, {
					name : 'typeNm',
					hidden : true
				}, {
					name : 'facNm',
					align : 'left',
					classes : 'jqgrid_cursor_pointer',
					cellattr : function() {
						return 'style="width:70%;"'
					},
					formatter : function(cellvalue, options, rowObject) {
						return '[' + rowObject.typeNm + ']' + rowObject.facNm + '<br>' + rowObject.addr;
					},
					width : 70
				}, {
					name : 'distance',
					align : 'center',
					classes : 'jqgrid_cursor_pointer',
					cellattr : function() {
						return 'style="width:15%;"'
					},
					formatter : function(cellvalue, options, rowObject) {
						return Math.floor(rowObject.distance * 1000 * 100) / 100 + 'm';
					},
					width : 15
				},
				{
					name : 'mntrReq',
					align : 'center',
					sortable : false,
					cellattr : function() {
						return 'style="width: 15%; padding: 5px 0px 5px 0px;"'
					},
					formatter : function(cellvalue, options, rowObject) {
						var btn = $('<btn/>', {
							class : 'btn btn-primary btn-ucp btn-xs',
							style : 'height: 25px; padding: 2px 10px 2px 10px;',
							onclick : function() {
								return 'javascript:openDanFcltDetail(' + ( rowObject.rnum%5 == 0 ? 4 : (rowObject.rnum%5)-1 ) + ', nearestFeature);';
							},
							text : '보기'
						});

						return btn.prop('outerHTML');
					},
					width : 15
				}
			],
			jsonReader : {
				root : "rows",
				total : "totalPages",
				records : "totalRows"
			},
			onSelectRow : function(rowId) {
				var rowData = $('#grid-near').getRowData(rowId);
				var point = WGS84toTM(rowData.pointX, rowData.pointY);
				removePreviousFeatureselected();
				previousFeatureselected = featureselected(point, '', '', false, true, true);
			},
			cmTemplate : {
				sortable : false
			}
		});
	});


	function getGridNearParam(pointX, pointY, doChecked) {
		if ($('#searchRadius').val() == '') {
			$('#searchRadius').val(radius * 1000);
		}

		var param = {
			pointX : pointX,
			pointY : pointY,
			searchRadius : $('#searchRadius').val() / 1000,
			searchFcltLblNm : $('#searchFcltLblNm').val(),
			searchDanFcltType : doChecked
		};
		return param;
	}

	function searchGridNear(pointX, pointY) {
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
			return false;
		}
		x = pointX;
		y = pointY;
		gridReload('near', 1, getGridNearParam(pointX, pointY, doChecked));
	}

	function selectDanFclt(pointX, pointY, area) {
		removePreviousFeatureselected();
		var trArea = $('#div-evtCastnet tr[id^=area]');
		trArea.removeClass('active');
		$('#area-' + area).addClass('active');

		currentFcltId = $('#area-' + area).find('td')[0].id;
		currentIndex = Number(area);

		var point = WGS84toTM(pointX, pointY);
		previousFeatureselected = featureselected(point, 'fclt', '', false, true, true);
	}

	function openDanFcltDetail(i, featureName) {
		console.log(featureName);
		var geometry = featureName[i].geometry;

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
			text : featureName[i].attributes.facNm
		}));

		$(trs[1]).append($('<th/>', {
			text :  '종류',
			class : 'success'
		}));

		$(trs[1]).append($('<td/>', {
			text : featureName[i].attributes.typeNm
		}));

		$(trs[2]).append($('<th/>', {
			text : '주소',
			class : 'success'
		}));

		$(trs[2]).append($('<td/>', {
			text : featureName[i].attributes.addr
		}));

		$(trs[3]).append($('<th/>', {
			text : '담당자명',
			class : 'success'
		}));

		$(trs[3]).append($('<td/>', {
			text : (featureName[i].attributes.nm == null ? '' : featureName[i].attributes.nm)
		}));

		$(trs[4]).append($('<th/>', {
			text : '전화번호',
			class : 'success'
		}));

		$(trs[4]).append($('<td/>', {
			text : (featureName[i].attributes.hp == null ? '' : featureName[i].attributes.hp)
		}));
		table.append(colgroup);
		table.append(tbody);

		Gis.MapTools.openPopup(geometry.getBounds().getCenterLonLat(), table.prop('outerHTML')/*, new OpenLayers.Size(320, 240)*/);
	}
</script>