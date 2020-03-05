/**
* ----------------------------------------------------------------------------------------------
* @Class Name : CommonVO.java
* @Description : 
* @Version : 1.0
* Copyright (c) 2015 by KR.CO.UCP.MNTR All rights reserved.
* @Modification Information
* ----------------------------------------------------------------------------------------------
* DATE AUTHOR DESCRIPTION
* ----------------------------------------------------------------------------------------------
* 2014. 10. 14. 이성준 최초작성
*
* ----------------------------------------------------------------------------------------------
*/
package kr.co.ucp.dan.monitor.cmm.vo;

import java.io.Serializable;

public class CommonVO implements Serializable {
	private static final long serialVersionUID = 5224780483265784719L;
	private String title;
	private String mainMenu;
	private String subMenu;
	private String dropdownMenu;
	private String dstrtCd;
	private String ucpId;
	private String sysCd;
	
	private String bbox;
	private String minX;
	private String minY;
	private String maxX;
	private String maxY;
	
	private String boundsLeft;
	private String boundsBottom;
	private String boundsRight;
	private String boundsTop;
	
	// the requested page
	private int page;
	// the number of rows requested
	private int rows;
	// the sorting column
	private String sidx;
	// the sort order 
	private String sord;
	
	private int firstIndex;
	private int lastIndex;
	
	private int recordCountPerPage;
	private int pageSize;
	private int pageUnit;
	
	private String evtOcrNo;
	private String userId;
	private String grpId;
	
	private String searchKeyword;
	private String searchType;
	private String searchFcltLblNm;
	private String searchFcltKndCd;
	private String searchFcltUsedType;
	private String searchDstrtCd;
	private String searchTrmsSysCd;
	private String searchEvtList;
	private double searchRadius;
	private int searchRownum;
	
	public String getBbox() {
		return bbox;
	}
	public void setBbox(String bbox) {
		this.bbox = bbox;
	}
	public String getMinX() {
		return minX;
	}
	public void setMinX(String minX) {
		this.minX = minX;
	}
	public String getMinY() {
		return minY;
	}
	public void setMinY(String minY) {
		this.minY = minY;
	}
	public String getMaxX() {
		return maxX;
	}
	public void setMaxX(String maxX) {
		this.maxX = maxX;
	}
	public String getMaxY() {
		return maxY;
	}
	public void setMaxY(String maxY) {
		this.maxY = maxY;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getMainMenu() {
		return mainMenu;
	}
	public void setMainMenu(String mainMenu) {
		this.mainMenu = mainMenu;
	}
	public String getSubMenu() {
		return subMenu;
	}
	public void setSubMenu(String subMenu) {
		this.subMenu = subMenu;
	}
	public String getDropdownMenu() {
		return dropdownMenu;
	}
	public void setDropdownMenu(String dropdownMenu) {
		this.dropdownMenu = dropdownMenu;
	}
	public String getDstrtCd() {
		return dstrtCd;
	}
	public void setDstrtCd(String dstrtCd) {
		this.dstrtCd = dstrtCd;
	}
	public String getUcpId() {
		return ucpId;
	}
	public void setUcpId(String ucpId) {
		this.ucpId = ucpId;
	}
	public String getSysCd() {
		return sysCd;
	}
	public void setSysCd(String sysCd) {
		this.sysCd = sysCd;
	}
	public int getPage() {
		return page;
	}
	public void setPage(int page) {
		this.page = page;
	}
	public int getRows() {
		return rows;
	}
	public void setRows(int rows) {
		this.rows = rows;
	}
	public String getSidx() {
		return sidx;
	}
	public void setSidx(String sidx) {
		this.sidx = sidx;
	}
	public String getSord() {
		return sord;
	}
	public void setSord(String sord) {
		this.sord = sord;
	}
	public int getFirstIndex() {
		return firstIndex;
	}
	public void setFirstIndex(int firstIndex) {
		this.firstIndex = firstIndex;
	}
	public int getLastIndex() {
		return lastIndex;
	}
	public void setLastIndex(int lastIndex) {
		this.lastIndex = lastIndex;
	}
	public int getRecordCountPerPage() {
		return recordCountPerPage;
	}
	public void setRecordCountPerPage(int recordCountPerPage) {
		this.recordCountPerPage = recordCountPerPage;
	}
	public int getPageSize() {
		return pageSize;
	}
	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}
	public int getPageUnit() {
		return pageUnit;
	}
	public void setPageUnit(int pageUnit) {
		this.pageUnit = pageUnit;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getGrpId() {
		return grpId;
	}
	public void setGrpId(String grpId) {
		this.grpId = grpId;
	}
	public String getBoundsLeft() {
		return boundsLeft;
	}
	public void setBoundsLeft(String boundsLeft) {
		this.boundsLeft = boundsLeft;
	}
	public String getBoundsBottom() {
		return boundsBottom;
	}
	public void setBoundsBottom(String boundsBottom) {
		this.boundsBottom = boundsBottom;
	}
	public String getBoundsRight() {
		return boundsRight;
	}
	public void setBoundsRight(String boundsRight) {
		this.boundsRight = boundsRight;
	}
	public String getBoundsTop() {
		return boundsTop;
	}
	public void setBoundsTop(String boundsTop) {
		this.boundsTop = boundsTop;
	}
	public String getEvtOcrNo() {
		return evtOcrNo;
	}
	public void setEvtOcrNo(String evtOcrNo) {
		this.evtOcrNo = evtOcrNo;
	}
	
	public String getSearchKeyword() {
		return searchKeyword;
	}
	public void setSearchKeyword(String searchKeyword) {
		this.searchKeyword = searchKeyword;
	}
	public String getSearchType() {
		return searchType;
	}
	public void setSearchType(String searchType) {
		this.searchType = searchType;
	}
	public String getSearchFcltLblNm() {
		return searchFcltLblNm;
	}
	public void setSearchFcltLblNm(String searchFcltLblNm) {
		this.searchFcltLblNm = searchFcltLblNm;
	}
	public String getSearchFcltKndCd() {
		return searchFcltKndCd;
	}
	public void setSearchFcltKndCd(String searchFcltKndCd) {
		this.searchFcltKndCd = searchFcltKndCd;
	}
	public String getSearchFcltUsedType() {
		return searchFcltUsedType;
	}
	public void setSearchFcltUsedType(String searchFcltUsedType) {
		this.searchFcltUsedType = searchFcltUsedType;
	}
	public String getSearchDstrtCd() {
		return searchDstrtCd;
	}
	public void setSearchDstrtCd(String searchDstrtCd) {
		this.searchDstrtCd = searchDstrtCd;
	}
	public String getSearchTrmsSysCd() {
		return searchTrmsSysCd;
	}
	public void setSearchTrmsSysCd(String searchTrmsSysCd) {
		this.searchTrmsSysCd = searchTrmsSysCd;
	}
	public String getSearchEvtList() {
		return searchEvtList;
	}
	public void setSearchEvtList(String searchEvtList) {
		this.searchEvtList = searchEvtList;
	}
	public double getSearchRadius() {
		return searchRadius;
	}
	public void setSearchRadius(double searchRadius) {
		this.searchRadius = searchRadius;
	}
	public int getSearchRownum() {
		return searchRownum;
	}
	public void setSearchRownum(int searchRownum) {
		this.searchRownum = searchRownum;
	}
	
}
