/**
 * ----------------------------------------------------------------------------------------------
 * @Class Name : FcltVO.java
 * @Description : 시설물 관련 VO
 * @Version : 1.0
 * Copyright (c) 2014 by KR.CO.UCP.CNU All rights reserved.
 * @Modification Information
 * ----------------------------------------------------------------------------------------------
 * DATE AUTHOR DESCRIPTION
 * ----------------------------------------------------------------------------------------------
 * 2015. 3. 17. SaintJuny@ubolt.co.kr 최초작성
 *
 * ----------------------------------------------------------------------------------------------
 */
package kr.co.ucp.dan.monitor.cmm.vo;

import java.util.List;

public class FcltVO extends CommonVO {
	private static final long serialVersionUID = 453661755860353512L;
	private String fcltId;    
	private String fcltNm;        
	private String fcltKndCd;    
	private String fcltKndNm;
	private String sysCd;
	private String sysNm;
	private String roadAdresNm;  
	private String dstrtCd;       
	private String lotnoAdresNm; 
	private String pointX;
    private String pointY;
	private String fcltSttus;
	private String fcltSttusNm;
	private String fcltUid;
	private String presetNum;
	private double radius;
	private List presetList;
	private List cctvCtlUsedTyList;
	private String[] cctvCastNetExcludeList;
	private String searchFcltKndCd;
	private String searchFcltUsedType;
	private String searchFcltId;
	private String searchDstrtCd;
	private String searchTrmsSysCd;
	private String searchEvtList;
	private String searchFcltSttus;
    private String searchPlcPtrDiv;
    private String searchIncludeMissingPlcPtrDiv;
    private String searchExcludeFcltUsedType;
    private String searchFcltViewerType;
    
	private boolean excludeFcltError;
	
	public String getFcltId() {
		return fcltId;
	}
	public void setFcltId(String fcltId) {
		this.fcltId = fcltId;
	}
	public String getFcltNm() {
		return fcltNm;
	}
	public void setFcltNm(String fcltNm) {
		this.fcltNm = fcltNm;
	}
	public String getFcltKndCd() {
		return fcltKndCd;
	}
	public void setFcltKndCd(String fcltKndCd) {
		this.fcltKndCd = fcltKndCd;
	}
	public String getFcltKndNm() {
		return fcltKndNm;
	}
	public void setFcltKndNm(String fcltKndNm) {
		this.fcltKndNm = fcltKndNm;
	}
	public String getSysCd() {
		return sysCd;
	}
	public void setSysCd(String sysCd) {
		this.sysCd = sysCd;
	}
	public String getSysNm() {
		return sysNm;
	}
	public void setSysNm(String sysNm) {
		this.sysNm = sysNm;
	}
	public String getRoadAdresNm() {
		return roadAdresNm;
	}
	public void setRoadAdresNm(String roadAdresNm) {
		this.roadAdresNm = roadAdresNm;
	}
	public String getDstrtCd() {
		return dstrtCd;
	}
	public void setDstrtCd(String dstrtCd) {
		this.dstrtCd = dstrtCd;
	}
	public String getLotnoAdresNm() {
		return lotnoAdresNm;
	}
	public void setLotnoAdresNm(String lotnoAdresNm) {
		this.lotnoAdresNm = lotnoAdresNm;
	}
	public String getPointX() {
		return pointX;
	}
	public void setPointX(String pointX) {
		this.pointX = pointX;
	}
	public String getPointY() {
		return pointY;
	}
	public void setPointY(String pointY) {
		this.pointY = pointY;
	}
	public String getFcltSttus() {
		return fcltSttus;
	}
	public void setFcltSttus(String fcltSttus) {
		this.fcltSttus = fcltSttus;
	}
	public String getFcltSttusNm() {
		return fcltSttusNm;
	}
	public void setFcltSttusNm(String fcltSttusNm) {
		this.fcltSttusNm = fcltSttusNm;
	}
	public String getFcltUid() {
		return fcltUid;
	}
	public void setFcltUid(String fcltUid) {
		this.fcltUid = fcltUid;
	}
	public String getPresetNum() {
		return presetNum;
	}
	public void setPresetNum(String presetNum) {
		this.presetNum = presetNum;
	}
	public double getRadius() {
		return radius;
	}
	public void setRadius(double radius) {
		this.radius = radius;
	}
	public List getPresetList() {
		return presetList;
	}
	public void setPresetList(List presetList) {
		this.presetList = presetList;
	}
	public List getCctvCtlUsedTyList() {
		return cctvCtlUsedTyList;
	}
	public void setCctvCtlUsedTyList(List cctvCtlUsedTyList) {
		this.cctvCtlUsedTyList = cctvCtlUsedTyList;
	}
	public String[] getCctvCastNetExcludeList() {
		return cctvCastNetExcludeList;
	}
	public void setCctvCastNetExcludeList(String[] cctvCastNetExcludeList) {
		this.cctvCastNetExcludeList = cctvCastNetExcludeList;
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
	public String getSearchFcltId() {
		return searchFcltId;
	}
	public void setSearchFcltId(String searchFcltId) {
		this.searchFcltId = searchFcltId;
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
	public String getSearchFcltSttus() {
		return searchFcltSttus;
	}
	public void setSearchFcltSttus(String searchFcltSttus) {
		this.searchFcltSttus = searchFcltSttus;
	}
	public String getSearchPlcPtrDiv() {
		return searchPlcPtrDiv;
	}
	public void setSearchPlcPtrDiv(String searchPlcPtrDiv) {
		this.searchPlcPtrDiv = searchPlcPtrDiv;
	}
	public String getSearchIncludeMissingPlcPtrDiv() {
		return searchIncludeMissingPlcPtrDiv;
	}
	public void setSearchIncludeMissingPlcPtrDiv(String searchIncludeMissingPlcPtrDiv) {
		this.searchIncludeMissingPlcPtrDiv = searchIncludeMissingPlcPtrDiv;
	}
	public String getSearchExcludeFcltUsedType() {
		return searchExcludeFcltUsedType;
	}
	public void setSearchExcludeFcltUsedType(String searchExcludeFcltUsedType) {
		this.searchExcludeFcltUsedType = searchExcludeFcltUsedType;
	}
	public boolean isExcludeFcltError() {
		return excludeFcltError;
	}
	public void setExcludeFcltError(boolean excludeFcltError) {
		this.excludeFcltError = excludeFcltError;
	}
	public String getSearchFcltViewerType() {
		return searchFcltViewerType;
	}
	public void setSearchFcltViewerType(String searchFcltViewerType) {
		this.searchFcltViewerType = searchFcltViewerType;
	}
}
