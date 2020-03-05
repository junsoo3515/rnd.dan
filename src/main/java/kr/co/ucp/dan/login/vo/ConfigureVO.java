/**
* ----------------------------------------------------------------------------------------------
* @Class Name : ConfigureVO.java
* @Description : 
* @Version : 1.0
* Copyright (c) 2014 by KR.CO.UCP.CNU All rights reserved.
* @Modification Information
* ----------------------------------------------------------------------------------------------
* DATE AUTHOR DESCRIPTION
* ----------------------------------------------------------------------------------------------
* 2014. 11. 6. ubolt 최초작성
*
* ----------------------------------------------------------------------------------------------
*/
package kr.co.ucp.dan.login.vo;

import kr.co.ucp.dan.monitor.cmm.vo.CommonVO;

public class ConfigureVO extends CommonVO {
	private static final long serialVersionUID = 6025917681001253877L;
	private String networkId;
	private String networkNm;
	private String networkTy;
	private String networkIp;
	private String networkMpIp;
	private String regMemId;
	private String regDts;
	private String modDts;
	private String connIp;
	private String connDesc;

	public String getNetworkId() {
		return networkId;
	}

	public void setNetworkId(String networkId) {
		this.networkId = networkId;
	}

	public String getNetworkNm() {
		return networkNm;
	}

	public void setNetworkNm(String networkNm) {
		this.networkNm = networkNm;
	}

	public String getNetworkTy() {
		return networkTy;
	}

	public void setNetworkTy(String networkTy) {
		this.networkTy = networkTy;
	}

	public String getNetworkIp() {
		return networkIp;
	}

	public void setNetworkIp(String networkIp) {
		this.networkIp = networkIp;
	}

	public String getNetworkMpIp() {
		return networkMpIp;
	}

	public void setNetworkMpIp(String networkMpIp) {
		this.networkMpIp = networkMpIp;
	}

	public String getRegMemId() {
		return regMemId;
	}

	public void setRegMemId(String regMemId) {
		this.regMemId = regMemId;
	}

	public String getRegDts() {
		return regDts;
	}

	public void setRegDts(String regDts) {
		this.regDts = regDts;
	}

	public String getModDts() {
		return modDts;
	}

	public void setModDts(String modDts) {
		this.modDts = modDts;
	}

	public String getConnIp() {
		return connIp;
	}

	public void setConnIp(String connIp) {
		this.connIp = connIp;
	}

	public String getConnDesc() {
		return connDesc;
	}

	public void setConnDesc(String connDesc) {
		this.connDesc = connDesc;
	}
}
