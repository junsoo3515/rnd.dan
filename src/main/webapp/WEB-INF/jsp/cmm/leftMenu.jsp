<%--
/**
 * 왼쪽메뉴를 관리
 * @author		대전도안 김정원
 * @version		1.00	2014-01-25
 * @since		JDK 1.7.0_45(x64)
 * @revision
 * /

/**
 * ----------------------------------------------------------
 * @Class Name : leftMenu.jsp
 * @Description : 왼쪽메뉴
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
<%@page import="java.util.Map"%>
<%@page import="java.util.List"%>
<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>

        <div class="leftMenu">
			<ul>
        <%
        String left	= request.getParameter("left");
        if(left == null){ 
        	left = "";
        }
        List<Map<String, String>> leftMenuList 	= (List<Map<String, String>>) request.getAttribute("leftMenuList");
        int leftCnt = 0;
        for(int i = 0; i < leftMenuList.size(); i++) {
            Map<String, String> leftMenuMap = leftMenuList.get(i);

            String pos 			= "";
            String pgmMenuId 	= leftMenuMap.get("PGM_MENU_ID");
            String prntPgmId 	= leftMenuMap.get("PRNT_PGM_MENU_ID");
            String lvl 			= leftMenuMap.get("LVL");
            String pgmMenuVisibleYn = leftMenuMap.get("PGM_MENU_VISIBLE_YN");
            String newWdwYn = leftMenuMap.get("NEW_WDW_YN");
            String newWinWidth =  leftMenuMap.get("NEW_WIN_WIDTH");
            String newWinHeight = leftMenuMap.get("NEW_WIN_HEIGHT");
            
            
            
            boolean pgmMenuVisibleYnTag = false;
            boolean bbsOK       = false;
            int pgmId           = Integer.parseInt(leftMenuMap.get("PGM_ID"));

            if(pgmMenuVisibleYn.equals("Y")){
            	pgmMenuVisibleYnTag = true;
            }else{
            	pgmMenuVisibleYnTag = false;
            }
            
            /* 
            if ( pgmId > 14100 && pgmId < 15000 ) {
            	bbsOK = true;
            }
             */
			String url = "";
			url = leftMenuMap.get("PGM_URL");
			if(url.indexOf("=BBS_") > 0){
				bbsOK = true;
			}
			            
            
            if(i == 0 && lvl.equals("2") && pgmMenuVisibleYnTag) {
            	if(left.equals("") || left.equals(pgmMenuId)) {
        %>
			                <li><a href="" id="" class="" style="background: url(<c:url value='/'/>images/menu/<%=leftMenuMap.get("PGM_MENU_ON_IMG_CRS")%>) no-repeat left top;" on-image="<c:url value='/'/>images/menu/<%=leftMenuMap.get("PGM_MENU_ON_IMG_CRS")%>" off-image="<c:url value='/'/>images/menu/<%=leftMenuMap.get("PGM_MENU_OFF_IMG_CRS")%>"><%=leftMenuMap.get("PGM_MENU_NM_KO")%></a>
			                    <ul>
		<%		} else { %>
			                <li><a href="" id="" class="" style="background: url(<c:url value='/'/>images/menu/<%=leftMenuMap.get("PGM_MENU_OFF_IMG_CRS")%>) no-repeat left top;" on-image="<c:url value='/'/>images/menu/<%=leftMenuMap.get("PGM_MENU_ON_IMG_CRS")%>" off-image="<c:url value='/'/>images/menu/<%=leftMenuMap.get("PGM_MENU_OFF_IMG_CRS")%>"><%=leftMenuMap.get("PGM_MENU_NM_KO")%></a>
			                    <ul>
	    <%
				}
            }
            else if(i != 0 && lvl.equals("2") && pgmMenuVisibleYnTag) {
            	if(left.equals(pgmMenuId)) {
	    %>
			                </ul></li>
							<li><a href="" id="" class="" style="background: url(<c:url value='/'/>images/menu/<%=leftMenuMap.get("PGM_MENU_ON_IMG_CRS")%>) no-repeat left top;" on-image="<c:url value='/'/>images/menu/<%=leftMenuMap.get("PGM_MENU_ON_IMG_CRS")%>" off-image="<c:url value='/'/>images/menu/<%=leftMenuMap.get("PGM_MENU_OFF_IMG_CRS")%>"><%=leftMenuMap.get("PGM_MENU_NM_KO")%></a>
			                    <ul>
		<%		} else { %>
			                </ul>
			                <li><a href="" id="" class="" style="background: url(<c:url value='/'/>images/menu/<%=leftMenuMap.get("PGM_MENU_OFF_IMG_CRS")%>) no-repeat left top;" on-image="<c:url value='/'/>images/menu/<%=leftMenuMap.get("PGM_MENU_ON_IMG_CRS")%>" off-image="<c:url value='/'/>images/menu/<%=leftMenuMap.get("PGM_MENU_OFF_IMG_CRS")%>"><%=leftMenuMap.get("PGM_MENU_NM_KO")%></a>
			                    <ul>
		<%
				}
            }
           
            if(lvl.equals("3") && pgmMenuVisibleYnTag)
            {
            	if(left.equals(pgmMenuId)) {
            		pos = "user-select";
            	} else {
            		pos = "";
            	}
				if ( bbsOK ) {
					
					if (newWdwYn.equals("Y")){
						%>
						<li class="<%=pos %>"><a href="javascript:$.openMenuCenter('<c:url value='/'/><%=leftMenuMap.get("PGM_URL")%>&top=${param.top}&left=<%=pgmMenuId%>','<%=leftMenuMap.get("PGM_MENU_NM_KO")%>', <%=newWinWidth%>, <%=newWinHeight%>)"><%=leftMenuMap.get("PGM_MENU_NM_KO")%></a></li>
						<%						
					}else{
						%>
						<li class="<%=pos %>"><a href="<c:url value='/'/><%=leftMenuMap.get("PGM_URL")%>&top=${param.top}&left=<%=pgmMenuId%>"><%=leftMenuMap.get("PGM_MENU_NM_KO")%></a></li>
						<%						
					}

				} else {
					
					if (newWdwYn.equals("Y")){
						%>
						<li class="<%=pos %>"><a href="javascript:$.openMenuCenter('<c:url value='/'/><%=leftMenuMap.get("PGM_URL")%>?top=${param.top}&left=<%=pgmMenuId%>','<%=leftMenuMap.get("PGM_MENU_NM_KO")%>',<%=newWinWidth%>, <%=newWinHeight%>)"><%=leftMenuMap.get("PGM_MENU_NM_KO")%></a></li>
						<%
						
					}else{
						%>
						<li class="<%=pos %>"><a href="<c:url value='/'/><%=leftMenuMap.get("PGM_URL")%>?top=${param.top}&left=<%=pgmMenuId%>"><%=leftMenuMap.get("PGM_MENU_NM_KO")%></a></li>
						<%
						
					}					
					
            	}
            }
        }
	    %>    
	    		</ul>
	    		</li>
	        </ul>
        <!--
		<c:choose>
			<c:when test="${param.top == 'tp_car'}">
	            <ul>
	                <li><a href="" id="" class="ic_code">관심차량</a>
	                    <ul>
	                        <li><a href="<c:url value='/'/>lpr/carinfo/intcar/manage.do?top=${param.top}&left=0">관심차량관리</a></li>
	                    </ul>
	                </li>
	                <li><a href="" id="" class="ic_group">체납자료수신</a>
	                    <ul>
	                        <li><a href="<c:url value='/'/>lpr/carinfo/npym/recv.do?top=${param.top}&left=1">파일수신현황</a></li>
	                        <li><a href="<c:url value='/'/>lpr/carinfo/npym/info.do?top=${param.top}&left=1">체납자료현황</a></li>
	                    </ul>
	                </li>
	            </ul>
			</c:when>
			<c:when test="${param.top == 'tp_document'}">
	            <ul>
	                <li><a href="" id="" class="ic_code">영치이력</a>
	                    <ul>
	                        <li><a href="<c:url value='/'/>lpr/his/hold/info.do?top=${param.top}&left=0">발생및영치이력</a></li>
	                    </ul>
	                </li>
	                <li><a href="" id="" class="ic_group">발생이력</a>
	                    <ul>
	                        <li><a href="<c:url value='/'/>lpr/his/hisvw/evnt.do?top=${param.top}&left=1">체납차량발생이력</a></li>
	                        <li><a href="<c:url value='/'/>lpr/his/hisvw/recognize.do?top=${param.top}&left=1">체납번호인식이력</a></li>
	                        <li><a href="<c:url value='/'/>lpr/his/hisvw/pushcarinfo.do?top=${param.top}&left=1">차량번호별푸쉬이력</a></li>
	                        <li><a href="<c:url value='/'/>lpr/his/hisvw/pushmblinfo.do?top=${param.top}&left=1">기기별푸쉬이력</a></li>
	                        <li><a href="<c:url value='/'/>lpr/his/hisvw/carnoinfo.do?top=${param.top}&left=1">차량번호인식현황</a></li>
	                        <li><a href="<c:url value='/'/>lpr/his/hisvw/his.do?top=${param.top}&left=1">로그 현황 조회</a></li>
	                    </ul>
	                </li>
	            </ul>
			</c:when>
			<c:when test="${param.top == 'tp_graph'}">
	            <ul>
	                <li><a href="" id="" class="ic_code">관심차량위치감지</a>
	                    <ul>
	                        <li><a href="<c:url value='/'/>lpr/stats/day.do?top=${param.top}&left=0">일별</a></li>
	                        <li><a href="<c:url value='/'/>lpr/stats/month.do?top=${param.top}&left=0">월별</a></li>
	                        <li><a href="<c:url value='/'/>lpr/stats/year.do?top=${param.top}&left=0">년별</a></li>
	                        <li><a href="<c:url value='/'/>lpr/stats/area.do?top=${param.top}&left=0">지역별</a></li>
	                    </ul>
	                </li>
	                <li><a href="" id="" class="ic_group">체납발생</a>
	                    <ul>
	                        <li><a href="<c:url value='/'/>lpr/stats/nonpaydetail.do?top=${param.top}&left=1">체납발생상세</a></li>
	                    </ul>
	                </li>
	                <li><a href="" id="" class="ic_group">중복발생</a>
	                    <ul>
	                        <li><a href="<c:url value='/'/>lpr/stats/dupinfo.do?top=${param.top}&left=2">중복발생건수</a></li>
	                    </ul>
	                </li>
	            </ul>
			</c:when>
			<c:when test="${param.top == 'tp_building'}">
	            <ul>
	                <li><a href="" id="" class="ic_area">시설물관리</a>
	                    <ul>
	                        <li><a href="<c:url value='/'/>wrks/sstm/fclt/info.do?top=${param.top}&left=6">시설물기본정보관리</a></li>
	                        <li><a href="<c:url value='/'/>wrks/sstm/fclt/his.do?top=${param.top}&left=6">시설물 상태이력조회</a></li>
	                        <li><a href="<c:url value='/'/>wrks/sstm/fclt/area.do?top=${param.top}&left=6">지역별시설물조회</a></li>
	                    </ul>
	                </li>
	            </ul>
			</c:when>
			<c:otherwise>
	            <ul>
	                <li><a href="" id="" class="ic_code">코드관리</a>
	                    <ul>
	                        <li><a href="<c:url value='/'/>wrks/sstm/code/cmcd.do?top=${param.top}&left=0">공통코드그룹</a></li>
	                        <li><a href="<c:url value='/'/>wrks/sstm/code/dtcd.do?top=${param.top}&left=0">코드상세</a></li>
	                        <li><a href="<c:url value='/'/>wrks/sstm/code/sycd.do?top=${param.top}&left=0">시스템코드</a></li>
	                        <li><a href="<c:url value='/'/>wrks/sstm/code/sggcd.do?top=${param.top}&left=0">시군구코드</a></li>
	                        <li><a href="<c:url value='/'/>wrks/sstm/code/dst.do?top=${param.top}&left=0">지구코드</a></li>
	                        <li><a href="<c:url value='/'/>wrks/sstm/code/area.do?top=${param.top}&left=0">지역코드</a></li>
	                    </ul>
	                </li>
	                <li><a href="" id="" class="ic_user">사용자관리</a>
	                    <ul>
	                        <li><a href="<c:url value='/'/>wrks/sstm/usr/info.do?top=${param.top}&left=1">사용자관리</a></li>
	                        <li><a href="<c:url value='/'/>wrks/sstm/usr/area.do?top=${param.top}&left=1">지역별사용자</a></li>
	                    </ul>
	                </li>
	                <li><a href="" id="" class="ic_group">그룹정보</a>
	                    <ul>
	                        <li><a href="<c:url value='/'/>wrks/sstm/grp/code.do?top=${param.top}&left=2">그룹관리</a></li>
	                        <li><a href="<c:url value='/'/>wrks/sstm/grp/user_acc.do?top=${param.top}&left=2">그룹별이벤트(사용자권한)</a></li>
	                        <li><a href="<c:url value='/'/>wrks/sstm/grp/user.do?top=${param.top}&left=2">그룹별사용자조회</a></li>
	                    </ul>
	                </li>
	                <li><a href="" id="" class="ic_area">모바일</a>
	                    <ul>
	                        <li><a href="<c:url value='/'/>wrks/sstm/mbl/grp.do?top=${param.top}&left=3">그룹관리</a></li>
	                        <li><a href="<c:url value='/'/>wrks/sstm/mbl/info.do?top=${param.top}&left=3">계정정보</a></li>
	                        <li><a href="<c:url value='/'/>wrks/sstm/mbl/version.do?top=${param.top}&left=3">버젼정보관리</a></li>
	                    </ul>
	                </li>
	                <li><a href="" id="" class="ic_area">이벤트관리</a>
	                    <ul>
	                        <li><a href="<c:url value='/'/>wrks/sstm/evnt/base.do?top=${param.top}&left=4">이벤트기본정보</a></li>
	                        <li><a href="<c:url value='/'/>wrks/sstm/evnt/item.do?top=${param.top}&left=4">이벤트세부항목</a></li>
	                    </ul>
	                </li>
	                <li><a href="" id="" class="ic_area">메뉴관리</a>
	                    <ul>
	                        <li><a href="<c:url value='/'/>wrks/sstm/menu/info.do?top=${param.top}&left=5">프로그램정보</a></li>
	                        <li><a href="<c:url value='/'/>wrks/sstm/menu/menu.do?top=${param.top}&left=5">프로그램메뉴</a></li>
	                        <li><a href="<c:url value='/'/>wrks/sstm/menu/grp.do?top=${param.top}&left=5">그룹별프로그램메뉴</a></li>
	                        <li><a href="<c:url value='/'/>wrks/sstm/menu/user.do?top=${param.top}&left=5">사용자별프로그램메뉴</a></li>
	                    </ul>
	                </li>
	                <li><a href="" id="" class="ic_area">상황처리</a>
	                    <ul>
	                        <li><a href="<c:url value='/'/>wrks/sstm/evtctl/info.do?top=${param.top}&left=7">상황관리</a></li>
	                        <li><a href="<c:url value='/'/>wrks/sstm/evtctl/trans_recv.do?top=${param.top}&left=7">상황전달수신자관리</a></li>
	                        <li><a href="<c:url value='/'/>wrks/sstm/evtctl/disp_mbl.do?top=${param.top}&left=7">표출단말관리</a></li>
	                        <li><a href="<c:url value='/'/>wrks/sstm/evtprc/info.do?top=${param.top}&left=7">상황처리</a></li>
	                    </ul>
	                </li>
	            </ul>
			</c:otherwise>
		</c:choose>
		-->
        </div>
