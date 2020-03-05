var articleRight, articleBottom, articleLeft;
var articleRightOrigin, articleBottomOrigin, articleLeftOrigin;

function div(divId, divLc, divLcSrlNo) {
	this.divId = divId;
	this.divLc = divLc;
	this.divLcSrlNo = divLcSrlNo;
}
$(function() {
	collapse('left', false);
	collapse('right', false);
	collapse('bottom', true);

	$('div[id^="toggle"]').mouseover(function() {
		var url = $(this).css('background-image');
		var res = url.replace('.png', '_hover.png');
		$(this).css('background-image', res);
		$(this).css('background-color', '#bdc3c7');
	});

	$('div[id^="toggle"]').mouseout(function() {
		var url = $(this).css('background-image');
		var res = url.replace('_hover.png', '.png');
		$(this).css('background-image', res);
		$(this).css('background-color', '#ecf0f1');
	});

	$('#toggleLeft').click(function() {
		var isVisible = $('#left').is(':visible');
		collapse('left', isVisible);
		if (typeof _map != 'undefined') {
			redraw();
		}
	});

	$('#toggleRight').click(function() {
		var isVisible = $('#right').is(':visible');
		collapse('right', isVisible);
		if (typeof _map != 'undefined') {
			redraw();
		}
	});

	$('#toggleBottom').click(function() {
		var isVisible = $('#bottom').is(':visible');
		collapse('bottom', isVisible);
		if (typeof _map != 'undefined') {
			redraw();
		}
	});
});

/*
 * Left, Right, Bottom 영역 펴고 접기
 */
function collapse(position, hidden) {
	var toogleUp = 'url(<c:url value="/images/mntr/layout/toggle_up.png" />)';
	var toogleDown = 'url(<c:url value="/images/mntr/layout/toggle_down.png" />)';
	var toogleLeft = 'url(<c:url value="/images/mntr/layout/toggle_left.png" />)';
	var toogleRight = 'url(<c:url value="/images/mntr/layout/toggle_right.png" />)';
	var leftSize = Number(configureMntrViewLeft);
	var rightSize = Number(configureMntrViewRight);
	var toggleBarSize = 10;
	var hideBottomSize = 4;
	var showBottomSize = Number(configureMntrViewBottom);
	if (position == 'left') {
		if (hidden) {
			$('#left').hide();
			$('#toggleLeft').css('left', 0);
			$('#toggleLeft').css('background-image', toogleRight);
			$('#body').css('left', toggleBarSize);
		}
		else {
			$('#left').show();
			$('#toggleLeft').css('left', leftSize - toggleBarSize);
			$('#toggleLeft').css('background-image', toogleLeft);
			$('#body').css('left', leftSize);
		}
	}
	else if (position == 'right') {
		if (hidden) {
			$('#right').hide();
			$('#toggleRight').css('right', 0);
			$('#toggleRight').css('background-image', toogleLeft);
			$('#body').css('right', toggleBarSize);
		}
		else {
			$('#right').show();
			$('#toggleRight').css('right', rightSize - toggleBarSize);
			$('#toggleRight').css('background-image', toogleRight);
			$('#body').css('right', rightSize);
		}
	}
	else if (position == 'bottom') {
		if (hidden) {
			$('#bottom').hide();
			$('#toggleBottom').css('bottom', hideBottomSize);
			$('#toggleBottom').css('background-image', toogleUp);
			$('#left').css('bottom', hideBottomSize);
			$('#right').css('bottom', hideBottomSize);
			$('#body').css('bottom', hideBottomSize);
			$('#toggleLeft').css('bottom', hideBottomSize);
			$('#toggleRight').css('bottom', hideBottomSize);
			$('#map').css('bottom', 10);
		}
		else {
			$('#bottom').show();
			$('#toggleBottom').css('bottom', showBottomSize);
			$('#toggleBottom').css('background-image', toogleDown);
			$('#left').css('bottom', showBottomSize);
			$('#right').css('bottom', showBottomSize);
			$('#body').css('bottom', showBottomSize);
			$('#toggleLeft').css('bottom', showBottomSize);
			$('#toggleRight').css('bottom', showBottomSize);
			$('#map').css('bottom', 0);
		}
	}
}

/* 이벤트 상황 DIV 배치 */
function doDivSituation(evtId, evtOcrNo) {
//	console.log('*****************  doDivSituation *************');
	clearDiv();
//	console.log('*****************  clearDiv after *************');
	$.ajax({
		type : 'POST',
		url : contextRoot + '/mntr/divSituationPosition.json',
		async : true,
		data : {
			evtId : evtId
		},
		success : function(data) {
			var rows = data.rows;

			if (rows.length != 0) {
				for (var i = 0; i < rows.length; i++) {
					appendDiv(rows[i], evtOcrNo, '');
				}
				collapse('right', false);
				if(configureSysCd != 'DUC') {
					collapse('bottom', false);
				}
			}
			else {
				appendDefaultEventDiv(evtOcrNo);
				collapse('right', false);
				if(configureSysCd != 'DUC') {
					collapse('bottom', false);
				}
			}
			if (typeof _map != 'undefined') {
				redraw();
			}
		},
		error : function() {
			alert('이벤트 상황 DIV를 가져오지 못했습니다.');
		}
	});
}

/* 평시 DIV 배치 */
function doDivNormal(mntrTyId, feature, isCastnet) {
	clearDiv();

	var attr, fcltId = '';
	var cntB = 0;
	var cntR = 0;
	var cntL = 0;

	if (feature != null) {
		if (typeof feature == 'string') {
			fcltId = feature;
		}
		else if (typeof feature == 'object') {
			attr = feature.attributes;
			fcltId = attr.fcltId;
		}
	}

	$.ajax({
		type : 'POST',
		url : contextRoot + '/mntr/divNormalPosition.json',
		async : true,
		data : {
			mntrTyId : mntrTyId
		},
		success : function(data) {
			clearDiv();

			var rows = data.rows;

			if (rows.length != 0) {
				for (var i = 0; i < rows.length; i++) {
					appendDiv(rows[i], '', fcltId);
					if (rows[i].divLc == 'B') {
						cntB++;
					}
					else if (rows[i].divLc == 'R') {
						cntR++;
					}
					else if (rows[i].divLc == 'L') {
						cntL++;
					}
				}
				if (cntR == 0) {
					// collapse('right', true);
				}
				else {
					// collapse('right', false);
				}
				if (cntB == 0) {
					// collapse('bottom', true);
				}
				else {
					// collapse('bottom', false);
				}
			}
			else {
				appendDefaultDiv();
			}

			if (typeof _map != 'undefined') {
				redraw();
			}
		},
		error : function() {
			alert('평시모니터링 DIV를 가져오지 못했습니다.');
		}
	});
}


/* FIX DIV 추가 */
function appendFixDiv(row, evtOcrNo, fcltId) {
	var divLcSrlNo = row.divLcSrlNo;
	var divId = row.divId;
	var divLc = row.divLc;
	var position = 'left';

	$.ajax({
		type : 'POST',
		url : contextRoot + '/mntr/viewDivision.do',
		data : {
			divId : divId,
			evtOcrNo : evtOcrNo,
			fcltId : fcltId
		},
		async : true,
		success : function(data) {
			var div = $('#article-' + position + ' div.colfix')[divLcSrlNo];
			$(div).append(data);
		},
		error : function() {
			alert('appendDiv를 가져오지 못했습니다.1');
		}
	});
}
/* fixDiv DIV */
function doFixDiv(evtOcrNo) {
//	console.log('**** doFixDiv ==== configureSysCd:' + configureSysCd);
	$('#article-left div.colfix').empty();

	if(configureSysCd == '112' || configureSysCd == 'WPS')
		appendFixDiv(new div('DIV-POP112', 'L', 0), evtOcrNo, '');
	else
		appendFixDiv(new div('DIV-POP119', 'L', 0), evtOcrNo, '');
}

/* DIV 추가 */
function appendDiv(row, evtOcrNo, fcltId) {
	var divLcSrlNo = row.divLcSrlNo;
	var divId = row.divId;
	var divLc = row.divLc;
	var position = '';
	if (divLc == 'B') {
		position = 'bottom';
	}
	else if (divLc == 'R') {
		position = 'right';
	}
	else if (divLc == 'L') {
		position = 'left';
	}

	$.ajax({
		type : 'POST',
		url : contextRoot + '/mntr/viewDivision.do',
		data : {
			divId : divId,
			evtOcrNo : evtOcrNo,
			fcltId : fcltId
		},
		async : true,
		success : function(data) {
			var div = $('#article-' + position + ' div.col')[divLcSrlNo];
			$(div).append(data);
		},
		error : function() {
			alert('appendDiv를 가져오지 못했습니다.2');
		}
	});
}

/* EVENT DEFAULT DIV */
function appendDefaultDiv() {
	clearDiv();
	
	if(configureSysCd == '112' || configureSysCd == 'WPS') appendDiv(new div('DIV-POP112', 'L', 0), '', '');
	else appendDiv(new div('DIV-POP119', 'L', 0), '', '');
	
	appendDiv(new div('DIV-CARLC', 'L', 1), '', '');
}

/* EVENT DEFAULT DIV */
function appendDefaultEventDiv(evtOcrNo) {
	clearDiv();
	
	if(configureSysCd == '112' || configureSysCd == 'WPS') appendDiv(new div('DIV-POP112', 'L', 0), '', '');
	else appendDiv(new div('DIV-POP119', 'L', 0), '', '');
	
	appendDiv(new div('DIV-GNRCASTNET', 'L', 1), '', '');
	appendDiv(new div('DIV-PORTAL', 'L', 2), '', '');
	
	appendDiv(new div('DIV-VMS', 'B', 0), '', '');
	if(configureUcpId == 'GYC')	appendDiv(new div('DIV-NVR', 'B', 1), '', '');
	
	appendDiv(new div('DIV-CASTNET', 'R', 0), '', '');
	appendDiv(new div('DIV-CARLC', 'R', 1), evtOcrNo, '');
	appendDiv(new div('DIV-NEAR', 'R', 2), evtOcrNo, '');
}

if(configureSysCd != 'DAN') {
	/* DIV 초기화 */
	function clearDiv() {
//	console.log('*****************  clearDiv *************');
		$('#article-right div.col').empty();
		$('#article-bottom div.col').empty();
		$('#article-left div.col').empty();
	}

	/* DIV 영역 초기화 - 플래그 값으로 Base 목록을 불러올 수 있슴. */
	function clearDiv2(flag) {
//	console.log('*****************  clearDiv2 flag *************');
		$('small.evtNm').prop('id', '');
		$('small.evtNm').text('이벤트 상황이나 시설물 유형을 선택하세요.');

		$('ol.article-base').empty();

		$('ol.article-right').empty();
		$('#article-right div.col').empty();

		$('#article-bottom div.col').empty();
		$('ol.article-bottom').empty();

		$('ol.article-left').empty();
		$('#article-left div.col').empty();

		$('#btnSaveDivPosition').prop('disabled', true);
		$('#btnDeleteDivPosition').prop('disabled', true);
		$('#btnResetDivPosition').prop('disabled', true);
		$('#btnCopyDivPosition').prop('disabled', true);

		if (flag) {
			reloadBaseDiv();
		}
	}
}

/* 버튼 활성화 */
function enableButtons() {
	$('#btnSaveDivPosition').prop('disabled', false);
	$('#btnDeleteDivPosition').prop('disabled', false);
	$('#btnResetDivPosition').prop('disabled', false);
}

/* 시설물 용도별 유형 갱신 */
function reloadFcltUsedTy() {
	$('#ulFcltUsedTy').empty();
	$.ajax({
		type : 'POST',
		url : contextRoot + '/mntr/cmm/selectFcltUsedTyAll.json',
		success : function(result) {
			var data = result.list;
			var divider = $('<li/>', {
				role : 'presentation',
				class : 'divider',
				style : 'margin: 0px;'
			})

			var remark = $('<li/>', {
				role : 'presentation',
				class : 'dropdown-header'
			});

			remark.append($('<span/>', {
				class : 'lbl existDiv',
				text : '설정됨'
			}));
			remark.append(' | ');
			remark.append($('<span/>', {
				class : 'lbl',
				text : '설정안됨'
			}));
			remark.append(' | ');
			remark.append($('<a/>', {
				href : 'javascript:doDivNormalPosition("FCLT-DEFAULT", "기본설정");',
				text : '기본설정'
			}));

			var fcltKnd = [];
			// 카테고리 생성

			$('#ulFcltUsedTy').append(remark);
			$('#ulFcltUsedTy').append(divider);
			$.each(data, function(index, element) {
				if ($.inArray(element.fcltKndCd, fcltKnd) == -1) {
					fcltKnd.push(element.fcltKndCd);
					$('#ulFcltUsedTy').append($('<li/>', {
						role : 'presentation',
						class : 'dropdown-header',
						text : element.fcltKndNm + '(' + element.fcltKndCd + ')'
					}));

					$('#ulFcltUsedTy').append($('<li/>', {
						role : 'presentation',
						class : 'item-fclt',
						id : element.fcltKndCd
					}));
					$('#ulFcltUsedTy').append(divider);
				}
			});
			// 카테고리에 리스트 생성
			$.each(data, function(index, element) {
				var existDiv = '';
				if (element.existDiv == "Y") {
					existDiv = ' existDiv';
				}

				var anchor = $('<a/>', {
					role : 'menuitem',
					tabindex : '-1',
					href : 'javascript:doDivNormalPosition("' + element.fcltUsedTyCd + '", "' + element.fcltUsedTyNm + '");'
				});
				anchor.append($('<span/>', {
					class : 'lbl' + existDiv,
					text : element.fcltUsedTyNm
				}));

				var li = $('#ulFcltUsedTy').find('li#' + element.fcltKndCd + '.item-fclt');
				li.append(anchor);
			});
		},
		error : function() {
			alert("시설물 유형을 가져오지 못했습니다.");
		}
	});
}

/* DIV BASE 영역 갱신 */
function reloadBaseDiv() {
	$.ajax({
		type : 'POST',
		url : contextRoot + '/mntr/divListData.json',
		async : true,
		beforeSend : function() {
			$('ol#divList').empty();
		},
		success : function(data) {
			var rows = data.rows;
			for (var i = 0; i < rows.length; i++) {
				var li = '<li id="' + rows[i].divId + '"><i class="glyphicon glyphicon-move"></i> <span class="divLabel" href="#">' + rows[i].divTyCd + '</span> '
						+ rows[i].divTitle + '</li>';
				$('ol#divList').append(li);
			}
		},
		error : function() {
			alert('reloadBaseDiv를 가져오지 못했습니다.');
		},
		complete : function() {
			$('ol.article-right li').each(function(index) {
				var target = $(this).prop('id');
				$('#divList li#' + target).remove();
			});
			$('ol.article-bottom li').each(function(index) {
				var target = $(this).prop('id');
				$('#divList li#' + target).remove();
			});
			$('ol.article-left li').each(function(index) {
				var target = $(this).prop('id');
				$('#divList li#' + target).remove();
			});
		}
	});
}

/* DIV 영역 갱신 */
function reloadDiv() {
	$('#article-right div.col').empty();
	$('#article-bottom div.col').empty();
	$('#article-left div.col').empty();
	$('ol.article-right li').each(function(index) {
		$.ajax({
			type : 'POST',
			url : contextRoot + '/mntr/viewDivision.do',
			data : {
				divId : $(this).prop('id')
			},
			async : true,
			success : function(data) {
				var div = $('#article-right div.col')[index];
				$(div).append(data);
			},
			error : function() {
				alert('reloadDiv-right를 가져오지 못했습니다.');
			}
		});
	});

	$('ol.article-bottom li').each(function(index) {
		$.ajax({
			type : 'POST',
			url : contextRoot + '/mntr/viewDivision.do',
			data : {
				divId : $(this).prop('id')
			},
			async : true,
			success : function(data) {
				var div = $('#article-bottom div.col')[index];
				$(div).append(data);
			},
			error : function() {
				alert('reloadDiv-bottom를 가져오지 못했습니다.');
			}
		});
	});

	$('ol.article-left li').each(function(index) {
		$.ajax({
			type : 'POST',
			url : contextRoot + '/mntr/viewDivision.do',
			data : {
				divId : $(this).prop('id')
			},
			async : true,
			success : function(data) {
				var div = $('#article-left div.col')[index];
				$(div).append(data);
			},
			error : function() {
				alert('reloadDiv-left를 가져오지 못했습니다.');
			}
		});
	});

	var sizeRight = $('ol.article-right li').length;
	var sizeBottom = $('ol.article-bottom li').length;
	var sizeLeft = $('ol.article-left li').length;

	if (sizeRight == 0 && sizeBottom == 0 && sizeLeft == 0) {
		$('#btnCopyDivPosition').prop('disabled', true);
	}
	else {
		$('#btnCopyDivPosition').prop('disabled', false);
	}
}

/* 이벤트 DIV 전개 */
function doDivSituationPosition(id, text) {
	clearDiv2(true);

	$('small.evtNm').prop('id', id);

	var lbl = '<span class="divLabel" id="lblEvent" disabled="disabled">이벤트</span>';

	$('small.evtNm').html(text + ' ' + lbl);
	$('#evtTitle').val('');
	
	$.ajax({
		type : 'POST',
		url : contextRoot + '/mntr/divSituationPosition.json',
		async : true,
		data : {
			evtId : $('small.evtNm').prop('id')
		},
		success : function(data) {
			var rows = data.rows;
			for (var i = 0; i < rows.length; i++) {
				var li = '<li id="' + rows[i].divId + '"><i class="glyphicon glyphicon-move"></i> <span class="divLabel" href="#">' + rows[i].divTyCd + '</span> '
						+ rows[i].divTitle + '</li>';
				var index = rows[i].divLcSrlNo;
				if (rows[i].divLc == 'N') {

				}
				else if (rows[i].divLc == 'R') {
					$('ol.article-right').append(li);
				}
				else if (rows[i].divLc == 'B') {
					$('ol.article-bottom').append(li);
				}
				else if (rows[i].divLc == 'L') {
					$('ol.article-left').append(li);
				}
			}

			reloadDiv();
		},
		error : function() {
			alert('이벤트 상황 DIV를 가져오지 못했습니다.');
		},
		complete : function() {
			$('ol.article-right li').each(function(index) {
				var target = $(this).prop('id');
				$('#divList li#' + target).remove();
			});
			$('ol.article-bottom li').each(function(index) {
				var target = $(this).prop('id');
				$('#divList li#' + target).remove();
			});
			$('ol.article-left li').each(function(index) {
				var target = $(this).prop('id');
				$('#divList li#' + target).remove();
			});
			articleRightOrigin = $('ol.article-right li').clone();
			articleBottomOrigin = $('ol.article-bottom li').clone();
			articleLeftOrigin = $('ol.article-left li').clone();
		}
	});
}

/* 평시 DIV 전개 */
function doDivNormalPosition(id, text) {
	clearDiv2(true);

	var lbl = '<span class="divLabel" id="lblFcltUsedTy">평시</span>';
	$('#evtTitle').val('');
	$('small.evtNm').html(text + ' ' + lbl);
	$('small.evtNm').prop('id', id);

	$.ajax({
		type : 'POST',
		url : contextRoot + '/mntr/divNormalPosition.json',
		async : true,
		data : {
			mntrTyId : $('small.evtNm').prop('id')
		},
		success : function(data) {
			var rows = data.rows;
			for (var i = 0; i < rows.length; i++) {
				var li = '<li id="' + rows[i].divId + '"><i class="glyphicon glyphicon-move"></i> <span class="divLabel" href="#">' + rows[i].divTyCd + '</span> '
						+ rows[i].divTitle + '</li>';
				var index = rows[i].divLcSrlNo;
				if (rows[i].divLc == 'N') {

				}
				else if (rows[i].divLc == 'R') {
					$('ol.article-right').append(li);
				}
				else if (rows[i].divLc == 'B') {
					$('ol.article-bottom').append(li);
				}
				else if (rows[i].divLc == 'L') {
					$('ol.article-left').append(li);
				}
			}

			reloadDiv();
			enableButtons();
		},
		error : function() {
			alert('평시모니터링 DIV를 가져오지 못했습니다.');
		},
		complete : function() {
			$('ol.article-right li').each(function(index) {
				var target = $(this).prop('id');
				$('#divList li#' + target).remove();
			});
			$('ol.article-bottom li').each(function(index) {
				var target = $(this).prop('id');
				$('#divList li#' + target).remove();
			});
			$('ol.article-left li').each(function(index) {
				var target = $(this).prop('id');
				$('#divList li#' + target).remove();
			});
			articleRightOrigin = $('ol.article-right li').clone();
			articleBottomOrigin = $('ol.article-bottom li').clone();
			articleLeftOrigin = $('ol.article-left li').clone();
		}
	});
}

/* DIV 영역 저장 */
function saveDivPosition() {
	var result = true;
	var evtId = $('small.evtNm').prop('id');
	if (evtId == '') {
		alert('선택된 이벤트가 없습니다.');
		return false;
	}
	var flag = confirm($('small.evtNm').text() + ' 저장 하시겠습까 ?');
	if (flag) {
		var url = '';
		if ($('#lblEvent').exists()) {
			url = '/mntr/saveDivSituationPosition.json';
		}
		else {
			url = '/mntr/saveDivNormalPosition.json';
		}

		$('ol.article-right li').each(function(index) {
			$.ajax({
				type : 'POST',
				url : contextRoot + url,
				data : {
					divId : $(this).prop('id'),
					evtId : evtId,
					divLc : 'R',
					divLcSrlNo : index
				},
				async : true,
				success : function(data) {
					if (data.result = !'1') {
						result = false;
					}
				},
				error : function() {
					alert('saveDivPosition-right DIV를 가져오지 못했습니다.');
				}
			});
		});
		$('ol.article-base li').each(function(index) {
			$.ajax({
				type : 'POST',
				url : contextRoot + url,
				data : {
					divId : $(this).prop('id'),
					evtId : evtId,
					divLc : 'N',
					divLcSrlNo : 0
				},
				async : true,
				success : function(data) {
					if (data.result = !'1') {
						result = false;
					}
				},
				error : function() {
					alert('saveDivPosition-base DIV를 가져오지 못했습니다.');
				}
			});
		});
		$('ol.article-bottom li').each(function(index) {
			$.ajax({
				type : 'POST',
				url : contextRoot + url,
				data : {
					divId : $(this).prop('id'),
					evtId : evtId,
					divLc : 'B',
					divLcSrlNo : index
				},
				async : true,
				success : function(data) {
					if (data.result = !'1') {
						result = false;
					}
				},
				error : function() {
					alert('saveDivPosition-bottom DIV를 가져오지 못했습니다.');
				}
			});
		});
		$('ol.article-left li').each(function(index) {
			$.ajax({
				type : 'POST',
				url : contextRoot + url,
				data : {
					divId : $(this).prop('id'),
					evtId : evtId,
					divLc : 'L',
					divLcSrlNo : index
				},
				async : true,
				success : function(data) {
					if (data.result = !'1') {
						result = false;
					}
				},
				error : function() {
					alert('saveDivPosition-left DIV를 가져오지 못했습니다.');
				}
			});
		});

		if (result) {
			alert('저장되었습니다.');
		}
		else {
			alert('저장에 실패했습니다.');
		}

		if ($('#lblEvent').exists()) {
			gridReload('div', 1, {});
		}
		else if ($('#lblFcltUsedTy').exists()) {
			reloadFcltUsedTy();
		}
	}
}

/* DIV 원래대로 */
function resetDivPosition() {
	$('ol.article-right').empty();
	$('ol.article-bottom').empty();
	$('ol.article-left').empty();
	$('#article-right div.col').empty();
	$('#article-bottom div.col').empty();
	$('#article-left div.col').empty();

	$('ol.article-right').append(articleRightOrigin);
	$('ol.article-bottom').append(articleBottomOrigin);
	$('ol.article-left').append(articleLeftOrigin);

	reloadBaseDiv();
	reloadDiv();
}

/* DIV 배치 복사 */
function copyDivPosition() {
	var yn = confirm('현재 DIV 배치를 복사하시겠습니까?');
	if (yn) {
		articleRight = $('ol.article-right li').clone();
		articleBottom = $('ol.article-bottom li').clone();
		articleLeft = $('ol.article-left li').clone();
	}

	$('#btnPasteDivPosition').prop('disabled', false);
}

/* DIV 배치 붙여넣기 */
function pasteDivPosition() {
	var yn = confirm('저장된 DIV 배치를 붙여넣겠습니까?');
	if (yn) {
		$('ol.article-right').empty();
		$('ol.article-bottom').empty();
		$('ol.article-left').empty();
		$('#article-right div.col').empty();
		$('#article-bottom div.col').empty();
		$('#article-left div.col').empty();

		$('ol.article-right').append(articleRight);
		$('ol.article-bottom').append(articleBottom);
		$('ol.article-left').append(articleLeft);

		reloadBaseDiv();
		reloadDiv();
	}
}
