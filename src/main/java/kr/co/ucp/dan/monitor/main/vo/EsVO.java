/**
 * ----------------------------------------------------------------------------------------------
 * @Class Name : EsVO.java
 * @Description : 
 * @Version : 1.0
 * Copyright (c) 2014 by KR.CO.UCP.CNU All rights reserved.
 * @Modification Information
 * ----------------------------------------------------------------------------------------------
 * DATE AUTHOR DESCRIPTION
 * ----------------------------------------------------------------------------------------------
 * 2015. 10. 26. SaintJuny 최초작성
 *
 * ----------------------------------------------------------------------------------------------
 */
package kr.co.ucp.dan.monitor.main.vo;

import kr.co.ucp.dan.monitor.cmm.vo.CommonVO;

public class EsVO extends CommonVO {
	private static final long serialVersionUID = -7027057469466251597L;
	private String clmtOcrNo;
	private String evtId;
	private String evtIdSubCd;
	
	public String getClmtOcrNo() {
		return clmtOcrNo;
	}
	
	public void setClmtOcrNo(String clmtOcrNo) {
		this.clmtOcrNo = clmtOcrNo;
	}

	public String getEvtId() {
		return evtId;
	}

	public void setEvtId(String evtId) {
		this.evtId = evtId;
	}

	public String getEvtIdSubCd() {
		return evtIdSubCd;
	}

	public void setEvtIdSubCd(String evtIdSubCd) {
		this.evtIdSubCd = evtIdSubCd;
	}
}
