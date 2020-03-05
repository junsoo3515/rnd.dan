/**
 * --------------------------------------------------------------------------------------------------------------
 * @Class Name : LgnLoginController.java
 * @Description : 일반 로그인을 처리하는 컨트롤러 클래스
 * @Version : 1.0
 * Copyright (c) 2016 by KR.CO.UCP.CNU All rights reserved.
 * @Modification Information
 * --------------------------------------------------------------------------------------------------------------
 * DATE            AUTHOR      DESCRIPTION
 * --------------------------------------------------------------------------------------------------------------
 * 2016. 11.08.    seungJun    최초작성
 * --------------------------------------------------------------------------------------------------------------
 */
package kr.co.ucp.dan.login.web;

import egovframework.rte.fdl.cmmn.trace.LeaveaTrace;
import egovframework.rte.fdl.property.EgovPropertyService;
import kr.co.ucp.dan.cmm.EgovMessageSource;
import kr.co.ucp.dan.login.service.LgnLoginService;
import kr.co.ucp.dan.login.vo.ConfigureVO;
import kr.co.ucp.dan.login.vo.LoginVO;
import kr.co.ucp.dan.util.fcc.service.EgovStringUtil;
import kr.co.ucp.dan.util.sim.service.EgovFileScrty;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

@Controller
public class LgnLoginController
{
	private final Logger logger = LogManager.getLogger(this.getClass());

	@Resource(name = "lgnLoginService")
	private LgnLoginService lgnLoginService;
	@Resource(name="egovMessageSource")
	EgovMessageSource egovMessageSource;

	// EgovPropertyService
	@Resource(name = "propertiesService")
	protected EgovPropertyService propertiesService;

	@Resource(name="config")
	private Properties config;

	@Resource(name="leaveaTrace")
	LeaveaTrace leaveaTrace;

	// 로그인 화면
	@RequestMapping(value="/dan/login/login.do")
	public String view(@ModelAttribute("loginVO") LoginVO loginVO, HttpServletRequest request, HttpServletResponse response, ModelMap model) throws Exception
	{
		String rst  = "login/lgn/login";
		logger.debug("===================  /dan/login/login.do >>>> {}", rst);
		return rst;
	}

	@RequestMapping(value="/dan/login/redirect.do")
	public String view_redirect(@ModelAttribute("loginVO") LoginVO loginVO, HttpServletRequest request, HttpServletResponse response, ModelMap model) throws Exception {
		logger.debug("******** redirect start ******** {}","login");
		return "login/lgn/redirect";
	}

	// 로그인
	@RequestMapping(value="/dan/login/login.json")
	@ResponseBody
	public Map<String, Object> getList(ModelMap model ,HttpServletRequest request ,HttpServletResponse response ) throws Exception
	{
		String userId = (String)request.getParameter("memId");
		String pwd = (String)request.getParameter("pwd");
		String sysId = "scmp";

		if( null == pwd ) {
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("msg", "비밀번호의 값이 없습니다.");
			return map;
		}

		String saltText = EgovStringUtil.isNullToStr(propertiesService.getString("Globals.SaltText").trim(), "scmpworld");   // 암호화 보안 적용
		String dbEncryptTag = EgovStringUtil.isNullToStr(propertiesService.getString("Globals.DBEncrypt").trim(), "UCP");    // DBEncrypt 적용 (Egov)

		if ("UCP".equals(dbEncryptTag)) {
			pwd = EgovFileScrty.encryptPassword(pwd, saltText);
		}

		Map<String, String> args = new HashMap<String, String>();
		args.put("memId", userId);
		args.put("pwd", pwd);
		args.put("dbEncryptTag", dbEncryptTag);

		LoginVO resultVO = new LoginVO();
		resultVO = lgnLoginService.login(args);

		logger.debug("Egov lgnLog userId:{},pw:{},dbEnc:{},AuthCd:{}", userId, pwd, dbEncryptTag, resultVO.getAuthCd());

		Map<String, Object> map = new HashMap<String, Object>();
		if( null == resultVO.getMemId() || resultVO.getMemId().equals(""))
		{
			map.put("session", 1);
			map.put("ret", -1);
			map.put("msg", "로그인 할 수 없습니다.");
			return map;
		}

		sysId = resultVO.getAuthCd();
		args.put("sysId", sysId);

		int r = lgnLoginService.insertConnectUserCnt(resultVO);

		args.put("sysCd", sysId);


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
				logger.debug("******** configure insert  ******** sysId[{}]",sysId);
			}
			// 시스템 환경설정가 있는 경우 사용자 환경설정정보 등록
			configure.setUserId(userId);
			logger.debug("******** configure insert******** user[{}]",userId);
		}
		configure.setUcpId(config.getProperty("Globals.UcpId"));

		// 접속자 Ip
		configure.setNetworkIp(getClientIp(request));

		if(config.getProperty("Globals.IPMapping") != null && config.getProperty("Globals.IPMapping").equals("YES"))
		{
			logger.info("========== IP MAPPING ({}) ==========", configure.getNetworkIp());
		} else {
			logger.info("========== NO IP MAPPING ==========");
		}

		request.getSession().setAttribute("configure", configure);
		request.getSession().setAttribute("LoginVO", resultVO);

		logger.debug("******** login  ******** user[{}],{}",resultVO.getMemId(),resultVO.getAuthCd());

		map.put("session", 1);
		map.put("ret", 1);
		map.put("msg", "");
		map.put("redirect", "dan/monitor/main.do");

		logger.debug("******** main redirect  ******** {}","main");

		return map;
	}

	// 비밀번호 찾기 화견
	@RequestMapping(value="/dan/login/findpwd.do")
	public String findPwd(@ModelAttribute("loginVO") LoginVO loginVO, HttpServletRequest request, HttpServletResponse response, ModelMap model) throws Exception {
		return "login/lgn/findpwd";
	}

	// 비밀번호 찾기
	@RequestMapping(value="/dan/login/findpwd.json")
	@ResponseBody
	public Map<String, Object> findPwd(ModelMap model ,HttpServletRequest request ,HttpServletResponse response ) throws Exception
	{
		String userId = request.getParameter("userId");
		String userNm = (String)request.getParameter("userNm");
		String moblNo = (String)request.getParameter("moblNo");

		Map<String, String> args = new HashMap<String, String>();
		args.put("userId", userId);
		args.put("userNm", userNm);
		args.put("moblNo", moblNo);

		LoginVO resultVO = lgnLoginService.findPwd(args);
		Map<String, Object> map = new HashMap<String, Object>();
		if(resultVO.getMemId() == null || resultVO.getMemId().equals("")) {
			map.put("session", 1);
			map.put("ret", -1);
			map.put("msg", "사용자 정보를 찾을 수 없습니다.");
		} else {
			request.getSession().setAttribute("LoginVO", resultVO);
			map.put("session", 1);
			map.put("ret", 1);
			map.put("msg", "등록된 핸드폰으로 비밀번호를 발송하였습니다.");
		}
		return map;
	}

	// 로그아웃한다.
	@RequestMapping(value="/dan/login/logout.do")
	public String actionLogout(HttpServletRequest request, ModelMap model) throws Exception
	{
		try {
			RequestContextHolder.getRequestAttributes().removeAttribute("LoginVO", RequestAttributes.SCOPE_SESSION);
		} catch (Exception e) {
			leaveaTrace.trace("fail.common.msg", this.getClass());
		}

		String ssoLoginTag = propertiesService.getString("Globals.SSOLogin");
			logger.debug("******** {}  ********","logout");
			return "forward:/dan/login/login.do";
	}

	public String getClientIp(HttpServletRequest request)
	{
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
}