/**
 * ----------------------------------------------------------------------------------------------
/ * @Class Name : MntrMainController.java
 * @Description : 
 * @Version : 1.0
 * Copyright (c) 2014 by KR.CO.UCP.CNU All rights reserved.
 * @Modification Information
 * ----------------------------------------------------------------------------------------------
 * DATE AUTHOR DESCRIPTION
 * ----------------------------------------------------------------------------------------------
 * 2015. 10. 22. SaintJuny 최초작성
 *
 * ----------------------------------------------------------------------------------------------
 */
package kr.co.ucp.dan.monitor.main.web;

import com.google.common.base.Joiner;
import com.hazelcast.impl.concurrentmap.QueryException;
import egovframework.rte.psl.dataaccess.util.EgovMap;
import egovframework.rte.ptl.mvc.tags.ui.pagination.PaginationInfo;
import kr.co.ucp.dan.cmm.EgovUserDetailsHelper;
import kr.co.ucp.dan.login.service.LgnLoginService;
import kr.co.ucp.dan.login.vo.ConfigureVO;
import kr.co.ucp.dan.login.vo.LoginVO;
import kr.co.ucp.dan.monitor.cmm.vo.CommonVO;
import kr.co.ucp.dan.monitor.main.service.DanFcltMntrService;
import kr.co.ucp.dan.monitor.main.vo.AddrVO;
import kr.co.ucp.dan.monitor.main.vo.DanFcltVO;
import kr.co.ucp.dan.monitor.main.vo.EsVO;
import kr.co.ucp.dan.monitor.main.vo.EventVO;
import kr.co.ucp.dan.monitor.util.GisUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.UncategorizedSQLException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.net.URLDecoder;
import java.util.*;

import static kr.co.ucp.dan.monitor.cmm.util.CommonUtil.setCommonVOData;
import static kr.co.ucp.dan.monitor.cmm.util.CommonUtil.setPaginationInfo;


@Controller
@RequestMapping(value = "dan")
public class DanFcltMntrController {


	@Resource(name = "config")
	private Properties config;

	@Resource(name = "gisUtil")
	private GisUtil gisUtil;

	@Resource(name = "danFcltMntrService")
	private DanFcltMntrService danFcltMntrService;

//	@Resource(name = "webSocketVerticle")
//	private WebSocketVerticle webSocketVerticle;
//
//	@Resource(name = "netSocketVerticle")
//	private NetSocketVerticle netSocketVerticle;

	@Resource(name = "lgnLoginService")
	private LgnLoginService lgnLoginService;

	private static Logger logger = LogManager.getLogger(DanFcltMntrController.class);

	@RequestMapping(value = "/monitor/main.do")
	public String viewMain(ModelMap model, @ModelAttribute CommonVO common, HttpServletRequest request) throws Exception {
		LoginVO lgnVO = null;
		String sysId = "scmp";

		if (EgovUserDetailsHelper.isAuthenticated()) {
			logger.debug("==================== 로그인 되어있음 ====================");
			lgnVO = (LoginVO) EgovUserDetailsHelper.getAuthenticatedUser();
		} else {
			if (null != common.getUserId()) {

				String decodeId = URLDecoder.decode(common.getUserId(), "UTF-8");

				Map<String, String> args = new HashMap<String, String>();
				args.put("userId", decodeId);
				lgnVO = lgnLoginService.login(args);

				logger.debug("=========== 로그인 ID:{}, 권한코드:{}", lgnVO.getMemId(), lgnVO.getAuthCd());

				if (null == lgnVO.getMemId() || lgnVO.getMemId().equals("")) {
					logger.debug("==================== ID 없음 ====================");
					return "redirect:/dan/login/login.do";
				}
				if( null == lgnVO.getAuthCd() || "".equals(lgnVO.getAuthCd()) ) {
					logger.debug("==================== 이용할수 없는 사용자({}) ====================",decodeId);
					return "redirect:/dan/login/login.do";
				}

				int r = lgnLoginService.insertConnectUserCnt(lgnVO);


				List<Map<String, String>> topMenuList = new ArrayList<Map<String, String>>();
				Map<String, Object> leftMenuMap = new HashMap<String, Object>();


				sysId = lgnVO.getAuthCd();
				args.put("sysCd", sysId);

				// userId 가 추가 되어야 함

				String menuId = "";
				List<Map<String, String>> leftMenuList = null;
				if (!menuId.equals("") && leftMenuList != null && leftMenuList.size() > 0) {
					leftMenuMap.put(menuId, leftMenuList);
				}



				String userId = lgnVO.getMemId();

				// 사용자 환경설정 읽어오기 20170306 space
				ConfigureVO configVO = new ConfigureVO();
				configVO.setUserId(userId);

				ConfigureVO configure = new ConfigureVO();

				// 1. 사용자 환경등록이 없는 경우 시스템아이디에서 읽어와서 insert
				if (null == configure)
				{
					configVO.setUserId(sysId);
					// 2.시스템아이디 환경정보가 없는 경우 scmp에서 확인
					// um_config_info 에 해당 센터에 맞게 user_id = scmp로 반드시 등록되어 있어야 한다.
					if (null == configure){
						configVO.setUserId("scmp");

						// 시스템 초기 환경설정   자동등록
						configure.setUserId(sysId);
					}
					// 시스템 환경설정가 있는 경우 사용자 환경설정정보 등록
					configure.setUserId(userId);
				}
				configure.setUcpId(config.getProperty("Globals.UcpId"));

				// 접속자 Ip
				configure.setNetworkIp(getClientIp(request));

				Map<String, String> ipMapping = new HashMap<String, String>();
				if (config.getProperty("Globals.IPMapping") != null && config.getProperty("Globals.IPMapping").equals("YES")) {
//					configure.setNetworkIp(getClientIp(request));
					List<ConfigureVO> ipMappingList = lgnLoginService.selectMappingIp(configure);
					logger.info("========== IP MAPPING ({}) ==========", configure.getNetworkIp());
					if (ipMappingList != null) {
						// 2017.02.09 space
						// rtsp server가 여러대 인경우 대비
						// utiDoan, utiDoanMp 미사용
						List<String> aryRtspIp 		= new ArrayList<String>();
						List<String> aryRtepIpMp 	= new ArrayList<String>();

						for (ConfigureVO vo : ipMappingList) {
							logger.info("GET MAPPING NETWORK ID : {}, IP : {}, MP_IP : {}", vo.getNetworkId(), vo.getNetworkIp(), vo.getNetworkMpIp());
							if (vo.getNetworkId().startsWith("GIS_")) {
								ipMapping.put("gis", vo.getNetworkIp());
								ipMapping.put("gisMp", vo.getNetworkMpIp());
							} else if (vo.getNetworkId().startsWith("SCMP_")) {
								if (vo.getNetworkId().startsWith("SCMP_IMG")) {
									ipMapping.put("scmpImg", vo.getNetworkIp());
									ipMapping.put("scmpImgMp", vo.getNetworkMpIp());
								} else {
									ipMapping.put("scmp", vo.getNetworkIp());
									ipMapping.put("scmpMp", vo.getNetworkMpIp());
								}
							} else if (vo.getNetworkId().startsWith("WEBSOC")) {
								ipMapping.put("websocket", vo.getNetworkIp());
								ipMapping.put("websocketMp", vo.getNetworkMpIp());
							} else if (vo.getNetworkId().startsWith("VMS_")) {
								ipMapping.put("vms", vo.getNetworkIp());
								ipMapping.put("vmsMp", vo.getNetworkMpIp());
							} else if (vo.getNetworkId().startsWith("RTSP_")) {
								aryRtspIp.add(vo.getNetworkIp());
								aryRtepIpMp.add(vo.getNetworkMpIp());
							} else if (vo.getNetworkId().startsWith("NVR_")) {
								ipMapping.put("nvr", vo.getNetworkIp());
								ipMapping.put("nvrMp", vo.getNetworkMpIp());
							}
							if (!aryRtspIp.isEmpty()){
								ipMapping.put("rtspIp", 	Joiner.on(",").join(aryRtspIp));
								ipMapping.put("rtspIpMp", 	Joiner.on(",").join(aryRtepIpMp));
								logger.debug("===== IP MAPPING =========={}:{}",ipMapping.get("rtspIp"),ipMapping.get("rtspIpMp"));
							}
						}
					}
				}
				else {
					logger.info("========== NO IP MAPPING ==========");
				}

				request.getSession().setAttribute("ipMapping", ipMapping);
				request.getSession().setAttribute("configure", configure);
				request.getSession().setAttribute("LoginVO", lgnVO);
				logger.debug("******** main  ******** user[{}]",lgnVO.getMemId());
			}
			else {
				logger.debug("==================== ID 못받음 ====================");
				return "redirect:/dan/login/login.do";
			}
		}
		String[] commonData = {
				"", "", ""
		};

		setCommonVOData(common, commonData);
		model.addAttribute("common", common);
		danFcltMntrService.insertEsUserMntrList(lgnVO);
		return "mntr/main/index";
	}

	public String getClientIp(HttpServletRequest request) {
		String clientIp = request.getHeader("X-Forwarded-For");

		if (clientIp == null || clientIp.length() == 0 || "unknown".equalsIgnoreCase(clientIp)) {
			clientIp = request.getHeader("Proxy-Client-IP");
		}
		if (clientIp == null || clientIp.length() == 0 || "unknown".equalsIgnoreCase(clientIp)) {
			clientIp = request.getHeader("WL-Proxy-Client-IP");
		}
		if (clientIp == null || clientIp.length() == 0 || "unknown".equalsIgnoreCase(clientIp)) {
			clientIp = request.getHeader("HTTP_CLIENT_IP");
		}
		if (clientIp == null || clientIp.length() == 0 || "unknown".equalsIgnoreCase(clientIp)) {
			clientIp = request.getHeader("HTTP_X_FORWARDED_FOR");
		}
		if (clientIp == null || clientIp.length() == 0 || "unknown".equalsIgnoreCase(clientIp)) {
			clientIp = request.getRemoteAddr();
		}
		return clientIp;
	}

	/*
	 * 이벤트 종류 리스트를 가져온다.
	 */
	@RequestMapping(value = "/monitor/eventKindList.json", method = RequestMethod.POST)
	public @ResponseBody
	Map<String, Object> getEventKindList(@ModelAttribute EventVO vo) throws Exception {
		LoginVO lgnVO = (LoginVO) EgovUserDetailsHelper.getAuthenticatedUser();
		vo.setUserId(lgnVO.getMemId());
		List list = danFcltMntrService.selectEventKindList(vo);

		Map<String, Object> resultMap = new LinkedHashMap<String, Object>();
		resultMap.put("list", list);
		return resultMap;
	}

	/*
	 * 위험시설물 사용유형 종류 리스트 모두 가져온다.
	 */
	@RequestMapping(value = "/monitor/selectDanFcltUsedTyAll.json", method = RequestMethod.POST)
	public @ResponseBody
	Map<String, Object> selectDanFcltUsedTyAll(HttpServletRequest request) throws Exception {
		Map<String, Object> resultMap = new LinkedHashMap<String, Object>();
		@SuppressWarnings("unchecked")
		List<EgovMap> danFcltCtlUsedTyList = (List<EgovMap>) request.getSession().getAttribute("danFcltCtlUsedTyList");
		if(danFcltCtlUsedTyList != null && danFcltCtlUsedTyList.size() > 0) {
			DanFcltVO vo = new DanFcltVO();
			vo.setDanFcltCtlUsedTyList(danFcltCtlUsedTyList);
			resultMap.put("list", danFcltMntrService.selectDanFcltUsedTy(vo));
		}
		else {
			resultMap.put("list", danFcltMntrService.selectDanFcltUsedTyAll());

		}
		return resultMap;
	}

	/* 위험시설물 위치정보 데이터를 가져온다. */
	@RequestMapping(value = "/monitor/danFcltGeoData.json", method = RequestMethod.POST)
	public @ResponseBody
	Map<String, Object> getDanFcltGeoData(@ModelAttribute DanFcltVO vo) throws Exception {
		List<EgovMap> list = danFcltMntrService.selectDanFcltGeoData(vo);
		return gisUtil.createGeoJson(list, "pointX", "pointY");
	}

	/* 진행중인 이벤트 위치정보 데이터를 가져온다. */
	@RequestMapping(value = "/monitor/unfinishedEventGeoData.json", method = RequestMethod.POST)
	public @ResponseBody
	Map<String, Object> getUnfinishedEventGeoData(@ModelAttribute DanFcltVO vo) throws Exception {
		LoginVO lgnVO = (LoginVO) EgovUserDetailsHelper.getAuthenticatedUser();
		vo.setUserId(lgnVO.getMemId());

		vo.setBoundsLeft(config.getProperty("Mntr.Gis.BoundsLeft"));
		vo.setBoundsBottom(config.getProperty("Mntr.Gis.BoundsBottom"));
		vo.setBoundsRight(config.getProperty("Mntr.Gis.BoundsRight"));
		vo.setBoundsTop(config.getProperty("Mntr.Gis.BoundsTop"));

		List<EgovMap> list = danFcltMntrService.selectUnfinishedEventGeoData(vo);
		return gisUtil.createGeoJson(list, "pointX", "pointY");
	}

	/* 시설물 아이디로 시설물정보 데이터를 가져온다. */
	@RequestMapping(value = "/monitor/danFcltById.json", method = RequestMethod.POST)
	public @ResponseBody
	EgovMap getDanFcltById(@ModelAttribute DanFcltVO vo) throws Exception {
		EgovMap map = danFcltMntrService.selectDanFcltById(vo);
		return map;
	}

	/* 화재지점 주변 위험시설물 목록 결과를 가져온다. */
	@RequestMapping(value = "/monitor/nearestDanFcltList.json", method = RequestMethod.POST)
	public @ResponseBody
	Map<String, Object> getNearestDanFcltList(@ModelAttribute DanFcltVO vo, ModelMap model, HttpServletRequest request) throws Exception {
		List<EgovMap> danFcltCtlUsedTyList = (List<EgovMap>) request.getSession().getAttribute("danFcltCtlUsedTyList");
		logger.info("============= nearestDanFcltList ==============");
		// 선택된 레이어 조건 참여
		if (!(vo.getSearchDanFcltType() == null || "".equals(vo.getSearchDanFcltType()))) {
			if (danFcltCtlUsedTyList == null) danFcltCtlUsedTyList = new ArrayList<EgovMap>();
			String[] sU = (vo.getSearchDanFcltType()).split(",");
			for (int i = 0; i < sU.length; i++) {
				EgovMap em = new EgovMap();
				em.put("danFcltUsedTyCd", sU[i]);
				danFcltCtlUsedTyList.add(em);
			}
			logger.info("danFcltCtlUsedTyList : {} ", danFcltCtlUsedTyList.toString());
		}
		if (danFcltCtlUsedTyList != null && danFcltCtlUsedTyList.size() > 0) {
			vo.setDanFcltCtlUsedTyList(danFcltCtlUsedTyList);
		}

		PaginationInfo paginationInfo = setPaginationInfo(vo);
		int totCnt = danFcltMntrService.selectNearestDanFcltListTotCnt(vo);
		paginationInfo.setTotalRecordCount(totCnt);

		List<EgovMap> list = danFcltMntrService.selectNearestDanFcltList(vo);

		Map<String, Object> danFcltMap = gisUtil.createGeoJson(list, "pointX", "pointY");

		Map<String, Object> resultMap = new LinkedHashMap<String, Object>();
		resultMap.put("totalPages", paginationInfo.getTotalPageCount());
		resultMap.put("totalRows", totCnt);
		resultMap.put("rows", list);
		resultMap.put("page", vo.getPage());
		resultMap.put("geoJson", danFcltMap);
		return resultMap;
	}

	@RequestMapping(value = "/monitor/castNetDanFcltList.json", method = RequestMethod.POST)
	public @ResponseBody
	Map<String, Object> getCastNetDanFcltList(@ModelAttribute DanFcltVO vo, ModelMap model, HttpServletRequest request) throws Exception {
		List<EgovMap> danFcltCtlUsedTyList = (List<EgovMap>) request.getSession().getAttribute("danFcltCtlUsedTyList");
		logger.info("============= castNetDanFcltList ==============");
		// 선택된 레이어 조건 참여
		if (!(vo.getSearchDanFcltType() == null || "".equals(vo.getSearchDanFcltType()))) {
			if (danFcltCtlUsedTyList == null) danFcltCtlUsedTyList = new ArrayList<EgovMap>();
			String[] sU = (vo.getSearchDanFcltType()).split(",");
			for (int i = 0; i < sU.length; i++) {
				EgovMap em = new EgovMap();
				em.put("danFcltUsedTyCd", sU[i]);
				danFcltCtlUsedTyList.add(em);
			}
			logger.info("danFcltCtlUsedTyList : {} ", danFcltCtlUsedTyList.toString());
		}
		if (danFcltCtlUsedTyList != null && danFcltCtlUsedTyList.size() > 0) {
			vo.setDanFcltCtlUsedTyList(danFcltCtlUsedTyList);
		}
		return danFcltMntrService.selectCastNetDanFcltList(vo);
	}

	/*
	 * 통합검색 결과를 가져온다.
	 */
	@RequestMapping(value = "/monitor/portalSearch.json", method = RequestMethod.POST)
	public @ResponseBody
	Map<String, Object> getPortalSearchList(@ModelAttribute CommonVO vo, ModelMap model) throws Exception {
		PaginationInfo paginationInfo = setPaginationInfo(vo);
		int totCnt = danFcltMntrService.selectPortalSearchListTotCnt(vo);
		paginationInfo.setTotalRecordCount(totCnt);

		List<EgovMap> list = danFcltMntrService.selectPortalSearchList(vo);

		Map<String, Object> resultMap = new LinkedHashMap<String, Object>();
		resultMap.put("totalPages", paginationInfo.getTotalPageCount());
		resultMap.put("totalRows", totCnt);
		resultMap.put("rows", list);
		resultMap.put("page", vo.getPage());
		return resultMap;
	}

	/**
	 * 화재리스트 요청
	 * @param vo
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/monitor/fireListReq.json", method = RequestMethod.POST)
	public @ResponseBody
	Map<String, Object> getFireListReq(@ModelAttribute EsVO vo, ModelMap model) throws Exception {
		LoginVO lgnVO = (LoginVO) EgovUserDetailsHelper.getAuthenticatedUser();
		vo.setUserId(lgnVO.getMemId());

		vo.setBoundsLeft(config.getProperty("Mntr.Gis.BoundsLeft"));
		vo.setBoundsBottom(config.getProperty("Mntr.Gis.BoundsBottom"));
		vo.setBoundsRight(config.getProperty("Mntr.Gis.BoundsRight"));
		vo.setBoundsTop(config.getProperty("Mntr.Gis.BoundsTop"));

		vo.setSysCd(lgnVO.getAuthCd());

		PaginationInfo paginationInfo = setPaginationInfo(vo);
		int totCnt = danFcltMntrService.selectEsListTotCnt(vo);
		paginationInfo.setTotalRecordCount(totCnt);
		List<EgovMap> list = danFcltMntrService.selectEsList(vo);

		Map<String, Object> resultMap = new LinkedHashMap<String, Object>();
		resultMap.put("totalPages", paginationInfo.getTotalPageCount());
		resultMap.put("totalRows", totCnt);
		resultMap.put("rows", list);
		resultMap.put("page", vo.getPage());
		return resultMap;
	}

	@RequestMapping(value = "/monitor/eventById.json", method = RequestMethod.POST)
	public @ResponseBody
	EgovMap getEventById(@ModelAttribute EventVO vo) throws Exception {
		EgovMap map = danFcltMntrService.selectEvent(vo);
		return map;
	}

	/**
	 * 자동표출유무
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/monitor/autoDisList.json", method = RequestMethod.POST)
	public @ResponseBody
	EgovMap getAutoDisList(@ModelAttribute EsVO vo, @ModelAttribute DanFcltVO danFcltVO, @ModelAttribute EventVO eventVO, HttpServletRequest request) throws Exception {
		LoginVO lgnVO = (LoginVO) EgovUserDetailsHelper.getAuthenticatedUser();
		vo.setUserId(lgnVO.getMemId());
		vo.setSysCd(lgnVO.getAuthCd());

		List<EgovMap> danFcltCtlUsedTyList = (List<EgovMap>) request.getSession().getAttribute("danFcltCtlUsedTyList");
		// 선택된 레이어 조건 참여
		if (!(danFcltVO.getSearchDanFcltType() == null || "".equals(danFcltVO.getSearchDanFcltType()))) {
			if (danFcltCtlUsedTyList == null) danFcltCtlUsedTyList = new ArrayList<EgovMap>();
			String[] sU = (danFcltVO.getSearchDanFcltType()).split(",");
			for (int i = 0; i < sU.length; i++) {
				EgovMap em = new EgovMap();
				em.put("danFcltUsedTyCd", sU[i]);
				danFcltCtlUsedTyList.add(em);
			}
			logger.info("danFcltCtlUsedTyList : {} ", danFcltCtlUsedTyList.toString());
		}
		if (danFcltCtlUsedTyList != null && danFcltCtlUsedTyList.size() > 0) {
			danFcltVO.setDanFcltCtlUsedTyList(danFcltCtlUsedTyList);
		}

		logger.debug("====== autoDisList ========> userid[{}],EvtOcrNo[{}]",vo.getUcpId(), vo.getEvtOcrNo());
		EgovMap map = danFcltMntrService.selectAutoDisList(vo);
		danFcltMntrService.mergeEsUserMntrList(vo);

		// SMS 송신
		try{
			Map<String, String> result = new HashMap<String, String>();
			try {
				result = danFcltMntrService.smsSend(danFcltVO,eventVO);
				if(Integer.parseInt(result.get("insertResult")) > 0 ) {
					danFcltMntrService.updateSmsSendStatus(result.get("seq"));
					danFcltMntrService.updateSmsRcvStatus(result.get("seq"));
				}
			} catch(DataIntegrityViolationException e) {
				System.out.println(e.getRootCause());
			} catch(UncategorizedSQLException e) {
				System.out.println(e.getCause());
			}catch(Exception e){
				logger.error("smsSend Exception : {}", e.getMessage());
			}
		}
		catch(QueryException e) {
			logger.error("QueryException  : {}", e.getMessage());
		}
		return map;
	}

	@RequestMapping(value = "/monitor/getUmdLi.json")
	public @ResponseBody
	Map<String, Object> getUmdLi(@ModelAttribute("gisCdParamVO") AddrVO vo, ModelMap model) throws Exception {

		List<EgovMap> list = danFcltMntrService.getUmdLi(vo);
		Map<String, Object> resultMap = new LinkedHashMap<String, Object>();

		resultMap.put("list", list);
		return resultMap;
	}

}
