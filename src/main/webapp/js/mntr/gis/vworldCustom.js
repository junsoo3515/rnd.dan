Gis.stDefs = {
	"pradius" : {
		"0.5971642833709717" : 15,
		"1.1943285667419434" : 15,
		"2.388657133483887" : 15,
		"4.777314266967774" : 10,
		"9.554628533935547" : 10,
		"19.109257067871095" : 10,
		"38.21851413574219" : 5,
		"76.43702827148438" : 5
	},
	"yoff" : {
		"0.5971642833709717" : 12,
		"1.1943285667419434" : 12,
		"2.388657133483887" : 12,
		"4.777314266967774" : 10,
		"9.554628533935547" : 10,
		"19.109257067871095" : 10,
		"38.21851413574219" : 5,
		"76.43702827148438" : 5
	}
};

$(document).ready(function() {
	/* VWORLD 검색 사용시 체크가 하나만 되게 하는 기능 */
	$('input:checkbox[name="chkHot"]').on('click', function() {
		var $box = $(this);
		if ($box.is(':checked')) {
			var group = $('input:checkbox[name="chkHot"]');
			$(group).prop('checked', false);
			$box.prop('checked', true);
		}
		else {
			$box.prop('checked', false);
		}
	});
});

function setVWorldGrid(paginationInfo, list) {
	var selector = 'hot-vworld';
	$('#grid-' + selector).jqGrid({
		data : list,
		datatype : 'local',
		height : 'auto',
		width : 480,
		rowNum : 10,
		loadComplete : function(data) {
			if (data.total == 0 || data.rows == 0) {
				setGridNodata(selector);
				return false;
			}
			else {
				checkGridNodata(selector, data);
				pagenationVWorldReload(selector, paginationInfo);
			}
		},
		colNames : [
				'주소', '명칭', 'xpos', 'ypos'
		],
		colModel : [
				{
					name : 'JUSO',
					formatter : function(cellvalue, options, rowObject) {
						var juso = typeof rowObject.JUSO == 'undefined' ? '' : rowObject.JUSO;
						var j = typeof rowObject.juso == 'undefined' ? '' : rowObject.juso;
						var r = typeof rowObject.njuso == 'undefined' ? '' : '(' + rowObject.njuso + ')';
						return juso + j + r;
					},
					cellattr : function() {
						return 'style="width:70%;"'
					},
					width : 70
				}, {
					name : 'nameFull',
					cellattr : function() {
						return 'style="width:30%;"'
					},
					width : 30
				}, {
					name : 'xpos',
					hidden : true
				}, {
					name : 'ypos',
					hidden : true
				}
		],
		onSelectRow : function(row) {
			var rowData = $('#grid-' + selector).getRowData(row);

			if (_boundsWgs84.left > rowData.xpos && rowData.xpos > _boundsWgs84.right) {
				alert('해당 위치는 지도 영역 밖에 있습니다.');
				return false;
			}

			if (_boundsWgs84.bottom > rowData.ypos && rowData.ypos > _boundsWgs84.top) {
				alert('해당 위치는 지도 영역 밖에 있습니다.');
				return false;
			}

			var tm = WGS84toTM(rowData.xpos, rowData.ypos);
			previousFeatureselected = featureselected(tm, 'arrow', '', false, true, true);
		},
		cmTemplate : {
			sortable : false
		}
	});
}

/* 페이징 갱신 */
function pagenationVWorldReload(selector, paginationInfo) {
	var $paginate = $('#paginate-' + selector);
	$paginate.empty();
	$paginate.html($('<ul/>', {
		id : 'pagination-' + selector,
		class : 'paging'
	}));
	
	$pagination = $('#pagination-' + selector);
	$pagination.twbsPagination({
		startPage : Number(paginationInfo.currentPageNo),
		totalPages : Number(paginationInfo.totalPageCount),
		visiblePages : 4,
		onPageClick : function(event, page) {
			findAddr(page);
		},
		first : '&nbsp;&nbsp;',
		prev : '&nbsp;&nbsp;',
		next : '&nbsp;&nbsp;',
		last : '&nbsp;&nbsp;'
	});
}
