package kr.co.ucp.dan.monitor.main.service.impl;

import com.hazelcast.impl.concurrentmap.QueryException;
import egovframework.rte.fdl.property.EgovPropertyService;
import egovframework.rte.psl.dataaccess.util.EgovMap;
import kr.co.ucp.dan.cmm.EgovUserDetailsHelper;
import kr.co.ucp.dan.cmm.util.CommonUtil;
import kr.co.ucp.dan.login.vo.LoginVO;
import kr.co.ucp.dan.monitor.cmm.vo.CommonVO;
import kr.co.ucp.dan.monitor.cmm.util.StringUtils;
import kr.co.ucp.dan.monitor.main.mapper.DanFcltMapper;
import kr.co.ucp.dan.monitor.main.service.DanFcltMntrService;
import kr.co.ucp.dan.monitor.main.vo.*;
import kr.co.ucp.dan.monitor.util.GisUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.UncategorizedSQLException;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.awt.geom.Point2D;
import java.math.BigDecimal;
import java.util.*;

@Service("danFcltMntrService")
public class DanFcltMntrServiceImpl implements DanFcltMntrService {

    @Resource(name = "config")
    private Properties config;

    @Resource(name = "gisUtil")
    private GisUtil gisUtil;

    @Resource(name = "danFcltMapper")
    private DanFcltMapper danFcltMapper;

    @Resource(name = "propertiesService")
    protected EgovPropertyService propertiesService;

    private static Logger logger = LogManager.getLogger(DanFcltMntrServiceImpl.class);

    @Override
    public int isExistEvent(EventVO vo) throws Exception {
        return danFcltMapper.isExistsEvent(vo);
    }

    @Override
    public List selectEventKindList(EventVO vo) throws Exception {
        return danFcltMapper.selectEventKindList(vo);
    }

    @Override
    public List<EgovMap> selectDanFcltGeoData(DanFcltVO vo)throws Exception{
        String searchFcltId = vo.getSearchFacCd();
        if(searchFcltId != null) vo.setSearchFacCd(StringUtils.avoidRegexp(searchFcltId));
        logger.debug("BBOX = " + vo.getBbox());

        String[] bBox = vo.getBbox().split(",");

        Point2D.Double tp = new Point2D.Double();
        Point2D.Double tp2 = new Point2D.Double();

        if (!(vo.getBbox() == null || "".equals(vo.getBbox()))) {
            // EPSG:5186 (광양-ArcGIS)
            if (config.getProperty("Mntr.Gis.Projection").equals("EPSG:5186")) {
                tp = gisUtil.convertWTMK2WGS84(bBox[0], bBox[1]);
                tp2 = gisUtil.convertWTMK2WGS84(bBox[2], bBox[3]);
            }
            // EPSG:900913 (VWorld)
            else if (config.getProperty("Mntr.Gis.Projection").equals("EPSG:900913")) {
                tp = gisUtil.convertGoogleMercator2WGS84(bBox[0], bBox[1]);
                tp2 = gisUtil.convertGoogleMercator2WGS84(bBox[2], bBox[3]);
            }
            // EPSG:5179 (기타지역)
            else {
                tp = gisUtil.convertUTMK2WGS84(bBox[0], bBox[1]);
                tp2 = gisUtil.convertUTMK2WGS84(bBox[2], bBox[3]);
            }

            vo.setMinX(String.valueOf(tp.x));
            vo.setMaxX(String.valueOf(tp2.x));
            vo.setMinY(String.valueOf(tp.y));
            vo.setMaxY(String.valueOf(tp2.y));
        }

        logger.debug("CONVERT BBOX = {}, {}, {}, {}", String.valueOf(tp.x), String.valueOf(tp2.x), String.valueOf(tp.y), String.valueOf(tp2.y));

        return danFcltMapper.selectDanFcltGeoData(vo);
    }

    @Override
    public List<EgovMap> selectUnfinishedEventGeoData(DanFcltVO vo)throws Exception{

        String[] bBox = vo.getBbox().split(",");

        Point2D.Double tp = new Point2D.Double();
        Point2D.Double tp2 = new Point2D.Double();

        if (!(vo.getBbox() == null || "".equals(vo.getBbox()))) {

            // EPSG:5186 (광양-ArcGIS)
            if (config.getProperty("Mntr.Gis.Projection").equals("EPSG:5186")) {
                tp = gisUtil.convertWTMK2WGS84(bBox[0], bBox[1]);
                tp2 = gisUtil.convertWTMK2WGS84(bBox[2], bBox[3]);
            }
            // EPSG:900913 (VWorld)
            else if (config.getProperty("Mntr.Gis.Projection").equals("EPSG:900913")) {
                tp = gisUtil.convertGoogleMercator2WGS84(bBox[0], bBox[1]);
                tp2 = gisUtil.convertGoogleMercator2WGS84(bBox[2], bBox[3]);
            }
            // EPSG:5179 (기타지역)
            else {
                tp = gisUtil.convertUTMK2WGS84(bBox[0], bBox[1]);
                tp2 = gisUtil.convertUTMK2WGS84(bBox[2], bBox[3]);
            }

            vo.setMinX(String.valueOf(tp.x));
            vo.setMaxX(String.valueOf(tp2.x));
            vo.setMinY(String.valueOf(tp.y));
            vo.setMaxY(String.valueOf(tp2.y));
        }

        return danFcltMapper.selectUnfinishedEventGeoData(vo);
    }

    @Override
    public EgovMap selectDanFcltById(DanFcltVO vo) throws Exception {
        return danFcltMapper.selectDanFcltById(vo);
    }

    @Override
    public int selectNearestDanFcltListTotCnt(DanFcltVO vo) throws Exception{
        return danFcltMapper.selectNearestDanFcltListTotCnt(vo);
    }


    @Override
    public List<EgovMap> selectNearestDanFcltList(DanFcltVO vo) throws Exception{
        return danFcltMapper.selectNearestDanFcltList(vo);
    }

    @Override
    public Map<String, Object> selectCastNetDanFcltList(DanFcltVO vo)throws Exception{

        Map<String, Object> resultMap = new HashMap<String, Object>();

        vo.setUcpId(config.getProperty("Globals.UcpId"));
        vo.setBoundsLeft(config.getProperty("Mntr.Gis.BoundsLeft"));
        vo.setBoundsBottom(config.getProperty("Mntr.Gis.BoundsBottom"));
        vo.setBoundsRight(config.getProperty("Mntr.Gis.BoundsRight"));
        vo.setBoundsTop(config.getProperty("Mntr.Gis.BoundsTop"));
        vo.setRadius(vo.getRadius() * 2);

        List<EgovMap> danFcltList = danFcltMapper.selectNearestDanFcltForCastNet(vo);

        logger.info("=== DanFcltForCastNet Count:{}",danFcltList.size());

        Map<String, Object> danFcltMap = gisUtil.createGeoJson(danFcltList, "pointX", "pointY");
        resultMap.put("danFclt", danFcltList);
        resultMap.put("geoJson", danFcltMap);


        return resultMap;
    }

    @Override
    public List<EgovMap> selectDanFcltUsedTy(DanFcltVO vo)throws Exception{
        return danFcltMapper.selectDanFcltUsedTy(vo);
    }

    @Override
    public List<EgovMap> selectDanFcltUsedTyAll()throws Exception{
        return danFcltMapper.selectDanFcltUsedTyAll();
    }

    @Override
    public int selectEsListTotCnt(EsVO vo) throws Exception {
        return danFcltMapper.selectEsListTotCnt(vo);
    }

    @Override
    public List<EgovMap> selectEsList(EsVO vo) throws Exception {
        return danFcltMapper.selectEsList(vo);
    }

    @Override
    public EgovMap selectEvent(EventVO vo) throws Exception {
        return danFcltMapper.selectEvent(vo);
    }

    @Override
    public EgovMap selectAutoDisList(EsVO vo) throws Exception {

        return danFcltMapper.selectAutoDisList(vo);
    }

    @Override
    public int mergeEsUserMntrList(EsVO vo) throws Exception {
        return danFcltMapper.mergeEsUserMntrList(vo);
    }

    @Override
    public int insertEsUserMntrList(LoginVO vo) throws Exception{
        return danFcltMapper.insertEsUserMntrList(vo);
    }

    @Override
    public Map<String, String> smsSend(DanFcltVO vo, EventVO eventVO) throws Exception {

        int smsSendResult = 0;
        SmsVO smsVO = new SmsVO();
        Map<String, String> result = new HashMap<String, String>();

        vo.setUcpId(config.getProperty("Globals.UcpId"));
        vo.setBoundsLeft(config.getProperty("Mntr.Gis.BoundsLeft"));
        vo.setBoundsBottom(config.getProperty("Mntr.Gis.BoundsBottom"));
        vo.setBoundsRight(config.getProperty("Mntr.Gis.BoundsRight"));
        vo.setBoundsTop(config.getProperty("Mntr.Gis.BoundsTop"));
        vo.setRadius(vo.getRadius() * 2);

        List<EgovMap> danFcltList = danFcltMapper.selectNearestDanFcltForCastNet(vo);
        LoginVO lgnVO = (LoginVO) EgovUserDetailsHelper.getAuthenticatedUser();

        String smsTrmsConts = "화재발생! 오늘 "
                              + eventVO.getEvtOcrHms().substring(0,2) + "시 "
                              + eventVO.getEvtOcrHms().substring(3,5) + "분 "
                              + eventVO.getEvtPlace() + "에서 화재가 발생했습니다. ";

        String moblNo = "";

        smsVO.setSeq(danFcltMapper.selectSmsSeq());
        smsVO.setSendFl("N");
        smsVO.setSmsConts(smsTrmsConts);
        smsVO.setSendMemId(lgnVO.getMemId());
        smsVO.setSendMemNm(lgnVO.getNm());
        smsVO.setRegMemId(lgnVO.getMemId());

        // SMS 수신정보
        String[] smsRcvMoblNos = new String[danFcltList.size()];

        List<String> rcvList = new ArrayList<String>();

        List<Map<String, String>> smsRcvInfoList = new ArrayList<Map<String, String>>();

        Map<String, String> rcvMap = new HashMap<String, String>();

        for(int i=0; i< smsRcvMoblNos.length; i++){
            if(!(danFcltList.get(i).get("hp").toString().equals("null") && danFcltList.get(i).get("nm").toString().equals("null"))) {

                rcvMap = new HashMap<String, String>();

                rcvMap.put("seq",smsVO.getSeq());
                rcvMap.put("smsRcvId", lgnVO.getMemId());
                rcvMap.put("smsRcvMoblNo", danFcltList.get(i).get("hp").toString());
                rcvMap.put("smsRcvNm", danFcltList.get(i).get("nm").toString());
                rcvMap.put("sendFl", smsVO.getSendFl());
                smsRcvMoblNos[i] = danFcltList.get(i).get("hp").toString();

                rcvList.add(smsRcvMoblNos[i]);

                smsRcvInfoList.add(rcvMap);
            }
        }


        try{
            try {

                danFcltMapper.insertSmsSend(smsVO);

                for(int i=0; i<smsRcvInfoList.size(); i++) {
                    Map<String, String> smsRcvInfoMap = smsRcvInfoList.get(i);
                    danFcltMapper.insertSmsRecv(smsRcvInfoMap);
                }
            } catch(DataIntegrityViolationException e) {
                logger.error("insertSmsSend DataIntegrityViolationException : {}", e.getMessage());
            } catch(UncategorizedSQLException e) {
                logger.error("insertSmsSend UncategorizedSQLException : {}", e.getMessage());
            }catch(Exception e){
                logger.error("insertSmsSend Exception : {}", e.getMessage());
            }
        }
        catch(QueryException e) {
            logger.error("QueryException  : {}", e.getMessage());
        }

        String socketOpt = propertiesService.getString("Globals.SMSSocketOpt").trim();

        smsSendResult = CommonUtil.smsSend(socketOpt, moblNo, smsTrmsConts, rcvList);
        result.put("insertResult", String.valueOf(smsSendResult));
        result.put("seq", smsVO.getSeq());

        return result;
    }

    @Override
    public int updateSmsSendStatus(String seq) throws Exception {

        return danFcltMapper.updateSmsSendStatus(seq);
    }

    @Override
    public int updateSmsRcvStatus(String seq) throws Exception {
        return danFcltMapper.updateSmsRcvStatus(seq);
    }

    @Override
    public List<EgovMap> getUmdLi(AddrVO vo) throws Exception {
        return danFcltMapper.getUmdLi(vo);
    }

    @Override
    public int selectPortalSearchListTotCnt(CommonVO vo) throws Exception {
        return danFcltMapper.selectPortalSearchListTotCnt(vo);
    }

    @Override
    public List<EgovMap> selectPortalSearchList(CommonVO vo) throws Exception {
        return danFcltMapper.selectPortalSearchList(vo);
    }

}

/**
 * No 오름차순
 *
 * @author falbb
 *
 */
class DistanceAscCompare implements Comparator<EgovMap> {

    /**
     * 오름차순(ASC)
     */
    @Override
    public int compare(EgovMap arg0, EgovMap arg1) {
        return ((BigDecimal) arg0.get("distance")).doubleValue() < ((BigDecimal) arg1.get("distance")).doubleValue() ? -1
                : ((BigDecimal) arg0.get("distance")).doubleValue() > ((BigDecimal) arg1.get("distance")).doubleValue() ? 1 : 0;
    }

}
