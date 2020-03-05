<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/jsp/mntr/cmm/commonTags.jsp"%>
<!DOCTYPE html>
<html style="overflow: hidden;">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=10">
<meta name="viewport" content="width=device-width, initial-scale=1">

<tiles:insertAttribute name="prefix" />

<title>위험시설물</title>
</head>
<body>
	<div id="wrapper">
		<header>
			<tiles:insertAttribute name="header" />
		</header>
		<section id="body">
			<tiles:insertAttribute name="map" />
		</section>

		<aside id="left">
			<tiles:insertAttribute name="left" />
		</aside>
		<div id="toggleLeft"></div>
		<div id="toggleRight"></div>
		<aside id="right">
			<tiles:insertAttribute name="right" />
		</aside>
		<footer>
			<tiles:insertAttribute name="footer" />
		</footer>
 	</div>
	<%--
	<tiles:insertAttribute name="socket" /> 
	--%>
	<tiles:insertAttribute name="suffix" />
</body>
</html>