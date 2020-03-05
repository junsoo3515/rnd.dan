package kr.co.ucp.dan.monitor.main.mapper;

import egovframework.rte.psl.dataaccess.mapper.Mapper;
import egovframework.rte.psl.dataaccess.util.EgovMap;
import kr.co.ucp.dan.login.vo.LoginVO;
import kr.co.ucp.dan.monitor.cmm.vo.CommonVO;
import kr.co.ucp.dan.monitor.main.vo.*;

import java.util.List;
import java.util.Map;

@Mapper("danFcltMapper")
public interface DanFcltMapper {

    public int isExistsEvent(EventVO vo) throws Exception;

    public List selectEventKindList(EventVO vo) throws Exception;

    public List<EgovMap> selectDanFcltGeoData(DanFcltVO vo) throws Exception;

    public List<EgovMap> selectUnfinishedEventGeoData(DanFcltVO vo) throws Exception;

    public int selectNearestDanFcltListTotCnt(DanFcltVO vo) throws Exception;

    public List<EgovMap> selectNearestDanFcltList(DanFcltVO vo) throws Exception;

    public List<EgovMap> selectDanFcltUsedTy(DanFcltVO vo) throws Exception;

    public List<EgovMap> selectDanFcltUsedTyAll() throws Exception;

    public List<EgovMap> selectNearestDanFcltForCastNet(DanFcltVO vo) throws Exception;

    public EgovMap selectDanFcltById(DanFcltVO vo) throws Exception;

    public int selectEsListTotCnt(EsVO vo) throws Exception;

    public List<EgovMap> selectEsList(EsVO vo) throws Exception;

    public EgovMap selectEvent(EventVO vo) throws Exception;

    public EgovMap selectAutoDisList(EsVO vo) throws Exception;

    public int mergeEsUserMntrList(EsVO vo) throws Exception;

    public int insertEsUserMntrList(LoginVO vo) throws Exception;

    public int insertSmsSend(SmsVO smsVO) throws Exception;

    public void insertSmsRecv(Map<String, String> smsRcvInfoMap) throws Exception;

    public String selectSmsSeq() throws Exception;

    public int updateSmsSendStatus(String seq) throws Exception;

    public int updateSmsRcvStatus(String seq) throws Exception;

    public List<EgovMap> getUmdLi(AddrVO vo) throws Exception;

    public int selectPortalSearchListTotCnt(CommonVO vo) throws Exception;

    public List<EgovMap> selectPortalSearchList(CommonVO vo) throws Exception;

}

