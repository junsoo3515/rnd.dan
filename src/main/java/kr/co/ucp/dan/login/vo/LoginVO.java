package kr.co.ucp.dan.login.vo;

import java.io.Serializable;

/**
 * @Class Name : LoginVO.java
 * @Description : Login VO class
 * @Modification Information
 * @
 * @  수정일         수정자                   수정내용
 * @ -------    --------    ---------------------------
 * @ 2009.03.03    박지욱          최초 생성
 *
 *  @author 공통서비스 개발팀 박지욱
 *  @since 2009.03.03
 *  @version 1.0
 *  @see
 *  
 */
public class LoginVO implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -8274004534207618049L;

	private String memSeq;
	private String memId;
	private String pwd;
	private String nm;
	private String email;
	private String telHp;
	private String telOffice;
	private String authCd;
	private String useFl;
	private String etc;
	private String failPwdCnt;
	private String regMemId;
	private String regDts;
	private String modDts;


	public String getMemId() {
		if(memId == null) return "";
		return memId;
	}
	public void setMemId(String memId) {
		this.memId = memId;
	}
	public String getPwd() {
		return pwd;
	}
	public void setPwd(String pwd) {
		this.pwd = pwd;
	}

	public String getMemSeq() {
		return memSeq;
	}

	public void setMemSeq(String memSeq) {
		this.memSeq = memSeq;
	}

	public String getNm() {
		return nm;
	}

	public void setNm(String nm) {
		this.nm = nm;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getTelHp() {
		return telHp;
	}

	public void setTelHp(String telHp) {
		this.telHp = telHp;
	}

	public String getTelOffice() {
		return telOffice;
	}

	public void setTelOffice(String telOffice) {
		this.telOffice = telOffice;
	}

	public String getAuthCd() {
		return authCd;
	}

	public void setAuthCd(String authCd) {
		this.authCd = authCd;
	}

	public String getUseFl() {
		return useFl;
	}

	public void setUseFl(String useFl) {
		this.useFl = useFl;
	}

	public String getEtc() {
		return etc;
	}

	public void setEtc(String etc) {
		this.etc = etc;
	}

	public String getFailPwdCnt() {
		return failPwdCnt;
	}

	public void setFailPwdCnt(String failPwdCnt) {
		this.failPwdCnt = failPwdCnt;
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
}
