package kr.co.ucp.dan.monitor.main.service;

import egovframework.rte.psl.dataaccess.util.EgovMap;
import kr.co.ucp.dan.login.vo.LoginVO;
import kr.co.ucp.dan.monitor.cmm.vo.CommonVO;
import kr.co.ucp.dan.monitor.main.vo.*;

import java.util.List;
import java.util.Map;

public interface DanFcltMntrService {

    int isExistEvent(EventVO vo) throws Exception;

    List selectEventKindList(EventVO vo) throws Exception;

    List<EgovMap> selectDanFcltGeoData(DanFcltVO vo) throws Exception;

    List<EgovMap> selectUnfinishedEventGeoData(DanFcltVO vo) throws Exception;

    EgovMap selectDanFcltById(DanFcltVO vo) throws Exception;

    int selectNearestDanFcltListTotCnt(DanFcltVO vo) throws Exception;

    List<EgovMap> selectNearestDanFcltList(DanFcltVO vo) throws Exception;

    Map<String,Object> selectCastNetDanFcltList(DanFcltVO vo) throws Exception;

    List<EgovMap> selectDanFcltUsedTy(DanFcltVO vo) throws Exception;

    List<EgovMap> selectDanFcltUsedTyAll() throws Exception;

    int selectEsListTotCnt(EsVO vo) throws  Exception;

    List<EgovMap> selectEsList(EsVO vo) throws  Exception;

    EgovMap selectEvent(EventVO vo) throws  Exception;

    EgovMap selectAutoDisList(EsVO vo) throws Exception;

    int mergeEsUserMntrList(EsVO vo) throws Exception;

    int insertEsUserMntrList(LoginVO vo) throws Exception;

    Map<String, String> smsSend(DanFcltVO danFcltVO, EventVO eventVO) throws Exception;

    int updateSmsSendStatus(String seq) throws Exception;

    int updateSmsRcvStatus(String seq) throws Exception;

    List<EgovMap> getUmdLi(AddrVO vo) throws Exception;

    int selectPortalSearchListTotCnt(CommonVO vo) throws Exception;

    List<EgovMap> selectPortalSearchList(CommonVO vo) throws Exception;
}
