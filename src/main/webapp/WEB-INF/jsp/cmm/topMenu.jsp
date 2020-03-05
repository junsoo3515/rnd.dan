<%--
/**
 * 위쪽 메뉴를 관리
 * @author		대전도안 김정원
 * @version		1.00	2014-01-25
 * @since		JDK 1.7.0_45(x64)
 * @revision
 * /

/**
 * ----------------------------------------------------------
 * @Class Name : topMenu.jsp
 * @Description : 위쪽 메뉴
 * @Version : 1.0
 * Copyright (c) 2015 by KR.CO.UCP.WORK All rights reserved.
 * @Modification Information
 * ----------------------------------------------------------
 * DATA           AUTHOR   DESCRIPTION
 * ----------------------------------------------------------
 * 2015-01-22   김정원       최초작성
 * 
 * ----------------------------------------------------------
 * */
--%>
<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<c:set var="sysCd" 			value="${LoginVO.sysId}"/>
<c:set var="userNmKo" 			value="${LoginVO.userNmKo}"/>
<c:set var="authLvlNm" 			value="${LoginVO.authLvlNm}"/>

    <div class="topbar">
        <div class="logo">
            <h1>
            	<a href="<c:url value='/'/>wrks/main/main.do">
            		<c:choose>
            			<c:when test="${not empty sysCd}">
            				<img src="<c:url value='/'/>images/${sysCd}/logo.png" alt="로고 이미지">
            			</c:when>
            			<c:otherwise>
							<img src="<c:url value='/'/>images/logo.png" alt="위험시설물 보호지원 서비스">
            			</c:otherwise>
            		</c:choose>
            	</a>
            	</h1>
        </div>
        <div class="navbar">
            <ul>
                <!-- <li><a href="<c:url value='/'/>fclt/info.do?top=tp_building"" id="tp_building" class="ic_building">시설물</a></li>-->
				<c:forEach items="${topMenuList}" var="val"> 
					<c:choose>
						<c:when test="${param.top == val.PGM_MENU_ID && val.NEW_WDW_YN == 'Y' && val.PGM_MENU_VISIBLE_YN == 'Y'}">
							<li class="on"><a href="javascript:$.openMenuCenter('<c:url value='/'/>${val.PGM_URL}?top=${val.PGM_MENU_ID}&child=${val.CHILD_PGM_MENU_ID}','CAR_NO', ${val.NEW_WIN_WIDTH}, ${val.NEW_WIN_HEIGHT})" id="" class="ic_dumy" style="background-image: url(<c:url value='/'/>images/menu/${val.PGM_MENU_OFF_IMG_CRS})">${val.PGM_MENU_NM_KO}</a></li>
						</c:when>
						<c:when test="${param.top == val.PGM_MENU_ID && val.NEW_WDW_YN == 'N' && val.PGM_MENU_VISIBLE_YN == 'Y'}">
			                <li class="on"><a href="<c:url value='/'/>${val.PGM_URL}?top=${val.PGM_MENU_ID}&child=${val.CHILD_PGM_MENU_ID}" id="" class="ic_dumy" style="background-image: url(<c:url value='/'/>images/menu/${val.PGM_MENU_OFF_IMG_CRS})">${val.PGM_MENU_NM_KO}</a></li>
						</c:when>
						<c:when test="${val.NEW_WDW_YN == 'Y' && val.PGM_MENU_VISIBLE_YN == 'Y'}">
							<li><a href="javascript:$.openMenuCenter('<c:url value='/'/>${val.PGM_URL}?top=${val.PGM_MENU_ID}&child=${val.CHILD_PGM_MENU_ID}','CAR_NO', ${val.NEW_WIN_WIDTH}, ${val.NEW_WIN_HEIGHT})" id="" class="ic_dumy" style="background-image: url(<c:url value='/'/>images/menu/${val.PGM_MENU_OFF_IMG_CRS})">${val.PGM_MENU_NM_KO}</a></li>
						</c:when>
						<c:otherwise>
							<c:if test="${val.BBS_CHK == 'BBS' && val.PGM_MENU_VISIBLE_YN == 'Y'}">
							<li><a href="<c:url value='/'/>${val.PGM_URL}&top=${val.PGM_MENU_ID}&child=${val.CHILD_PGM_MENU_ID}" id="" class="ic_dumy" style="background-image: url(<c:url value='/'/>images/menu/${val.PGM_MENU_OFF_IMG_CRS})">${val.PGM_MENU_NM_KO}</a></li>
							</c:if>

							<c:if test="${val.BBS_CHK == 'NO' && val.PGM_MENU_VISIBLE_YN == 'Y'}">
							<li><a href="<c:url value='/'/>${val.PGM_URL}?top=${val.PGM_MENU_ID}&child=${val.CHILD_PGM_MENU_ID}" id="" class="ic_dumy" style="background-image: url(<c:url value='/'/>images/menu/${val.PGM_MENU_OFF_IMG_CRS})">${val.PGM_MENU_NM_KO}</a></li>
							</c:if>
						</c:otherwise>
					</c:choose>
			    </c:forEach>

                <!--
                <li><a href="<c:url value='/'/>lpr/carinfo/intcar/manage.do?top=tp_car" id="tp_car" class="ic_car">차량정보</a></li>
                <li><a href="<c:url value='/'/>lpr/his/hold/info.do?top=tp_document" id="tp_document" class="ic_document">이력조회</a></li>
                <li><a href="<c:url value='/'/>lpr/stats/day.do?top=tp_graph" id="tp_graph" class="ic_graph">통계</a></li>
                <li><a href="<c:url value='/'/>wrks/sstm/code/cmcd.do?top=tp_system" id="tp_system" class="ic_system">시스템</a></li>
                <li><a href="#"></a></li>
                -->
            </ul>
        </div>
        <div class="user">
           <a href="#"><span>${userNmKo} 님 (${authLvlNm})</span></a>
           <ul class="userMenu">
                <li><a href="<c:url value='/'/>wrks/lgn/myinfo.do"class="popwin" width="850" height="730">내정보보기</a></li>
                <li><a href="<c:url value='/'/>wrks/lgn/changepwd.do" class="popwin" width="850" height="380">비밀번호 수정</a></li>
                <li><a href="<c:url value='/'/>wrks/lgn/logout.do">로그아웃</a></li>
            </ul>
        </div>
    </div>
