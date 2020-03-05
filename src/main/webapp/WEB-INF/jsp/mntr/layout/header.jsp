<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/jsp/mntr/cmm/commonTags.jsp"%>

<link rel="stylesheet" type="text/css" href="<c:url value='/css/mntr/layout/header.css' />" />
<nav id="main-nav" class="navbar navbar-default navbar-fixed-top" role="navigation">
	<div class="container">
		<div class="navbar-header">
			<a class="navbar-brand" href="<c:url value='/dan/monitor/main.do' />" style="margin-top: -1px;">
				<c:choose>
           			<c:when test="${not empty sysCd}">
           				<img src="<c:url value='/'/>images/${sysCd}/logo.png" alt="로고 이미지">
           			</c:when>
           			<c:otherwise>
						<img src="<c:url value='/'/>images/logo.png" alt="${LoginVO.menuSysNm}">
           			</c:otherwise>
           		</c:choose>
			</a>
		</div>
		<ul class="nav navbar-nav navbar-right">
			<li class="dropdown">
				<a href="#" class="dropdown-toggle" data-toggle="dropdown">${LoginVO.nm}
					님 <%--(${LoginVO.authLvlNm})--%> <span class="caret"></span>
				</a>
				<ul class="dropdown-menu" role="menu">
					<li>
						<a href="#" onclick="javascript:logout();">로그아웃</a>
					</li>
				</ul>
			</li>
		</ul>
		<ul class="nav navbar-nav navbar-right">
			<li class="dropdown" id="dropdown-fclt">
				<a href="#" class="dropdown-toggle" data-toggle="dropdown">
					레이어<span class="caret"></span>
				</a>
				<!-- Layer Generator -->
			</li>
		</ul>
	</div>
</nav>
<script type="text/javascript" src="<c:url value='/js/socket/socket.io.js' />"></script>

<script>
	var mainMenu = '${common.mainMenu}';
	var subMenu = '${common.subMenu}';
	var dropdownMenu = '${common.dropdownMenu}';
	var lastMapLayer = '';

	if (typeof (Storage) !== "undefined") {
		lastMapLayer = localStorage.getItem('LastMapLayer');
	}
	else {
		alert("Web Storage를 지원하지 않는 브라우져입니다. 레이어 저장을 할 수 없습니다.");
	}

	$(function() {
		// Menu Active
		if (mainMenu && subMenu) {
			$('#main-menu .' + mainMenu).addClass('active');
			$('#sub-nav li.' + subMenu).addClass('active');
		}

		// Dropdown Menu Acitive
		if (dropdownMenu) {
			$('#sub-nav-2 ul.dropdown-menu li.' + dropdownMenu).addClass('active');
		}
		
		// 레이어 선택
		if ($('#dropdown-fclt').exists()) {
			$.ajax({
				type : 'POST',
				url : contextRoot + '/dan/monitor/selectDanFcltUsedTyAll.json',
				data : {  },
				success : function(result) {
					var data = result.list;

					var ul = $('<ul/>', {
						class : 'dropdown-menu',
						id : 'listLayer',
						role : 'menu'
					});
					ul.attr('aria-labelledby', '레이어');
					
					var divider = $('<li/>', {
						class : 'divider',
						role : 'presentation'
					});
					
					var danFcltKnd = [];
					// 카테고리 생성
					$.each(data, function(index, element) {
						if ($.inArray(element.jongCd, danFcltKnd) == -1) {
							danFcltKnd.push(element.jongCd);
							ul.append(
								$('<li/>',{
									role : 'presentation',
									class : 'dropdown-header',
									style : 'font-size: 16px; font-weight: bold; padding: 10px 0px 0px 0px;',
									html : '<span>위험시설물' + ' (' + element.jongCd	+ ') <button class="btn btn-primary btn-ucp btn-xs" onclick="showAllFclt();">ON</button> <button class="btn btn-primary btn-ucp btn-xs" onclick="hiddenAllFclt();">OFF</button></span>'
								})		
							);
							ul.append(
								$('<li/>',{
									role : 'presentation',
									class : 'item-fclt',
									id : element.jongCd
								})		
							);
						}
					});
					// 카테고리에 리스트 생성
					$.each(data, function(index, element) {
						var checked = 'checked="checked"';
						if (lastMapLayer != '' && lastMapLayer != null && lastMapLayer.indexOf(element.comCd) > -1) {
							checked = '';
						}

						var anchor = $('<a/>', {
							role : 'menuitem',
							tabindex : '-1',
							href : '#',
							style : 'width: 100%',
							html : '<input type="checkbox" ' + checked + ' value="' + element.comCd + '">'
							+ ' <img onerror="javascript:notFoundFcltIcon(this);" alt="시설물 아이콘" src="' + contextRoot + '/images/mntr/gis/danFclt/' + element.comCd
							+ '_0_0.png">' + '<span class="lbl"> ' + element.cdNm + ' </span>'
						});	
								
						var li = ul.find('li#' + element.jongCd + '.item-fclt');
							li.append(anchor);
					});

					ul.append(divider);

					$("#dropdown-fclt").append(ul);
					
				},
				error : function() {
					alert("레이어 종류를 가져오지 못했습니다.");
				}
			});
		}

		// 레이어 선택
		$('body').on('change', 'ul#listLayer.dropdown-menu li.item-fclt a input:checkbox', function() {
			if ($('#dropdown-fclt').exists()) {
				fcltLayerRefresh(configureDstrtCd, getUncheckdFcltLayer());
			}
		});
	});

	function logout() {
		location.replace(contextRoot + '/dan/login/logout.do');
	}
	
	function getUncheckdFcltLayer() {
		var checked = '';
		var size = $('ul#listLayer.dropdown-menu li.item-fclt input:not(:checked)').size();
		$('ul#listLayer.dropdown-menu li.item-fclt input:not(:checked)').each(function(index) {
			if (index == (size - 1)) {
				checked += "'" + $(this).val() + "'";
			}
			else {
				checked += "'" + $(this).val() + "'" + ',';
			}
		});

		if (typeof (Storage) !== "undefined") {
			localStorage.setItem('LastMapLayer', checked);
		}
		else {
			alert("Web Storage를 지원하지 않는 브라우져입니다. 레이어를 저장할 수 없습니다.");
		}
		return checked;
	}
	
	function notFoundFcltIcon(img) {
		$(img).prop('src', contextRoot + '/images/mntr/gis/fclt/icon_unknown.png');
	}	
	
	function showAllFclt() {
		$('ul#listLayer.dropdown-menu li.item-fclt input').each(function(index) {
			$(this).prop('checked', true);
		});
		if ($('#dropdown-ctrl').exists() || $('#dropdown-fclt').exists()) {
			fcltLayerRefresh(configureDstrtCd, getUncheckdFcltLayer());
		}
	}

	function hiddenAllFclt() {
		$('ul#listLayer.dropdown-menu li.item-fclt input').each(function(index) {
			$(this).prop('checked', false);
		});
		if ($('#dropdown-ctrl').exists() || $('#dropdown-fclt').exists()) {
			fcltLayerRefresh(configureDstrtCd, getUncheckdFcltLayer());
		}
	}

</script>