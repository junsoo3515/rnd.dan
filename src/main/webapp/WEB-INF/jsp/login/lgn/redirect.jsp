<%--
/**
 * 로그인을 관리
 * @author		대전도안 김정원
 * @version		1.00	2014-01-25
 * @since		JDK 1.7.0_45(x64)
 * @revision
 * /

/**
 * ----------------------------------------------------------
 * @Class Name : login.jsp
 * @Description : 로그인
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


<title>위험시설물 보호지원 서비스 로그인</title>

<!DOCTYPE html>
<html lang="ko">
<head>
<title>U-City 통합업무 로그인</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<%@include file="/WEB-INF/jsp/cmm/script.jsp"%>

<script type="text/javascript" src="<c:url value='/'/>magicsso/js/deployJava.js" charset="utf-8"></script>
<script type="text/javascript" src="<c:url value='/'/>magicsso/js/MagicLine.js" charset="utf-8"></script>
<script type="text/javascript" src="<c:url value='/'/>magicsso/js/MagicPass.js" charset="utf-8"></script>
<script type="text/javascript" src="<c:url value='/'/>magicsso/js/Login.js" charset="utf-8"></script>
<script type="text/javascript" src="<c:url value='/'/>magicsso/js/Monitor.js" charset="utf-8"></script>
<script type="text/javascript" src="<c:url value='/'/>magicsso/js/Certificate.js" charset="utf-8"></script>
<script type="text/javascript" src="<c:url value='/'/>magicsso/js/cookie.js" charset="utf-8"></script>


<script type="text/javascript">


$(document).ready(function(){
	
	
    var url = "<c:url value='/'/>wrks/lgn/login.json";
	var userId = $("#userId").val();
	var params = "userId=" + userId;
	params += "&pwd=";
	

	if(userId == 'null' || userId == ''){

		window.location.replace("/wrks/lgn/login.do");
	
	}else{


		$.ajaxEx(null, {
			    url : url,
			    dataType : "json",
			    data: params,
		        success:function(data){
					if(data.ret == 1) {
						location.href = "<c:url value='/'/>" + data.redirect;
					}
					else {
			        	alert(data.msg);
					}
		        },   
		        error:function(e){  
		            //alert(e.responseText);  
		        	alert("접속이 지연되고 있습니다. 잠시후 시도해주십시오"); 	            
		        }  
		});

		 
		 
	}
	 	

});


</script>
</head>
<body>
<input type="hidden" id="userId" value="<%=session.getAttribute("SSO_ID")%>" />
</body>
</html> 
