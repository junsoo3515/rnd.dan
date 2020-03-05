<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<script src="<c:url value='/js/mntr/bootstrap/js/bootstrap.min.js' />"></script>
<script src="<c:url value='/js/mntr/bootstrap-datetimepicker/js/moment.js' />"></script>
<script src="<c:url value='/js/mntr/bootstrap/js/bootstrap-dialog.min.js' />"></script>
<script src="<c:url value='/js/mntr/bootstrap/js/bootstrap-datetimepicker.min.js' />"></script>
<script src="<c:url value='/js/mntr/bootstrap/js/bootstrap-datetimepicker.ko.js' />"></script>
<script>
$(function() {
	$(window).unload(function() {
		if (typeof vmsPlayer != 'undefined' && vmsPlayer != null) {
			vmsPlayer.close();
		}
		if (typeof rtspPlayer != 'undefined' && rtspPlayer != null) {
			rtspPlayer.close();
		}
	});
});
</script>