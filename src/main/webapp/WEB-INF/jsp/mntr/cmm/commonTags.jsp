<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles" %>
<%@ taglib prefix="ui" uri="http://egovframework.gov/ctl/ui" %>
<%@ taglib prefix="validator" uri="http://www.springmodules.org/tags/commons-validator" %>
<c:set var="exeEnv">
	<spring:eval expression="@config['Globals.ExeEnv']" />
</c:set>
<c:set var="dstrtCd">
	<spring:eval expression="@config['Mntr.DstrtCd']" />
</c:set>
<c:set var="ucpId">
	<spring:eval expression="@config['Globals.UcpId']" />
</c:set>
<c:set var="sysCd" 			value="${LoginVO.authCd}"/>

<c:choose>
	<c:when test="${ucpId eq 'KSG'}">
		<c:set var="startPreNum" value="10" />
	</c:when>
	<c:when test="${ucpId eq 'YSC'}">
		<c:set var="startPreNum" value="50" />
	</c:when>
	<c:otherwise>
		<c:set var="startPreNum" value="70" />
	</c:otherwise>
</c:choose>