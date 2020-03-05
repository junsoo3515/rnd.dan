package kr.co.ucp.dan.monitor.main.vo;


import kr.co.ucp.dan.monitor.cmm.vo.CommonVO;

import java.util.List;

public class DanFcltVO extends CommonVO {

    private String facSeq;
    private String facCd;
    private String typeCd;
    private String facNm;
    private String addr;
    private String pointX;
    private String pointY;
    private String regMemId;
    private String regDts;
    private String modDts;

    private String searchFacCd;
    private String searchDanFcltType;
    private String searchExcludeDanFcltType;
    private List danFcltCtlUsedTyList;
    private double radius;

    public List getDanFcltCtlUsedTyList() {
        return danFcltCtlUsedTyList;
    }

    public void setDanFcltCtlUsedTyList(List danFcltCtlUsedTyList) {
        this.danFcltCtlUsedTyList = danFcltCtlUsedTyList;
    }

    public String getFacSeq() {
        return facSeq;
    }

    public void setFacSeq(String facSeq) {
        this.facSeq = facSeq;
    }

    public String getFacCd() {
        return facCd;
    }

    public void setFacCd(String facCd) {
        this.facCd = facCd;
    }

    public String getTypeCd() {
        return typeCd;
    }

    public void setTypeCd(String typeCd) {
        this.typeCd = typeCd;
    }

    public String getFacNm() {
        return facNm;
    }

    public void setFacNm(String facNm) {
        this.facNm = facNm;
    }

    public String getAddr() {
        return addr;
    }

    public void setAddr(String addr) {
        this.addr = addr;
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

    public String getSearchFacCd() {
        return searchFacCd;
    }

    public void setSearchFacCd(String searchFacCd) {
        this.searchFacCd = searchFacCd;
    }

    public String getSearchDanFcltType() {
        return searchDanFcltType;
    }

    public void setSearchDanFcltType(String searchDanFcltType) {
        this.searchDanFcltType = searchDanFcltType;
    }

    public String getSearchExcludeDanFcltType() {
        return searchExcludeDanFcltType;
    }

    public void setSearchExcludeDanFcltType(String searchExcludeDanFcltType) {
        this.searchExcludeDanFcltType = searchExcludeDanFcltType;
    }

    public double getRadius() {
        return radius;
    }

    public void setRadius(double radius) {
        this.radius = radius;
    }
}
