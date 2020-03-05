package kr.co.ucp.dan.monitor.main.vo;

public class DanFcltManagerVO {

    private int mngSeq;
    private int facSeq;
    private String nm;
    private String hp;
    private String email;
    private String smsAcceptFl;
    private String regMemId;
    private String regDts;
    private String modDts;

    public int getMngSeq() {
        return mngSeq;
    }

    public void setMngSeq(int mngSeq) {
        this.mngSeq = mngSeq;
    }

    public int getFacSeq() {
        return facSeq;
    }

    public void setFacSeq(int facSeq) {
        this.facSeq = facSeq;
    }

    public String getNm() {
        return nm;
    }

    public void setNm(String nm) {
        this.nm = nm;
    }

    public String getHp() {
        return hp;
    }

    public void setHp(String hp) {
        this.hp = hp;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSmsAcceptFl() {
        return smsAcceptFl;
    }

    public void setSmsAcceptFl(String smsAcceptFl) {
        this.smsAcceptFl = smsAcceptFl;
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

