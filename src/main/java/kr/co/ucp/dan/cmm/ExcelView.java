package kr.co.ucp.dan.cmm;


import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.web.servlet.view.document.AbstractExcelView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.net.URLEncoder;
import java.util.List;
import java.util.Map;


public class ExcelView extends AbstractExcelView {
	@Override
	protected void buildExcelDocument(Map<String,Object> modelMap, HSSFWorkbook workbook, HttpServletRequest request, HttpServletResponse response) throws Exception{
		String titleKey = modelMap.get("titleKey").toString();
		String titleHeader = modelMap.get("titleHeader").toString();
		String excelName = modelMap.get("fileName").toString();
        /*제목 및 검색조건 추가*/
		String title = modelMap.get("title").toString();
		String search = modelMap.get("search").toString();
		int intRow = 0;
        /*제목 및 검색조건 추가*/
        
		HSSFSheet worksheet = null;
		HSSFRow row = null;
	    String[] keyArray;
	    String[] titleArray;
         
        excelName = URLEncoder.encode(excelName, "UTF-8");
        worksheet = workbook.createSheet("WorkSheet1");
        
        
        /*제목 및 검색조건 추가*/
        //제목
        intRow = 0;
        row = worksheet.createRow(intRow);
        row.createCell(0).setCellValue(title);
        //검색조건
        intRow++;
        row = worksheet.createRow(intRow);
        row.createCell(0).setCellValue(search);
        
        intRow++;
        row = worksheet.createRow(intRow);        
        /*제목 및 검색조건 추가*/
        
        @SuppressWarnings("unchecked")
        List<Map<String, String>> list = (List<Map<String, String>>)modelMap.get("dataList");
        
        //row = worksheet.createRow(0);
        intRow++;
        row = worksheet.createRow(intRow);
        
        
        keyArray 	= titleKey.split("[|]");
        titleArray = titleHeader.split("[|]");
        
        //header
    	//row = worksheet.createRow(0);
        row = worksheet.createRow(intRow);
        
    	for(int col = 0; col < titleArray.length; col++) {
        	row.createCell(col).setCellValue(titleArray[col]);
    	}
        //data
    	intRow++;
        for(int i = 0; i < list.size(); i++){
        	//row = worksheet.createRow(i + 1);
        	row = worksheet.createRow(i + intRow);

        	for(int col = 0; col < keyArray.length; col++) {
            	row.createCell(col).setCellValue(String.valueOf(list.get(i).get(keyArray[col])));
        	}
        }

		response.setContentType("Application/MSExcel");
		response.setHeader("Content-Disposition", "attachment; filename=" + excelName + ").xls");
   }
}

