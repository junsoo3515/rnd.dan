$(function() {
	console.log('document ready.');
	/* 이벤트 목록 */
	$('#grid').jqGrid({
		url : contextRoot + '/mntr/pop119/mntrReqList.json',
		datatype : 'json',
		mtype : 'POST',
		height : 122,
		width : 370,
		rowNum : 9999,
		multiselect : true,
		loadComplete : function(data) {
			// pagenationReload(data);
			if (data.totalRows == 0) {
				setGridNodata();
			}
			else {
				if ($('#jqgrow-nodata').length > 0) {
					$('#jqgrow-nodata').empty();
				}
			}
		},
		colNames : [
				'발생번호', '종별', '위치', '영상요청'
		],
		colModel : [
				{
					name : 'evtOcrNo',
					sortable : false,
					align : 'center',
					classes : 'jqgrid_cursor_pointer',
					cellattr : function() {
						return 'style="width: 34%; padding: 5px 3px 5px 3px; font-weight: bold;"'
					},
					width : 34
				}, {
					name : 'evtDtl',
					sortable : false,
					align : 'left',
					classes : 'jqgrid_cursor_pointer',
					cellattr : function() {
						return 'style="width: 21%; padding: 5px 3px 5px 3px;"'
					},
					width : 21
				}, {
					name : 'evtPlace',
					sortable : false,
					align : 'left',
					classes : 'jqgrid_cursor_pointer',
					cellattr : function() {
						return 'style="width: 21%; padding: 5px 3px 5px 3px;"'
					},
					width : 21
				}, {
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
							onclick : 'javascript:requestMntr(\'' + rowObject.evtOcrNo + '\');',
							text : '요청'
						});

						return btn.prop('outerHTML');
					},
					width : 16
				}
		]
	});
	/* jqGrid Reload Interval 60Sec */
	setInterval(function() {
		reloadGrid(1);
	}, 1000 * 60);
});

/* WRKS 팝업 */
function openWrks() {
	window.open(contextRoot + '/wrks/main/main.do');
}

/* 영상요청 */
function requestMntr(evtOcrNoSel) {
	
	window.open(contextRoot + '/mntr/main/main.do?evtOcrNo=' + evtOcrNo, 'mntr');
}

/* 요청삭제 */
function deleteMntrReq(evtOcrNo) {
	$.ajax({
		method : 'POST',
		url : contextRoot + '/mntr/pop119/deleteMntrReq.json',
		data : {
			clmtOcrNo : evtOcrNo,
		},
		success : function(data, textStatus, jqXHR) {
			if (textStatus == 'success') {
				reloadGrid(1);
			}
			else {
				alert('에러발생 : ' + jqXHR.status + ' ' + jqXHR.statusText);
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {
			alert('에러발생 : ' + jqXHR.status + ' ' + jqXHR.statusText);
		}
	});
}

/* 요청삭제 */
function deleteAllMntrReq() {
	$.ajax({
		method : 'POST',
		url : contextRoot + '/mntr/pop119/deleteAllMntrReq.json',
		data : {},
		success : function(data, textStatus, jqXHR) {
			if (textStatus == 'success') {
				reloadGrid(1);
			}
			else {
				alert('에러발생 : ' + jqXHR.status + ' ' + jqXHR.statusText);
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {
			alert('에러발생 : ' + jqXHR.status + ' ' + jqXHR.statusText);
		}
	});
}

function deleteSelectedMntrReq() {
	var ids = $("#grid").getGridParam('selarrrow');

	if (ids.length == 0) {
		alert('선택된 ' + '발생번호가 없습니다.');
		return false;
	}
	else if (ids.length == 1) {
		var rowdata = $("#grid").getRowData(ids[0]);
		deleteMntrReq(rowdata.evtOcrNo);
	}
	else {
		var clmtOcrNo = '';

		$.each(ids, function(index, value) {
			var rowdata = $("#grid").getRowData(value);

			if (ids.length == (index + 1)) {
				clmtOcrNo += "'" + rowdata.evtOcrNo + "'"
			}
			else {
				clmtOcrNo += "'" + rowdata.evtOcrNo + "',"
			}
		});

		$.ajax({
			method : 'POST',
			url : contextRoot + '/mntr/pop119/deleteSelectedMntrReq.json',
			data : {
				clmtOcrNo : clmtOcrNo
			},
			success : function(data, textStatus, jqXHR) {
				if (textStatus == 'success') {
					reloadGrid(1);
				}
				else {
					alert('에러발생 : ' + jqXHR.status + ' ' + jqXHR.statusText);
				}
			},
			error : function(jqXHR, textStatus, errorThrown) {
				alert('에러발생 : ' + jqXHR.status + ' ' + jqXHR.statusText);
			}
		});
	}
}

/* 그리드 갱신 */
function reloadGrid(page) {
	$('#grid').setGridParam({
		rowNum : 9999,
		page : page,
		postData : {}
	}).trigger('reloadGrid');
}

/* 데이터 없음 */
function setGridNodata() {
	var td = $('<td/>', {
		role : 'gridcell',
		style : 'text-align:center;width: 100%; padding: 5px 3px 5px 3px;',
		class : 'jqgrid_cursor_pointer',
		rowspan : '0',
		text : '데이터가 없습니다.'
	})
	var tr = $('<tr/>', {
		role : 'row',
		id : 'jqgrow-nodata',
		tabindex : '-1',
		class : 'ui-widget-content jqgrow ui-row-ltr'
	});
	var tbody = $('<tbody/>');
	tr.append(td);
	tbody.append(tr);
	$('#grid').html(tbody);
}