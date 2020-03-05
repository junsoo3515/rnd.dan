/**
 * ----------------------------------------------------------------------------------------------
 * @Class Name : EventVO.java
 * @Description : 
 * @Version : 1.0
 * Copyright (c) 2015 by KR.CO.UCP.MNTR All rights reserved.
 * @Modification Information
 * ----------------------------------------------------------------------------------------------
 * DATE AUTHOR DESCRIPTION
 * ----------------------------------------------------------------------------------------------
 * 2014. 11. 18. SaintJuny 최초작성
 *
 * ----------------------------------------------------------------------------------------------
 */
package kr.co.ucp.dan.monitor.main.vo;

import kr.co.ucp.dan.monitor.cmm.vo.CommonVO;

public class EventVO extends CommonVO {
	/* 이벤트 발생번호 */
	private String evtOcrNo;
	/* 이벤트 아이디 */
	private String evtId;
	/* 이벤트 명 */
	private String evtNm;
	/* 이벤트 등급코드 */
	private String evtGradCd;
	/* 이벤트 등급 */
	private String evtGradNm;
	/* 이벤트 진행코드 */
	private String evtPrgrsCd;
	/* 이벤트 진행 */
	private String evtPrgrsNm;
	/* 이벤트 관련 시설 */
	private String ocrFcltId;
	/* 이벤트 발생 일자 시각 */
	private String evtOcrYmdHms;

	private String evtOcrHms;

	private String evtPlace;
	
	private String uscvGrpCd;
	private String sysCd;
	
	private String userId;
	
	private String evtDtl;
	private String imgUrl;
	private String presetNum;
	
	/* search parameters */
	private String searchEvtOcrYmdHms;
	private String searchEvtPlace;
	private String searchEvtId;
	private boolean excludeFcltError;
	
	private String evtLcMoveYn;

	public String getEvtOcrHms() {
		return evtOcrHms;
	}

	public void setEvtOcrHms(String evtOcrHms) {
		this.evtOcrHms = evtOcrHms;
	}

	public String getEvtPlace() {
		return evtPlace;
	}

	public void setEvtPlace(String evtPlace) {
		this.evtPlace = evtPlace;
	}

	public String getEvtOcrNo() {
		return evtOcrNo;
	}
	public void setEvtOcrNo(String evtOcrNo) {
		this.evtOcrNo = evtOcrNo;
	}
	public String getEvtId() {
		return evtId;
	}
	public void setEvtId(String evtId) {
		this.evtId = evtId;
	}
	public String getEvtNm() {
		return evtNm;
	}
	public void setEvtNm(String evtNm) {
		this.evtNm = evtNm;
	}
	public String getEvtGradCd() {
		return evtGradCd;
	}
	public void setEvtGradCd(String evtGradCd) {
		this.evtGradCd = evtGradCd;
	}
	public String getEvtGradNm() {
		return evtGradNm;
	}
	public void setEvtGradNm(String evtGradNm) {
		this.evtGradNm = evtGradNm;
	}
	public String getEvtPrgrsCd() {
		return evtPrgrsCd;
	}
	public void setEvtPrgrsCd(String evtPrgrsCd) {
		this.evtPrgrsCd = evtPrgrsCd;
	}
	public String getEvtPrgrsNm() {
		return evtPrgrsNm;
	}
	public void setEvtPrgrsNm(String evtPrgrsNm) {
		this.evtPrgrsNm = evtPrgrsNm;
	}
	public String getOcrFcltId() {
		return ocrFcltId;
	}
	public void setOcrFcltId(String ocrFcltId) {
		this.ocrFcltId = ocrFcltId;
	}
	public String getEvtOcrYmdHms() {
		return evtOcrYmdHms;
	}
	public void setEvtOcrYmdHms(String evtOcrYmdHms) {
		this.evtOcrYmdHms = evtOcrYmdHms;
	}
	public String getEvtDtl() {
		return evtDtl;
	}
	public void setEvtDtl(String evtDtl) {
		this.evtDtl = evtDtl;
	}
	public String getImgUrl() {
		return imgUrl;
	}
	public void setImgUrl(String imgUrl) {
		this.imgUrl = imgUrl;
	}
	public String getPresetNum() {
		return presetNum;
	}
	public void setPresetNum(String presetNum) {
		this.presetNum = presetNum;
	}
	public String getSearchEvtOcrYmdHms() {
		return searchEvtOcrYmdHms;
	}
	public void setSearchEvtOcrYmdHms(String searchEvtOcrYmdHms) {
		this.searchEvtOcrYmdHms = searchEvtOcrYmdHms;
	}
	public String getUscvGrpCd() {
		return uscvGrpCd;
	}
	public void setUscvGrpCd(String uscvGrpCd) {
		this.uscvGrpCd = uscvGrpCd;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getSysCd() {
		return sysCd;
	}
	public void setSysCd(String sysCd) {
		this.sysCd = sysCd;
	}
	public String getSearchEvtPlace() {
		return searchEvtPlace;
	}
	public void setSearchEvtPlace(String searchEvtPlace) {
		this.searchEvtPlace = searchEvtPlace;
	}
	public String getSearchEvtId() {
		return searchEvtId;
	}
	public void setSearchEvtId(String searchEvtId) {
		this.searchEvtId = searchEvtId;
	}
	public boolean isExcludeFcltError() {
		return excludeFcltError;
	}
	public void setExcludeFcltError(boolean excludeFcltError) {
		this.excludeFcltError = excludeFcltError;
	}
	public String getEvtLcMoveYn() {
		return evtLcMoveYn;
	}
	public void setEvtLcMoveYn(String evtLcMoveYn) {
		this.evtLcMoveYn = evtLcMoveYn;
	}
	@Override
	public String toString() {
		return "EventVO: {evtOcrNo: " + evtOcrNo + ", evtId: " + evtId + ", evtNm: " + evtNm + ", evtGradCd: " + evtGradCd + ", evtGradNm: "
				+ evtGradNm + ", evtPrgrsCd: " + evtPrgrsCd + ", evtPrgrsNm: " + evtPrgrsNm + ", ocrFcltId: " + ocrFcltId
				+ ", evtOcrYmdHms: " + evtOcrYmdHms + ", uscvGrpCd: " + uscvGrpCd + ", sysCd: " + sysCd + ", userId: " + userId
				+ ", evtDtl: " + evtDtl + ", imgUrl: " + imgUrl + ", presetNum: " + presetNum + ", searchEvtOcrYmdHms: "
				+ searchEvtOcrYmdHms + ", searchEvtPlace: " + searchEvtPlace + ", searchEvtId: " + searchEvtId + ", excludeFcltError: "
				+ excludeFcltError + ", evtLcMoveYn: " + evtLcMoveYn + ", getBbox(): " + getBbox() + ", getMinX(): " + getMinX()
				+ ", getMinY(): " + getMinY() + ", getMaxX(): " + getMaxX() + ", getMaxY(): " + getMaxY() + ", getTitle(): " + getTitle()
				+ ", getMainMenu(): " + getMainMenu() + ", getSubMenu(): " + getSubMenu() + ", getDropdownMenu(): " + getDropdownMenu()
				+ ", getDstrtCd(): " + getDstrtCd() + ", getPage(): " + getPage() + ", getRows(): " + getRows() + ", getSidx(): "
				+ getSidx() + ", getSord(): " + getSord() + ", getFirstIndex(): " + getFirstIndex() + ", getLastIndex(): " + getLastIndex()
				+ ", getRecordCountPerPage(): " + getRecordCountPerPage() + ", getPageSize(): " + getPageSize() + ", getPageUnit(): "
				+ getPageUnit() + ", toString(): " + super.toString() + ", getClass(): " + getClass() + ", hashCode(): " + hashCode() + "}";
	}
}
