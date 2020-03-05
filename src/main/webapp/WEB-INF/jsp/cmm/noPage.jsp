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
 * @Class Name : noPage.jsp
 * @Description : 빈페이지
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
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ui" uri="http://egovframework.gov/ctl/ui"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>${LoginVO.menuSysNm}</title>

<%@include file="/WEB-INF/jsp/cmm/script.jsp"%>

<script type="text/javascript">
$(document).ready(function(){
	
	$.manuHandler('${param.top}', '${param.left}');
});
</script>
</head>
<body>
<div id="wrapper">
    <!-- topbar -->
	<%@include file="/WEB-INF/jsp/cmm/topMenu.jsp"%>
    <!-- //topbar -->
    <!-- container -->
    <div class="container">
        <!-- leftMenu -->
		<%@include file="/WEB-INF/jsp/cmm/leftMenu.jsp"%>
        <!-- //leftMenu -->
        <!-- content -->
        <div class="contentWrap">
            <div class="topArea">
                <a href="#" class="btnOpen"><img src="<c:url value='/'/>images/btn_on_off.png" alt="열기/닫기"></a>

				<%@include file="/WEB-INF/jsp/cmm/pageTopNavi.jsp"%>

            </div>        
            <div class="content">
                <div class="titArea">
                    <h3 class="tit">작업중</h3>
                </div>
            </div>
        </div>
        <!-- //content -->
    </div>
    <!-- //container -->
</div>
<!--  footer -->
 <div id="footwrap">
    <div id="footer">
    		<%@include file="/WEB-INF/jsp/cmm/footer.jsp"%>
    </div>
 </div>
<!-- //footer -->
</body>
</html>


