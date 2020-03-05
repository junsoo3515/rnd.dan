<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@page import="kr.co.ucp.cmm.LoginVO"%>
<%
LoginVO vvp = (LoginVO) request.getSession().getAttribute("LoginVO");
String userNmKo = vvp.getUserNmKo();
String authLvlNm = vvp.getAuthLvlNm();
%>
<jsp:useBean id="vo" class="kr.co.ucp.cmm.LoginVO" />

    <div class="topbar">
        <div class="logo">
            <h1><a href="<c:url value='/'/>wrks/main/main.do"><img src="<c:url value='/'/>images/logo.gif" alt="U-City 스마트방법"></a></h1>
        </div>
        <div class="navbar">
             </ul>
        </div>
        <div class="userPop">
           <a href="#"><span><%= userNmKo%> 님 (<%=authLvlNm%>)</span></a>
        </div>
    </div>
