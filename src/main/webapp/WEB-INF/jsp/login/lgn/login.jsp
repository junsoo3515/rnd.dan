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
<c:set var="sysCd" 			value="${LoginVO.authCd}"/>
<c:set var="ucpId">
	<spring:eval expression="@config['Globals.UcpId']" />
</c:set>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>위험시설물 보호지원 서비스 로그인</title>

<%@include file="/WEB-INF/jsp/cmm/script.jsp"%>
<script type="text/javascript">


$(document).ready(function(){
	$(".login_img").bind("click",function()
	{
		var url = "<c:url value='/dan/login/login.json'/>";
		var params = "memId=" + $("#loginId").val();
			params += "&pwd=" + $("#loginPw").val();
		$.ajaxEx(null,
		{
			  url : url
			, dataType : "json"
			, data: params
			, success:function(data){
				if(data.ret == 1) {
					location.href = "<c:url value='/'/>" + data.redirect;
				} else {
					alert(data.msg);
				}
			}
			, error:function(e){
				alert("접속이 지연되고 있습니다. 잠시후 시도해주십시오");
			}
		});
	});
});


</script>
</head>
<body>
<div id="login">
	<div class="loginCont">
		<div class="tit">
		<h1>
		<!-- 
		<c:choose>
			<c:when test="${not empty sysCd}">
			<img src="<c:url value='/'/>images/${sysCd}/title_login.png">
			</c:when>
			<c:otherwise>
			<img src="<c:url value='/'/>images/title_login.png">
			</c:otherwise>
		</c:choose>
		 -->
		</h1>
		</div>
		<div class="loginBox">
		<fieldset>
			<legend>로그인</legend>
			<label for="loginId">아이디</label>
			<input type="text" name="" id="loginId" class="login_id"  placeholder="ID" style="ime-mode:inactive" >
			<label for="loginPw">비밀번호</label>
			<input type="password" name="" id="loginPw" class="login_pw" placeholder="Password">
			<input type="image" src="<c:url value='/images/btn_login.gif'/>" id = "login_img" class="login_img" alt="로그인" title="로그인">
			<a href="<c:url value='/dan/login/findpwd.do'/>"><img src="<c:url value='/images/btn_pw.gif'/>" alt="비밀번호 찾기"></a>
		</fieldset>
            <div style="text-align:right; padding:0 60px 10px 0"><a href="<c:url value='/'/>scmpshare/manual/${ucpId}/installFile.zip">download</a></div>
		</div>
	</div>
</div>
</body>
</html> 
