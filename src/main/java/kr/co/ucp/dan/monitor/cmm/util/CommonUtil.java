package kr.co.ucp.dan.monitor.cmm.util;

import egovframework.rte.ptl.mvc.tags.ui.pagination.PaginationInfo;
import kr.co.ucp.dan.monitor.cmm.vo.CommonVO;

import javax.servlet.http.HttpServletResponse;
import java.net.URLEncoder;

public class CommonUtil {
	private static String[] operation = {"", "목록", "상세조회", "등록", "수정", "삭제"};
	
	public static void setCommonVOData(CommonVO common, String ... strings){
		setCommonVOData(common, 0, strings);
	}
	
	public static void setCommonVOData(CommonVO common, int flag, String ... strings){
		common.setTitle(strings[0] + operation[flag]);
		common.setMainMenu(strings[1]);
		common.setSubMenu(strings[2]);
	}

	public static PaginationInfo setPaginationInfo(CommonVO common) {
		PaginationInfo paginationInfo = new PaginationInfo();
		paginationInfo.setCurrentPageNo(common.getPage());
		paginationInfo.setRecordCountPerPage(common.getRows());
		paginationInfo.setPageSize(common.getRows());
		
		common.setFirstIndex(paginationInfo.getFirstRecordIndex() + 1);
		common.setLastIndex(paginationInfo.getLastRecordIndex());
		
		return paginationInfo;
	}

	public static HttpServletResponse setExcelDownladHeader(HttpServletResponse response, String fileName) throws Exception {
		fileName = URLEncoder.encode(fileName, "UTF-8");
		response.setContentType("application/vnd.ms-excel;charset=utf-8");
		response.setHeader("Content-Disposition", "attachment; filename="+ fileName +".xls"); 
    	response.setHeader("Content-Description", "JSP Generated Data");
    	response.setHeader("Cache-Control","no-store");
        response.setHeader("Pragma","no-cache");
        response.setDateHeader ("Expires", 0);
        
        return response;
	}

}
